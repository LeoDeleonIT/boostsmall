"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, limits } from "@/lib/rate-limit";
import { sendNewReviewEmail } from "@/lib/email";

// ─── Write or edit a review ────────────────────────────────────────────────
// Uses upsert against the @@unique([userId, businessId]) constraint so a
// second submission from the same user edits their existing review rather
// than failing.

const ReviewSchema = z.object({
  businessSlug: z.string().min(1).max(120),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().min(20, "Tell us a bit more — at least 20 characters.").max(4000),
  visitDate: z
    .string()
    .optional()
    .transform((v) => (v && v.length ? new Date(v) : undefined))
    .refine((d) => d === undefined || !Number.isNaN(d.getTime()), {
      message: "Invalid visit date",
    }),
});

export async function submitReviewAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const slug = (formData.get("businessSlug") as string) ?? "";

  const parsed = ReviewSchema.safeParse({
    businessSlug: slug,
    rating: formData.get("rating"),
    body: formData.get("body"),
    visitDate: formData.get("visitDate"),
  });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "invalid";
    redirect(
      `/b/${encodeURIComponent(slug)}/review?error=${encodeURIComponent(firstIssue)}`
    );
  }

  // Rate-limit per user to discourage spam / brigading.
  const rl = rateLimit(`review:${session.user.id}`, limits.review);
  if (!rl.ok) {
    redirect(`/b/${encodeURIComponent(slug)}/review?error=rate-limited`);
  }

  const business = await db.business.findUnique({
    where: { slug: parsed.data.businessSlug },
    select: { id: true, slug: true },
  });
  if (!business) {
    redirect("/search?error=not-found");
  }

  // Block reviews by the business's own owners. Reasonable trust signal.
  const ownsBusiness = await db.businessOwner.findFirst({
    where: { userId: session.user.id, businessId: business.id },
    select: { id: true },
  });
  if (ownsBusiness) {
    redirect(`/b/${business.slug}?error=owner-cant-review`);
  }

  // Detect new-vs-edit so we only email owners about the first post, not
  // every edit. We look first, then upsert.
  const previous = await db.review.findUnique({
    where: { userId_businessId: { userId: session.user.id, businessId: business.id } },
    select: { id: true },
  });
  const isFirstReview = !previous;

  const review = await db.review.upsert({
    where: {
      userId_businessId: {
        userId: session.user.id,
        businessId: business.id,
      },
    },
    update: {
      rating: parsed.data.rating,
      body: parsed.data.body,
      visitDate: parsed.data.visitDate,
    },
    create: {
      userId: session.user.id,
      businessId: business.id,
      rating: parsed.data.rating,
      body: parsed.data.body,
      visitDate: parsed.data.visitDate,
    },
    select: { id: true },
  });

  // Notify verified owners about the new review (fire-and-forget).
  if (isFirstReview) {
    const ctx = await db.business.findUnique({
      where: { id: business.id },
      select: {
        name: true,
        owners: { select: { user: { select: { email: true, name: true } } } },
      },
    });
    const reviewerName =
      session.user.name ?? session.user.username ?? "A neighbor";
    const excerpt =
      parsed.data.body.length > 220
        ? parsed.data.body.slice(0, 220) + "…"
        : parsed.data.body;
    if (ctx) {
      for (const o of ctx.owners) {
        if (!o.user?.email) continue;
        void sendNewReviewEmail({
          to: o.user.email,
          toName: o.user.name,
          businessName: ctx.name,
          businessSlug: business.slug,
          reviewId: review.id,
          rating: parsed.data.rating,
          reviewerName,
          bodyExcerpt: excerpt,
        });
      }
    }
  }

  revalidatePath(`/b/${business.slug}`);
  redirect(`/b/${business.slug}?reviewed=1`);
}

// ─── Delete a photo from your own review ───────────────────────────────────
// Called from the ReviewPhotoManager via a client transition.

export async function deleteReviewPhotoAction(photoId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Not signed in");

  const photo = await db.photo.findUnique({
    where: { id: photoId },
    select: {
      id: true,
      userId: true,
      review: { select: { id: true, userId: true, business: { select: { slug: true } } } },
    },
  });
  if (!photo) throw new Error("Photo not found");
  // Only the review author can remove photos from their review.
  if (!photo.review || photo.review.userId !== session.user.id) {
    throw new Error("Not allowed");
  }

  await db.photo.delete({ where: { id: photoId } });
  revalidatePath(`/b/${photo.review.business.slug}`);
  revalidatePath(`/b/${photo.review.business.slug}/review`);
}

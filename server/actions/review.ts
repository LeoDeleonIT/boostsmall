"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, limits } from "@/lib/rate-limit";

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

  await db.review.upsert({
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
  });

  revalidatePath(`/b/${business.slug}`);
  redirect(`/b/${business.slug}?reviewed=1`);
}

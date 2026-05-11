"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, limits } from "@/lib/rate-limit";

// ─── Owner response to a review ────────────────────────────────────────────
// Only verified owners of the business can respond. Empty body deletes
// the existing response (gives the owner a way to retract).

const RespondSchema = z.object({
  reviewId: z.string().min(1).max(64),
  body: z.string().trim().max(2000),
});

export async function submitOwnerResponseAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const parsed = RespondSchema.safeParse({
    reviewId: formData.get("reviewId"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    redirect("/owner/dashboard?error=invalid-response");
  }

  // Reuse the review preset — a response is a similar write-rate concern.
  const rl = rateLimit(`respond:${session.user.id}`, limits.review);
  if (!rl.ok) {
    redirect("/owner/dashboard?error=rate-limited");
  }

  // Look up the review + the business + verify the current user owns it.
  const review = await db.review.findUnique({
    where: { id: parsed.data.reviewId },
    select: {
      id: true,
      business: {
        select: {
          slug: true,
          owners: { select: { userId: true } },
        },
      },
    },
  });
  if (!review) {
    redirect("/owner/dashboard?error=not-found");
  }
  const isOwner = review.business.owners.some(
    (o) => o.userId === session.user.id
  );
  if (!isOwner) {
    redirect(`/b/${review.business.slug}?error=not-owner`);
  }

  const body = parsed.data.body;
  await db.review.update({
    where: { id: review.id },
    data:
      body.length === 0
        ? { ownerResponse: null, ownerResponseAt: null }
        : { ownerResponse: body, ownerResponseAt: new Date() },
  });

  revalidatePath(`/b/${review.business.slug}`);
  redirect(`/b/${review.business.slug}?responded=1`);
}

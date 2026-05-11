"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, limits } from "@/lib/rate-limit";

// ─── Toggle a "helpful" vote ───────────────────────────────────────────────
// One vote per (user, review). Click again to un-vote. Review.helpfulCount
// stays in sync via a transaction so we never read a stale count.

const HelpfulSchema = z.object({
  reviewId: z.string().min(1).max(64),
  businessSlug: z.string().min(1).max(120),
});

export async function toggleHelpfulAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const parsed = HelpfulSchema.safeParse({
    reviewId: formData.get("reviewId"),
    businessSlug: formData.get("businessSlug"),
  });
  if (!parsed.success) {
    redirect("/");
  }
  const { reviewId, businessSlug } = parsed.data;

  // Reuse the review preset — vote toggling is the same write-rate concern.
  const rl = rateLimit(`helpful:${session.user.id}`, limits.review);
  if (!rl.ok) {
    redirect(`/b/${businessSlug}?error=rate-limited`);
  }

  await db.$transaction(async (tx) => {
    const existing = await tx.reviewHelpful.findUnique({
      where: {
        userId_reviewId: {
          userId: session.user.id,
          reviewId,
        },
      },
    });
    if (existing) {
      await tx.reviewHelpful.delete({ where: { id: existing.id } });
      await tx.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { decrement: 1 } },
      });
    } else {
      await tx.reviewHelpful.create({
        data: { userId: session.user.id, reviewId },
      });
      await tx.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { increment: 1 } },
      });
    }
  });

  revalidatePath(`/b/${businessSlug}`);
  redirect(`/b/${businessSlug}#review-${reviewId}`);
}

// ─── Report a review ───────────────────────────────────────────────────────
// Inserts a ModerationFlag(REVIEW). Admins triage in /admin.

const ReportSchema = z.object({
  reviewId: z.string().min(1).max(64),
  businessSlug: z.string().min(1).max(120),
  reason: z.string().trim().min(1).max(200),
});

export async function reportReviewAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const parsed = ReportSchema.safeParse({
    reviewId: formData.get("reviewId"),
    businessSlug: formData.get("businessSlug"),
    reason: formData.get("reason"),
  });
  if (!parsed.success) {
    const slug = (formData.get("businessSlug") as string) ?? "";
    redirect(`/b/${slug}?error=invalid-report`);
  }

  const rl = rateLimit(`report:${session.user.id}`, limits.review);
  if (!rl.ok) {
    redirect(`/b/${parsed.data.businessSlug}?error=rate-limited`);
  }

  // Block multiple reports from the same user on the same review — admins
  // shouldn't see duplicates.
  const already = await db.moderationFlag.findFirst({
    where: {
      targetType: "REVIEW",
      targetId: parsed.data.reviewId,
      reportedById: session.user.id,
    },
    select: { id: true },
  });
  if (already) {
    redirect(`/b/${parsed.data.businessSlug}?reported=already`);
  }

  await db.moderationFlag.create({
    data: {
      targetType: "REVIEW",
      targetId: parsed.data.reviewId,
      reason: parsed.data.reason,
      reportedById: session.user.id,
    },
  });

  revalidatePath(`/b/${parsed.data.businessSlug}`);
  revalidatePath("/admin");
  redirect(`/b/${parsed.data.businessSlug}?reported=1`);
}

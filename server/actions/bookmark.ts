"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, limits } from "@/lib/rate-limit";

// ─── Toggle a bookmark ─────────────────────────────────────────────────────
// Insert or delete one row in (userId, businessId). Used by the heart
// button on /b/[slug] and (optionally later) by business cards.

const BookmarkSchema = z.object({
  businessSlug: z.string().min(1).max(120),
});

export async function toggleBookmarkAction(formData: FormData) {
  const session = await auth();
  const slug = (formData.get("businessSlug") as string) ?? "";

  // Where to send the user after toggling. Caller passes a hidden field
  // (e.g. "/search?...") so card-side clicks don't yank you to the business
  // detail page. Whitelisted to internal paths to prevent open redirects.
  const requested = (formData.get("redirectTo") as string)?.trim() ?? "";
  const safeReturn =
    requested.startsWith("/") && !requested.startsWith("//")
      ? requested
      : `/b/${slug}`;

  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(safeReturn)}`);
  }

  const parsed = BookmarkSchema.safeParse({
    businessSlug: formData.get("businessSlug"),
  });
  if (!parsed.success) redirect("/");

  const rl = rateLimit(`bookmark:${session.user.id}`, limits.review);
  if (!rl.ok) {
    redirect(`${safeReturn}${safeReturn.includes("?") ? "&" : "?"}error=rate-limited`);
  }

  const business = await db.business.findUnique({
    where: { slug: parsed.data.businessSlug },
    select: { id: true, slug: true },
  });
  if (!business) redirect("/search?error=not-found");

  const existing = await db.bookmark.findUnique({
    where: {
      userId_businessId: {
        userId: session.user.id,
        businessId: business.id,
      },
    },
  });
  if (existing) {
    await db.bookmark.delete({ where: { id: existing.id } });
  } else {
    await db.bookmark.create({
      data: { userId: session.user.id, businessId: business.id },
    });
  }

  revalidatePath(`/b/${business.slug}`);
  revalidatePath("/u/saved");
  redirect(safeReturn);
}

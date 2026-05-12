import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { RatingInput } from "@/components/review/rating-input";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { findBusinessBySlug } from "@/lib/sample-businesses";
import {
  submitReviewAction,
  deleteReviewPhotoAction,
} from "@/server/actions/review";
import { ReviewPhotoManager } from "@/components/review/review-photo-manager";

export const metadata: Metadata = {
  title: "Write a review",
};

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string; "just-posted"?: string }>;
}

export default async function WriteReviewPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const { error } = sp;
  const justPosted = sp["just-posted"] === "1";

  const business = findBusinessBySlug(slug);
  if (!business) notFound();

  const session = await auth();
  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/b/${slug}/review`)}`);
  }

  // If the user already has a review on this business, prefill the form so
  // submitting edits the existing one (upsert in the action handles it).
  const businessRow = await db.business.findUnique({
    where: { slug },
    select: { id: true },
  });
  const existing = businessRow
    ? await db.review.findUnique({
        where: {
          userId_businessId: {
            userId: session.user.id,
            businessId: businessRow.id,
          },
        },
        select: {
          id: true,
          rating: true,
          body: true,
          visitDate: true,
          photos: {
            orderBy: { createdAt: "asc" },
            select: { id: true, url: true, width: true, height: true },
          },
        },
      })
    : null;

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-[720px] px-6 py-10">
          <Link
            href={`/b/${slug}`}
            className="text-sm text-ink-soft hover:text-ink"
          >
            ← back to {business.name}
          </Link>
          <h1
            className="mt-4 font-display text-ink leading-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            {existing ? "Edit your review" : "Write a review"}
          </h1>
          <p className="mt-2 text-ink-soft">
            {business.name} · {business.city}, {business.state}
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[720px] px-6 py-10">
          {error && (
            <div className="mb-6 rounded-2xl border border-terracotta/40 bg-terracotta/10 p-4 text-sm text-terracotta-deep">
              {errorMessage(error)}
            </div>
          )}

          {justPosted && existing && (
            <div className="mb-6 rounded-2xl border border-sage/40 bg-sage/10 p-4 text-sm text-ink">
              <p className="font-bold text-sage-deep">Review posted — thanks!</p>
              <p className="mt-1 text-ink-soft">
                Want to add photos? Scroll down to the photo section. You can
                also edit your review here any time.
              </p>
            </div>
          )}

          <form action={submitReviewAction} className="space-y-8">
            <input type="hidden" name="businessSlug" value={slug} />

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-sage-deep mb-3">
                Your rating
              </label>
              <RatingInput defaultValue={existing?.rating ?? 0} />
            </div>

            <div>
              <label
                htmlFor="body"
                className="block text-xs uppercase tracking-widest font-bold text-sage-deep mb-3"
              >
                Your review
              </label>
              <textarea
                id="body"
                name="body"
                rows={8}
                required
                minLength={20}
                maxLength={4000}
                defaultValue={existing?.body ?? ""}
                placeholder="What did you order? How was the service? Would you bring a friend?"
                className="w-full rounded-2xl border border-border-strong bg-surface px-4 py-3 text-base leading-relaxed text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-terracotta resize-y"
              />
              <p className="mt-2 text-xs text-ink-soft">
                At least 20 characters. Keep it about your own visit — no
                copy-paste, no insults, no shilling.
              </p>
            </div>

            <div>
              <label
                htmlFor="visitDate"
                className="block text-xs uppercase tracking-widest font-bold text-sage-deep mb-3"
              >
                When did you visit? <span className="text-ink-soft/70 normal-case tracking-normal font-normal">(optional)</span>
              </label>
              <input
                id="visitDate"
                name="visitDate"
                type="date"
                defaultValue={
                  existing?.visitDate
                    ? existing.visitDate.toISOString().slice(0, 10)
                    : ""
                }
                className="rounded-full border border-border-strong bg-surface px-4 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
              />
            </div>

            {!existing && (
              <p className="text-xs text-ink-soft">
                Want to add photos? You&apos;ll be able to upload them right
                after you post.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button asChild variant="ghost" size="lg">
                <Link href={`/b/${slug}`}>Cancel</Link>
              </Button>
              <Button type="submit" variant="warm" size="lg" className="rounded-full">
                {existing ? "Save changes" : "Post review"}
              </Button>
            </div>
          </form>

          {/* Photos: only available once the review exists (upload needs a
              reviewId). After posting, return to "Edit your review" to add
              photos. */}
          {existing && (
            <section className="mt-10 space-y-3 border-t border-border pt-8">
              <h2 className="text-xs uppercase tracking-widest font-bold text-sage-deep">
                Photos on your review
              </h2>
              <ReviewPhotoManager
                reviewId={existing.id}
                photos={existing.photos}
                onDeletePhoto={deleteReviewPhotoAction}
              />
            </section>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function errorMessage(code: string): string {
  if (code === "rate-limited") {
    return "You're posting reviews too fast. Take a breath and try again in a few minutes.";
  }
  if (code.includes("characters")) return code; // pass through the zod min-length message
  if (code === "invalid") return "Some of the form fields look wrong. Double-check and try again.";
  return code;
}

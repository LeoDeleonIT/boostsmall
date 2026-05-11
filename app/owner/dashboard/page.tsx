import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { categoryLabel, relativeTime } from "@/lib/format";
import { RatingStars } from "@/components/review/rating-stars";

export const metadata: Metadata = {
  title: "Owner dashboard",
  robots: { index: false, follow: false },
};

export default async function OwnerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ claimed?: string; updated?: string; info?: string }>;
}) {
  const { claimed, updated, info } = await searchParams;

  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/owner/dashboard");

  const owned = await db.businessOwner.findMany({
    where: { userId: session.user.id },
    include: {
      business: {
        select: {
          id: true,
          slug: true,
          name: true,
          city: true,
          state: true,
          status: true,
          category: true,
          subcategory: true,
          photos: { select: { url: true }, take: 1 },
          _count: { select: { reviews: { where: { status: "PUBLISHED" } } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Cross-business inbox: reviews on any of this user's owned businesses that
  // haven't been responded to yet. Newest first.
  const businessIds = owned.map((o) => o.business.id);
  const unrespondedReviews = businessIds.length
    ? await db.review.findMany({
        where: {
          businessId: { in: businessIds },
          status: "PUBLISHED",
          ownerResponse: null,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          rating: true,
          body: true,
          createdAt: true,
          user: { select: { name: true, username: true } },
          business: { select: { slug: true, name: true } },
        },
      })
    : [];

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader showSearch={false} />

      <section className="mx-auto max-w-[1200px] px-6 py-12 w-full">
        <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-2">
          Owner dashboard
        </p>
        <h1 className="font-display text-4xl text-ink leading-tight">
          {owned.length === 0
            ? "You haven't claimed any businesses yet."
            : `${owned.length} business${owned.length === 1 ? "" : "es"} you manage`}
        </h1>

        {(claimed || updated || info) && (
          <div className="mt-6 inline-block rounded-full bg-sage/10 px-4 py-2 text-sm font-semibold text-sage-deep">
            {claimed && <>✓ Claimed {claimed}.</>}
            {updated && <>✓ Updated {updated}.</>}
            {info === "already-owned" && <>You already own this listing.</>}
          </div>
        )}

        {owned.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-surface p-10 max-w-2xl">
            <p className="text-ink">
              Find your business and click <strong>&quot;Claim this listing&quot;</strong>.
              Verified owners can edit info, upload photos, and respond to
              reviews.
            </p>
            <Button variant="warm" className="mt-5" asChild>
              <Link href="/search">Find your business</Link>
            </Button>
          </div>
        ) : null}

        {/* INBOX — unresponded reviews across all owned businesses */}
        {unrespondedReviews.length > 0 && (
          <section className="mt-10">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-terracotta-deep mb-1">
                  Inbox
                </p>
                <h2 className="font-display text-2xl text-ink leading-tight">
                  {unrespondedReviews.length}{" "}
                  {unrespondedReviews.length === 1 ? "review" : "reviews"} waiting on
                  your response
                </h2>
              </div>
            </div>
            <ul className="space-y-3">
              {unrespondedReviews.map((r) => (
                <li
                  key={r.id}
                  className="rounded-2xl border border-border bg-surface p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-ink">{r.business.name}</span>
                      <span className="text-ink-soft/60">·</span>
                      <RatingStars rating={r.rating} size="sm" />
                      <span className="text-xs text-ink-soft">
                        {r.user.name ?? r.user.username ?? "Neighbor"} ·{" "}
                        {relativeTime(r.createdAt.toISOString())}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ink-soft line-clamp-2">
                      {r.body}
                    </p>
                  </div>
                  <Button variant="sage" size="sm" asChild className="shrink-0">
                    <Link href={`/b/${r.business.slug}#review-${r.id}`}>
                      Respond →
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {owned.length > 0 && (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {owned.map((o) => (
              <article
                key={o.id}
                className="rounded-2xl border border-border bg-surface overflow-hidden"
              >
                <div className="relative aspect-[16/9] bg-ink/5">
                  {o.business.photos[0] && (
                    <Image
                      src={o.business.photos[0].url}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={o.business.status === "APPROVED" ? "sage" : "muted"}>
                      {o.business.status.toLowerCase()}
                    </Badge>
                    {o.isPrimary && <Badge variant="warm">Primary</Badge>}
                  </div>
                  <h2 className="font-display text-2xl text-ink leading-tight">
                    {o.business.name}
                  </h2>
                  <p className="text-sm text-ink-soft mt-1">
                    {o.business.subcategory ?? categoryLabel(o.business.category)} ·{" "}
                    {o.business.city}, {o.business.state}
                  </p>
                  <p className="text-xs text-ink-soft mt-2 tnum">
                    {o.business._count.reviews} review
                    {o.business._count.reviews === 1 ? "" : "s"} · verified{" "}
                    {o.verifiedAt.toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="sage" size="sm" asChild>
                      <Link href={`/owner/business/${o.business.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/b/${o.business.slug}`}>View page</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}

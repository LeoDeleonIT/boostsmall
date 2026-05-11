import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/review/rating-stars";
import { MapPin } from "@/components/icons";
import { MapboxMap } from "@/components/map/mapbox-map";
import {
  findBusinessBySlug,
  SAMPLE_BUSINESSES,
} from "@/lib/sample-businesses";
import { reviewsForBusiness } from "@/lib/sample-reviews";
import {
  categoryLabel,
  formatHours,
  formatPhone,
  priceLabel,
  relativeTime,
} from "@/lib/format";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { submitOwnerResponseAction } from "@/server/actions/respond";
import {
  toggleHelpfulAction,
  reportReviewAction,
} from "@/server/actions/review-feedback";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = findBusinessBySlug(slug);
  if (!b) return { title: "Not found" };
  return {
    title: b.name,
    description: b.description,
  };
}

export function generateStaticParams() {
  return SAMPLE_BUSINESSES.map((b) => ({ slug: b.slug }));
}

export default async function BusinessDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    reviewed?: string;
    responded?: string;
    reported?: string;
    error?: string;
  }>;
}) {
  const { slug } = await params;
  const { reviewed, responded, reported, error } = await searchParams;
  const business = findBusinessBySlug(slug);
  if (!business) notFound();

  const session = await auth();

  // Owner-uploaded photos lead, with seed photos backfilling behind so a
  // first owner upload doesn't wipe the existing gallery. Dedupe by URL in
  // case a seed photo got re-uploaded.
  const dbBusiness = await db.business.findUnique({
    where: { slug },
    select: {
      owners: { select: { userId: true } },
      photos: {
        where: { reviewId: null },
        orderBy: { createdAt: "desc" },
        select: { url: true },
      },
      reviews: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          body: true,
          createdAt: true,
          helpfulCount: true,
          ownerResponse: true,
          ownerResponseAt: true,
          user: { select: { name: true, username: true } },
          photos: {
            orderBy: { createdAt: "asc" },
            select: { id: true, url: true },
          },
        },
      },
    },
  });
  const ownerPhotos = dbBusiness?.photos.map((p) => p.url) ?? [];
  const seen = new Set(ownerPhotos);
  const photoUrls = [
    ...ownerPhotos,
    ...business.photoUrls.filter((url) => !seen.has(url)),
  ];

  // Real DB reviews lead; mock reviews fill in behind if there aren't enough
  // yet. Shape DB rows to match the SampleReview interface the renderer
  // expects so we don't have to fork the JSX.
  const realReviews = (dbBusiness?.reviews ?? []).map((r) => ({
    id: r.id,
    authorName: r.user.name ?? r.user.username ?? "Neighbor",
    authorUsername: r.user.username ?? "anon",
    rating: r.rating as 1 | 2 | 3 | 4 | 5,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
    helpfulCount: r.helpfulCount,
    ownerResponse:
      r.ownerResponse && r.ownerResponseAt
        ? { body: r.ownerResponse, at: r.ownerResponseAt.toISOString() }
        : undefined,
    photoUrls: r.photos.map((p) => p.url),
  }));
  const mockReviews = reviewsForBusiness(slug).map((r) => ({
    ...r,
    photoUrls: [] as string[],
  }));
  const reviews = [...realReviews, ...mockReviews];

  // Real review IDs — only these support the owner-response form (mocks
  // don't exist in the DB so the action would fail).
  const realReviewIds = new Set(realReviews.map((r) => r.id));
  const isOwner =
    !!session?.user?.id &&
    !!dbBusiness?.owners.some((o) => o.userId === session.user.id);

  // Which DB reviews has the current user marked helpful / reported? We use
  // these to highlight the buttons and prevent duplicate reports.
  const userHelpfulIds = new Set<string>();
  const userReportedIds = new Set<string>();
  if (session?.user?.id && realReviewIds.size > 0) {
    const reviewIds = [...realReviewIds];
    const [helpful, reports] = await Promise.all([
      db.reviewHelpful.findMany({
        where: { userId: session.user.id, reviewId: { in: reviewIds } },
        select: { reviewId: true },
      }),
      db.moderationFlag.findMany({
        where: {
          targetType: "REVIEW",
          targetId: { in: reviewIds },
          reportedById: session.user.id,
        },
        select: { targetId: true },
      }),
    ]);
    for (const h of helpful) userHelpfulIds.add(h.reviewId);
    for (const r of reports) userReportedIds.add(r.targetId);
  }
  const heroPhoto = photoUrls[0];
  const otherPhotos = photoUrls.slice(1, 5);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${business.addressLine1}, ${business.city}, ${business.state} ${business.postalCode}`
  )}`;

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* PHOTO STRIP */}
      <section className="bg-background-soft">
        <div className="mx-auto max-w-[1400px] px-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-2xl overflow-hidden">
            <div className="relative md:col-span-2 aspect-[4/3] md:aspect-[16/10] bg-ink/5">
              {heroPhoto && (
                <Image
                  src={heroPhoto}
                  alt={business.name}
                  fill
                  priority
                  sizes="(min-width: 768px) 66vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="hidden md:grid grid-rows-2 gap-2">
              {[0, 1].map((i) => {
                const p = otherPhotos[i] ?? heroPhoto;
                return (
                  <div key={i} className="relative aspect-[4/3] bg-ink/5">
                    {p && (
                      <Image
                        src={p}
                        alt=""
                        fill
                        sizes="33vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* HEADER */}
      <section className="bg-background-soft border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 pt-8 pb-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="muted">{categoryLabel(business.category)}</Badge>
                {business.ownerVerified && (
                  <Badge variant="sage">Owner verified</Badge>
                )}
                {business.recentlyAdded && (
                  <Badge variant="warm">New to boostsmall</Badge>
                )}
              </div>

              <h1 className="font-display text-4xl md:text-5xl mt-3 leading-tight text-ink">
                {business.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <RatingStars rating={business.rating} size="md" />
                <span className="font-bold text-ink tnum">
                  {business.rating.toFixed(1)}
                </span>
                <span className="text-ink-soft">
                  ({business.reviewCount.toLocaleString()} reviews)
                </span>
                <span className="text-ink-soft/60">·</span>
                <span className="text-ink-soft tnum">
                  {priceLabel(business.priceTier)}
                </span>
                <span className="text-ink-soft/60">·</span>
                <span className="text-ink-soft">{business.subcategory}</span>
              </div>

              {business.description && (
                <p className="mt-4 max-w-[68ch] text-ink leading-relaxed">
                  {business.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button variant="warm" size="lg" asChild>
                <Link href={`/b/${business.slug}/review`}>
                  Write a review
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href={directionsUrl} target="_blank" rel="noreferrer">
                  Get directions
                </a>
              </Button>
            </div>
          </div>

          {business.needsReview && (
            <p className="mt-6 text-xs text-terracotta-deep bg-terracotta/10 inline-block rounded-full px-3 py-1.5">
              ⚠ Mock data: {business.needsReview}
            </p>
          )}
        </div>
      </section>

      {/* CONTENT GRID */}
      <section className="mx-auto max-w-[1400px] px-6 py-12 grid lg:grid-cols-[1fr_360px] gap-12">
        {/* REVIEWS column */}
        <div>
          {reviewed === "1" && (
            <div className="mb-6 rounded-2xl border border-sage/40 bg-sage/10 p-4 text-sm text-sage-deep">
              ✓ Thanks for your review — it&apos;s now live for the neighborhood to see.
            </div>
          )}
          {responded === "1" && (
            <div className="mb-6 rounded-2xl border border-sage/40 bg-sage/10 p-4 text-sm text-sage-deep">
              ✓ Your response is posted under the review.
            </div>
          )}
          {reported === "1" && (
            <div className="mb-6 rounded-2xl border border-sage/40 bg-sage/10 p-4 text-sm text-sage-deep">
              ✓ Report sent. A moderator will take a look.
            </div>
          )}
          {reported === "already" && (
            <div className="mb-6 rounded-2xl border border-ink/20 bg-ink/5 p-4 text-sm text-ink-soft">
              You already reported this review — it&apos;s in the queue.
            </div>
          )}
          {error === "owner-cant-review" && (
            <div className="mb-6 rounded-2xl border border-terracotta/40 bg-terracotta/10 p-4 text-sm text-terracotta-deep">
              Verified owners can&apos;t review their own business. Reply to
              existing reviews from the owner dashboard instead.
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl text-ink">
              Reviews
              <span className="ml-2 text-ink-soft text-base font-normal">
                ({reviews.length} shown · {business.reviewCount.toLocaleString()} total)
              </span>
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/b/${business.slug}/review`}>Write yours</Link>
            </Button>
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center">
              <p className="text-ink-soft">
                No reviews yet on the mock data set. Be the first when the
                database lands.
              </p>
            </div>
          ) : (
            <ul className="space-y-6">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  id={`review-${r.id}`}
                  className="rounded-2xl border border-border bg-surface p-6 scroll-mt-24"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-ink">{r.authorName}</p>
                      <p className="text-xs text-ink-soft">
                        @{r.authorUsername} · {relativeTime(r.createdAt)}
                      </p>
                    </div>
                    <RatingStars rating={r.rating} size="sm" />
                  </div>
                  <p className="mt-4 text-ink leading-relaxed">{r.body}</p>

                  {r.photoUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {r.photoUrls.map((url) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="relative aspect-square overflow-hidden rounded-xl border border-border bg-ink/5"
                        >
                          <Image
                            src={url}
                            alt=""
                            fill
                            sizes="(min-width: 640px) 25vw, 50vw"
                            className="object-cover hover:scale-[1.03] transition-transform"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  {r.ownerResponse && (
                    <div className="mt-5 rounded-xl bg-sage/8 border border-sage/20 p-4">
                      <p className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-1.5">
                        Response from the owner
                      </p>
                      <p className="text-sm text-ink leading-relaxed">
                        {r.ownerResponse.body}
                      </p>
                      <p className="mt-2 text-xs text-ink-soft">
                        {relativeTime(r.ownerResponse.at)}
                      </p>
                    </div>
                  )}

                  {/* Owner-response form: shown only to verified owners
                      viewing a real (DB) review. <details> keeps it
                      collapsed by default with no client component. */}
                  {isOwner && realReviewIds.has(r.id) && (
                    <details className="mt-4 group">
                      <summary className="cursor-pointer list-none inline-flex items-center gap-1.5 text-xs font-bold text-sage-deep hover:text-ink select-none">
                        <span className="group-open:hidden">
                          {r.ownerResponse ? "Edit response →" : "Respond as owner →"}
                        </span>
                        <span className="hidden group-open:inline">↓ Close</span>
                      </summary>
                      <form
                        action={submitOwnerResponseAction}
                        className="mt-3 space-y-2"
                      >
                        <input type="hidden" name="reviewId" value={r.id} />
                        <textarea
                          name="body"
                          rows={3}
                          maxLength={2000}
                          defaultValue={r.ownerResponse?.body ?? ""}
                          placeholder="Thanks for stopping by — anything you'd want regulars to know?"
                          className="w-full rounded-xl border border-border-strong bg-surface px-3 py-2 text-sm leading-relaxed text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-terracotta resize-y"
                        />
                        <div className="flex items-center justify-between gap-3 text-xs text-ink-soft">
                          <span>
                            {r.ownerResponse
                              ? "Empty + save to retract your response."
                              : "Visible publicly under this review."}
                          </span>
                          <Button type="submit" variant="sage" size="sm" className="rounded-full">
                            {r.ownerResponse ? "Save changes" : "Post response"}
                          </Button>
                        </div>
                      </form>
                    </details>
                  )}

                  <div className="mt-4 flex items-center gap-3 text-xs text-ink-soft">
                    {realReviewIds.has(r.id) ? (
                      <>
                        <form action={toggleHelpfulAction} className="inline">
                          <input type="hidden" name="reviewId" value={r.id} />
                          <input type="hidden" name="businessSlug" value={business.slug} />
                          <button
                            type="submit"
                            className={
                              userHelpfulIds.has(r.id)
                                ? "inline-flex items-center gap-1 font-bold text-terracotta-deep"
                                : "inline-flex items-center gap-1 hover:text-ink"
                            }
                            aria-pressed={userHelpfulIds.has(r.id)}
                          >
                            {userHelpfulIds.has(r.id) ? "✓ Helpful" : "Helpful"} ({r.helpfulCount})
                          </button>
                        </form>
                        <span>·</span>
                        {userReportedIds.has(r.id) ? (
                          <span className="italic">Reported · admin reviewing</span>
                        ) : (
                          <details className="inline group">
                            <summary className="cursor-pointer list-none hover:text-ink select-none">
                              Report
                            </summary>
                            <form
                              action={reportReviewAction}
                              className="mt-2 inline-flex items-center gap-2"
                            >
                              <input type="hidden" name="reviewId" value={r.id} />
                              <input type="hidden" name="businessSlug" value={business.slug} />
                              <select
                                name="reason"
                                defaultValue="off-topic"
                                className="rounded-full border border-border-strong bg-surface px-2 h-7 text-xs"
                              >
                                <option value="off-topic">Off-topic</option>
                                <option value="harassment">Harassment / personal attack</option>
                                <option value="fake">Looks fake / paid</option>
                                <option value="conflict">Conflict of interest</option>
                                <option value="other">Other</option>
                              </select>
                              <button
                                type="submit"
                                className="rounded-full bg-terracotta/10 text-terracotta-deep px-3 h-7 font-bold hover:bg-terracotta/20"
                              >
                                Send report
                              </button>
                            </form>
                          </details>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="opacity-60">Helpful ({r.helpfulCount})</span>
                        <span>·</span>
                        <span className="opacity-60">Report</span>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* INFO column */}
        <aside className="space-y-6">
          {/* MAP */}
          <div className="rounded-2xl overflow-hidden border border-border bg-surface">
            {business.lat && business.lng ? (
              <MapboxMap
                center={[business.lng, business.lat]}
                zoom={15}
                pins={[
                  {
                    id: business.slug,
                    lng: business.lng,
                    lat: business.lat,
                    label: business.name,
                  },
                ]}
                className="aspect-[4/3] w-full"
              />
            ) : (
              <div className="relative aspect-[4/3] bg-sage/5 flex items-center justify-center">
                <div className="text-center text-sage-deep">
                  <MapPin size={28} className="mx-auto" />
                  <p className="text-xs mt-2 font-semibold">
                    Address not yet geocoded
                  </p>
                </div>
              </div>
            )}
            <div className="p-5">
              <p className="font-bold text-ink">{business.addressLine1}</p>
              <p className="text-sm text-ink-soft">
                {business.city}, {business.state} {business.postalCode}
              </p>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="mt-3 px-0 hover:bg-transparent text-terracotta-deep"
              >
                <a href={directionsUrl} target="_blank" rel="noreferrer">
                  Get directions →
                </a>
              </Button>
            </div>
          </div>

          {/* HOURS */}
          {business.hours && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-3">
                Hours
              </p>
              <ul className="space-y-1.5 text-sm">
                {formatHours(business.hours).map((row) => (
                  <li
                    key={row.day}
                    className="flex justify-between gap-4 text-ink"
                  >
                    <span className="font-semibold w-12">{row.day}</span>
                    <span className="tnum text-ink-soft">{row.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CONTACT */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-3">
              Contact
            </p>
            <ul className="space-y-2 text-sm text-ink">
              {business.phone && (
                <li>
                  <a
                    href={`tel:${business.phone}`}
                    className="hover:text-terracotta-deep"
                  >
                    {formatPhone(business.phone)}
                  </a>
                </li>
              )}
              {business.websiteUrl && (
                <li className="break-all">
                  <a
                    href={business.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-terracotta-deep"
                  >
                    {business.websiteUrl.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              )}
              {business.instagramHandle && (
                <li>
                  <a
                    href={`https://instagram.com/${business.instagramHandle.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-terracotta-deep"
                  >
                    {business.instagramHandle} on Instagram
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.addressLine1} ${business.city} ${business.state}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink-soft hover:text-terracotta-deep"
                >
                  Also on Google Maps →
                </a>
              </li>
            </ul>
          </div>

          {/* CLAIM CTA */}
          {!business.ownerVerified && (
            <div className="rounded-2xl border border-sage/30 bg-sage/5 p-5">
              <p className="font-bold text-ink">
                Is this your business?
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Claim your listing to respond to reviews, update info, and
                upload photos.
              </p>
              <Button variant="sage" size="sm" className="mt-4" asChild>
                <Link href={`/owner/claim/${business.slug}`}>
                  Claim this listing
                </Link>
              </Button>
            </div>
          )}
        </aside>
      </section>

      <SiteFooter />
    </main>
  );
}

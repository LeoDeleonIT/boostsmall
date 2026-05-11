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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = findBusinessBySlug(slug);
  if (!business) notFound();

  // Owner-uploaded photos lead, with seed photos backfilling behind so a
  // first owner upload doesn't wipe the existing gallery. Dedupe by URL in
  // case a seed photo got re-uploaded.
  const dbBusiness = await db.business.findUnique({
    where: { slug },
    select: {
      photos: {
        where: { reviewId: null },
        orderBy: { createdAt: "desc" },
        select: { url: true },
      },
    },
  });
  const ownerPhotos = dbBusiness?.photos.map((p) => p.url) ?? [];
  const seen = new Set(ownerPhotos);
  const photoUrls = [
    ...ownerPhotos,
    ...business.photoUrls.filter((url) => !seen.has(url)),
  ];

  const reviews = reviewsForBusiness(slug);
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
                  className="rounded-2xl border border-border bg-surface p-6"
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

                  <div className="mt-4 flex items-center gap-3 text-xs text-ink-soft">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 hover:text-ink"
                    >
                      Helpful ({r.helpfulCount})
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      className="hover:text-ink"
                    >
                      Report
                    </button>
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

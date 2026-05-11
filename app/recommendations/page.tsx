import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BusinessCard } from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SAMPLE_BUSINESSES, dedupeByBrand, type Category } from "@/lib/sample-businesses";
import { haversineMiles } from "@/lib/distance";
import { lookupZipAction } from "@/server/actions/zip-lookup";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Recommendations",
  description:
    "Curated picks across every category — top-rated family-owned businesses in the Houston metro.",
};

const FEATURED_CATEGORIES: Array<{ id: Category; label: string }> = [
  { id: "FOOD_DRINK", label: "Eat & Drink" },
  { id: "HEALTH_BEAUTY", label: "Health & Wellness" },
  { id: "RETAIL", label: "Shop" },
  { id: "SERVICES", label: "Services" },
  { id: "ARTS", label: "Arts" },
];

const RADIUS_OPTIONS = ["3", "5", "10", "25", "50"] as const;

interface RecsParams {
  zip?: string;
  lat?: string;
  lng?: string;
  radius?: string;
  error?: string;
}

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<RecsParams>;
}) {
  const params = await searchParams;
  const zip = params.zip?.trim() ?? "";
  const lat = params.lat ? parseFloat(params.lat) : null;
  const lng = params.lng ? parseFloat(params.lng) : null;
  const radius = params.radius ? parseInt(params.radius, 10) : 10;
  const usingLocation = lat !== null && lng !== null;

  // Apply ZIP-radius filter first, then dedupe brands so multi-location
  // brands collapse based on the *closest* qualifying location.
  const inRadius = usingLocation
    ? SAMPLE_BUSINESSES.filter(
        (b) => haversineMiles(lat!, lng!, b.lat, b.lng) <= radius
      )
    : SAMPLE_BUSINESSES;

  const deduped = dedupeByBrand(inRadius);

  const topRated = [...deduped]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 6);

  const ownerVerified = [...deduped]
    .filter((b) => b.ownerVerified)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const newest = deduped.filter((b) => b.recentlyAdded).slice(0, 6);

  // Bookmark slugs for filled hearts on cards.
  const session = await auth();
  let bookmarkedSlugs: Set<string> = new Set();
  if (session?.user?.id) {
    const bms = await db.bookmark.findMany({
      where: { userId: session.user.id },
      select: { business: { select: { slug: true } } },
    });
    bookmarkedSlugs = new Set(bms.map((b) => b.business.slug));
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-[1400px] px-6 py-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-3">
            Recommendations
          </p>
          <h1 className="font-display text-ink leading-tight" style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}>
            {usingLocation
              ? `The best near ${zip || "you"}.`
              : "The places we'd send a friend."}
          </h1>
          <p className="mt-4 max-w-prose text-ink-soft leading-relaxed">
            {usingLocation
              ? `Top-rated family-owned spots within ${radius} miles of ${zip || "your location"}, by category.`
              : "Hand-picked across the Houston metro — the highest-rated, most loved family-owned spots in every category. New picks rotate as reviews and listings come in."}
          </p>

          {/* ZIP / radius filter */}
          <form
            action={lookupZipAction}
            className="mt-6 flex flex-col sm:flex-row gap-2 items-start sm:items-center text-sm"
          >
            <input type="hidden" name="redirectTo" value="/recommendations" />
            <span className="text-ink-soft font-semibold whitespace-nowrap shrink-0">
              📍 Near a ZIP:
            </span>
            <Input
              name="zip"
              type="text"
              inputMode="numeric"
              pattern="\d{5}"
              maxLength={5}
              defaultValue={zip}
              placeholder="77007"
              className="rounded-full max-w-[120px] tnum"
            />
            <span className="text-ink-soft text-xs">within</span>
            <select
              name="radius"
              defaultValue={String(radius)}
              className="rounded-full border border-border-strong bg-surface px-4 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
            >
              {RADIUS_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r} miles
                </option>
              ))}
            </select>
            <Button type="submit" variant="sage" size="sm" className="rounded-full">
              Find nearby
            </Button>
            {usingLocation && (
              <Link
                href="/recommendations"
                className="text-xs text-terracotta-deep hover:underline ml-1"
              >
                Clear location
              </Link>
            )}
          </form>
          {params.error && (
            <p className="mt-2 text-xs text-terracotta-deep">
              {errorMessage(params.error)}
            </p>
          )}
        </div>
      </section>

      {/* No nearby matches at all — short-circuit before showing empty sections */}
      {usingLocation && deduped.length === 0 && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-16 text-center">
            <h2 className="font-display text-ink text-2xl leading-tight">
              No spots within {radius} miles of {zip || "that ZIP"}.
            </h2>
            <p className="mt-2 text-ink-soft">
              Try a wider radius, a different ZIP, or{" "}
              <Link
                href="/recommendations"
                className="text-terracotta-deep underline-offset-4 hover:underline"
              >
                clear the location
              </Link>{" "}
              to see metro-wide picks.
            </p>
          </div>
        </section>
      )}

      {/* TOP RATED OVERALL */}
      {topRated.length > 0 && (
        <Section
          eyebrow="Top rated overall"
          title={
            usingLocation
              ? `Top rated within ${radius} mi`
              : "Loved by neighbors across Houston"
          }
          seeAllHref={searchHref({ sort: "rating", zip, lat, lng, radius })}
        >
          <Grid businesses={topRated} bookmarkedSlugs={bookmarkedSlugs} />
        </Section>
      )}

      {/* PER-CATEGORY TOP PICKS */}
      {FEATURED_CATEGORIES.map((cat) => {
        const top = deduped
          .filter((b) => b.category === cat.id)
          .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
          .slice(0, 3);
        if (top.length === 0) return null;
        return (
          <Section
            key={cat.id}
            eyebrow={`Top ${cat.label.toLowerCase()}`}
            title={cat.label === "Eat & Drink" ? "What to eat this weekend" : `Best in ${cat.label.toLowerCase()}`}
            seeAllHref={searchHref({ category: cat.id, sort: "rating", zip, lat, lng, radius })}
          >
            <Grid businesses={top} bookmarkedSlugs={bookmarkedSlugs} />
          </Section>
        );
      })}

      {/* OWNER VERIFIED */}
      {ownerVerified.length > 0 && (
        <Section
          eyebrow="Owner verified"
          title="Owners who showed up to claim their spot"
          seeAllHref={searchHref({ zip, lat, lng, radius })}
          tint="warm"
        >
          <Grid businesses={ownerVerified} bookmarkedSlugs={bookmarkedSlugs} />
        </Section>
      )}

      {/* NEWEST */}
      {newest.length > 0 && (
        <Section
          eyebrow="New to boostsmall"
          title="Recently added"
          seeAllHref={searchHref({ sort: "newest", zip, lat, lng, radius })}
        >
          <Grid businesses={newest} bookmarkedSlugs={bookmarkedSlugs} />
        </Section>
      )}

      <section className="bg-background border-t border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 text-center">
          <h2 className="font-display text-ink text-3xl leading-tight">
            Know somewhere we missed?
          </h2>
          <p className="mt-3 text-ink-soft max-w-prose mx-auto">
            Submit it for review. We keep the platform family-owned only.
          </p>
          <Button variant="warm" size="lg" className="mt-6" asChild>
            <Link href="/submit">Add a business</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Section({
  eyebrow,
  title,
  seeAllHref,
  children,
  tint = "sage",
}: {
  eyebrow: string;
  title: string;
  seeAllHref: string;
  children: React.ReactNode;
  tint?: "sage" | "warm";
}) {
  const eyebrowColor = tint === "warm" ? "text-terracotta-deep" : "text-sage-deep";
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-14 md:py-16">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <p className={`text-xs uppercase tracking-[0.16em] font-bold mb-2 ${eyebrowColor}`}>
              {eyebrow}
            </p>
            <h2 className="font-display text-ink text-3xl md:text-4xl leading-tight">
              {title}
            </h2>
          </div>
          <Link
            href={seeAllHref}
            className="text-sm font-bold text-terracotta-deep hover:underline underline-offset-4 shrink-0"
          >
            See all →
          </Link>
        </div>
        {children}
      </div>
    </section>
  );
}

function Grid({
  businesses,
  bookmarkedSlugs,
  redirectTo = "/recommendations",
}: {
  businesses: typeof SAMPLE_BUSINESSES;
  bookmarkedSlugs?: Set<string>;
  redirectTo?: string;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((b) => (
        <BusinessCard
          key={b.slug}
          business={b}
          bookmarked={bookmarkedSlugs?.has(b.slug) ?? false}
          bookmarkRedirectTo={redirectTo}
        />
      ))}
    </div>
  );
}

// Build a /search href that carries the active location filter so the
// "See all" links scope into search with the same ZIP context.
function searchHref(opts: {
  category?: string;
  sort?: string;
  zip?: string;
  lat?: number | null;
  lng?: number | null;
  radius?: number;
}): string {
  const p = new URLSearchParams();
  if (opts.category) p.set("category", opts.category);
  if (opts.sort) p.set("sort", opts.sort);
  if (opts.zip && opts.lat != null && opts.lng != null) {
    p.set("zip", opts.zip);
    p.set("lat", String(opts.lat));
    p.set("lng", String(opts.lng));
    p.set("radius", String(opts.radius ?? 10));
  }
  const qs = p.toString();
  return qs ? `/search?${qs}` : "/search";
}

function errorMessage(code: string) {
  switch (code) {
    case "bad-zip":
      return "Please enter a 5-digit ZIP code.";
    case "zip-not-found":
      return "We couldn't find that ZIP. Try another.";
    case "no-mapbox-token":
      return "Location lookup isn't configured yet.";
    default:
      return "Something went wrong with the location lookup.";
  }
}

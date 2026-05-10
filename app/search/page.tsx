import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BusinessCard } from "@/components/business/business-card";
import { MapPin, Search } from "@/components/icons";
import { SAMPLE_BUSINESSES, type Category } from "@/lib/sample-businesses";
import { categoryLabel, priceLabel } from "@/lib/format";
import { HOUSTON_METRO } from "@/lib/cities";
import { haversineMiles, formatDistanceMiles } from "@/lib/distance";
import { lookupZipAction } from "@/server/actions/zip-lookup";

export const metadata: Metadata = {
  title: "Search local favorites",
};

const ALL_CATEGORIES: Array<Category | "ALL"> = [
  "ALL",
  "FOOD_DRINK",
  "RETAIL",
  "SERVICES",
  "HEALTH_BEAUTY",
  "ARTS",
  "OTHER",
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Most relevant" },
  { value: "rating", label: "Highest rated" },
  { value: "newest", label: "Recently added" },
  { value: "reviews", label: "Most reviewed" },
] as const;

const RADIUS_OPTIONS = ["3", "5", "10", "25", "50"] as const;

interface SearchParams {
  q?: string;
  category?: Category | "ALL";
  city?: string;
  price?: string;
  minRating?: string;
  sort?: (typeof SORT_OPTIONS)[number]["value"];
  // Location-based search
  zip?: string;
  lat?: string;
  lng?: string;
  radius?: string;
  error?: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = params.q?.trim().toLowerCase() ?? "";
  const category = (params.category ?? "ALL") as Category | "ALL";
  const city = params.city ?? "";
  const minPrice = params.price ? parseInt(params.price, 10) : 0;
  const minRating = params.minRating ? parseFloat(params.minRating) : 0;
  const sort = params.sort ?? "relevance";
  const zip = params.zip?.trim() ?? "";
  const lat = params.lat ? parseFloat(params.lat) : null;
  const lng = params.lng ? parseFloat(params.lng) : null;
  const radius = params.radius ? parseInt(params.radius, 10) : 10;
  const usingLocation = lat !== null && lng !== null;

  let results = SAMPLE_BUSINESSES.map((b) => ({
    business: b,
    distance: usingLocation && b.lat && b.lng
      ? haversineMiles(lat!, lng!, b.lat, b.lng)
      : null,
  }));

  if (q) {
    results = results.filter(
      ({ business: b }) =>
        b.name.toLowerCase().includes(q) ||
        b.subcategory.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );
  }
  if (category !== "ALL") {
    results = results.filter(({ business: b }) => b.category === category);
  }
  if (city) {
    results = results.filter(
      ({ business: b }) => b.city.toLowerCase() === city.toLowerCase()
    );
  }
  if (minPrice) {
    results = results.filter(({ business: b }) => b.priceTier <= minPrice);
  }
  if (minRating) {
    results = results.filter(({ business: b }) => b.rating >= minRating);
  }
  if (usingLocation) {
    results = results.filter(
      ({ distance }) => distance !== null && distance <= radius
    );
  }

  // Sort: distance wins when location is set; otherwise honor sort param
  if (usingLocation) {
    results.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  } else {
    switch (sort) {
      case "rating":
        results.sort((a, b) => b.business.rating - a.business.rating);
        break;
      case "newest":
        results.sort(
          (a, b) =>
            Number(!!b.business.recentlyAdded) -
            Number(!!a.business.recentlyAdded)
        );
        break;
      case "reviews":
        results.sort((a, b) => b.business.reviewCount - a.business.reviewCount);
        break;
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* SEARCH BAR */}
      <section className="bg-background-soft border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-6 space-y-3">
          <form action="/search" className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center rounded-full border border-border-strong bg-surface px-4 py-2.5 focus-within:ring-2 focus-within:ring-terracotta">
              <Search size={18} />
              <input
                type="text"
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Coffee, dentist, bike repair…"
                className="ml-3 flex-1 bg-transparent text-base placeholder:text-ink-soft/70 focus:outline-none"
              />
            </div>
            <div className="flex items-center rounded-full border border-border-strong bg-surface px-4 py-2.5 md:max-w-xs">
              <MapPin size={18} />
              <select
                name="city"
                defaultValue={params.city ?? ""}
                className="ml-3 flex-1 bg-transparent text-base focus:outline-none"
              >
                <option value="">All Houston-metro</option>
                {HOUSTON_METRO.map((c) => (
                  <option key={c.city} value={c.city}>
                    {c.city}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="warm" size="pill" type="submit">
              Search
            </Button>

            {category !== "ALL" && (
              <input type="hidden" name="category" value={category} />
            )}
            {minPrice ? <input type="hidden" name="price" value={minPrice} /> : null}
            {minRating ? <input type="hidden" name="minRating" value={minRating} /> : null}
            {sort !== "relevance" ? <input type="hidden" name="sort" value={sort} /> : null}
          </form>

          {/* RADIUS / ZIP CODE FORM */}
          <form
            action={lookupZipAction}
            className="flex flex-col sm:flex-row gap-2 items-start sm:items-center text-sm"
          >
            <span className="text-ink-soft font-semibold whitespace-nowrap shrink-0">
              📍 Find near a ZIP:
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
                href={buildHref(params, { zip: undefined, lat: undefined, lng: undefined, radius: undefined })}
                className="text-xs text-terracotta-deep hover:underline ml-1"
              >
                Clear location
              </Link>
            )}
            {/* preserve other filters */}
            {q && <input type="hidden" name="q" value={q} />}
            {category !== "ALL" && <input type="hidden" name="category" value={category} />}
          </form>

          {params.error && (
            <p className="text-xs text-terracotta-deep">
              {errorMessage(params.error)}
            </p>
          )}
        </div>
      </section>

      {/* CATEGORY CHIPS */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((c) => {
            const href = buildHref(params, { category: c });
            const isActive = c === category;
            return (
              <Link
                key={c}
                href={href}
                className={
                  isActive
                    ? "inline-flex items-center rounded-full bg-sage text-white text-sm font-semibold px-4 py-1.5"
                    : "inline-flex items-center rounded-full border border-border-strong bg-surface text-ink-soft text-sm font-semibold px-4 py-1.5 hover:text-ink hover:border-sage"
                }
              >
                {c === "ALL" ? "All categories" : categoryLabel(c)}
              </Link>
            );
          })}
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="mx-auto max-w-[1400px] px-6 py-10 grid lg:grid-cols-[260px_1fr] gap-10">
        {/* SIDEBAR */}
        <aside className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-3">
              Price
            </p>
            <ul className="space-y-1.5 text-sm">
              {[0, 1, 2, 3, 4].map((tier) => (
                <li key={tier}>
                  <Link
                    href={buildHref(params, {
                      price: tier ? String(tier) : undefined,
                    })}
                    className={
                      minPrice === tier
                        ? "text-ink font-bold"
                        : "text-ink-soft hover:text-ink"
                    }
                  >
                    {tier === 0 ? "Any price" : `Up to ${priceLabel(tier as 1 | 2 | 3 | 4)}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-3">
              Rating
            </p>
            <ul className="space-y-1.5 text-sm">
              {[0, 4.5, 4.0, 3.5].map((r) => (
                <li key={r}>
                  <Link
                    href={buildHref(params, {
                      minRating: r ? String(r) : undefined,
                    })}
                    className={
                      minRating === r
                        ? "text-ink font-bold"
                        : "text-ink-soft hover:text-ink"
                    }
                  >
                    {r === 0 ? "Any rating" : `${r.toFixed(1)} & up`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {!usingLocation && (
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-3">
                Sort by
              </p>
              <ul className="space-y-1.5 text-sm">
                {SORT_OPTIONS.map((o) => (
                  <li key={o.value}>
                    <Link
                      href={buildHref(params, { sort: o.value })}
                      className={
                        sort === o.value
                          ? "text-ink font-bold"
                          : "text-ink-soft hover:text-ink"
                      }
                    >
                      {o.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-sage/30 bg-sage/5 p-4 text-sm">
            <p className="font-bold text-ink">Don&apos;t see a place?</p>
            <p className="mt-1 text-ink-soft">
              Add it. We review every submission to keep the platform honest.
            </p>
            <Button variant="sage" size="sm" className="mt-3" asChild>
              <Link href="/submit">Add a business</Link>
            </Button>
          </div>
        </aside>

        {/* RESULTS */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl text-ink leading-tight">
                {q ? `Results for "${params.q}"` : (
                  category === "ALL" ? "All local favorites" : categoryLabel(category)
                )}
              </h1>
              <p className="mt-1 text-sm text-ink-soft">
                {results.length} {results.length === 1 ? "place" : "places"}{" "}
                {usingLocation
                  ? `within ${radius} mi of ${zip || `${lat?.toFixed(2)},${lng?.toFixed(2)}`}, sorted by distance`
                  : city ? `in ${city}` : "across the Houston metro"}
              </p>
            </div>
          </div>

          {(category !== "ALL" || city || minPrice || minRating || usingLocation) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {usingLocation && (
                <FilterChip
                  label={`Within ${radius} mi of ${zip || "you"}`}
                  href={buildHref(params, {
                    zip: undefined,
                    lat: undefined,
                    lng: undefined,
                    radius: undefined,
                  })}
                />
              )}
              {category !== "ALL" && (
                <FilterChip
                  label={categoryLabel(category)}
                  href={buildHref(params, { category: "ALL" })}
                />
              )}
              {city && (
                <FilterChip label={city} href={buildHref(params, { city: "" })} />
              )}
              {minPrice ? (
                <FilterChip
                  label={`Up to ${priceLabel(minPrice as 1 | 2 | 3 | 4)}`}
                  href={buildHref(params, { price: undefined })}
                />
              ) : null}
              {minRating ? (
                <FilterChip
                  label={`${minRating}+ stars`}
                  href={buildHref(params, { minRating: undefined })}
                />
              ) : null}
            </div>
          )}

          {results.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-12 text-center">
              <p className="font-bold text-ink text-lg">
                No matches with these filters.
              </p>
              <p className="mt-2 text-ink-soft">
                Try clearing some filters{usingLocation ? " or expanding the radius" : ""}, or{" "}
                <Link
                  href="/submit"
                  className="text-terracotta-deep underline-offset-4 hover:underline"
                >
                  add the place yourself
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map(({ business: b, distance }) => (
                <div key={b.slug} className="relative">
                  <BusinessCard business={b} />
                  {distance !== null && (
                    <span className="absolute top-3 left-3 z-10 rounded-full bg-ink/80 text-white text-xs font-bold px-2.5 py-1 backdrop-blur-sm tnum">
                      {formatDistanceMiles(distance)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function FilterChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 text-sm text-ink px-3 py-1 hover:bg-ink/10"
    >
      {label}
      <span className="text-ink-soft">×</span>
    </Link>
  );
}

function buildHref(
  current: SearchParams,
  patch: Partial<Record<keyof SearchParams, string | undefined>>
): string {
  const next: Record<string, string> = {};
  for (const [k, v] of Object.entries({ ...current, ...patch })) {
    if (v !== undefined && v !== "" && v !== "ALL") next[k] = String(v);
  }
  delete next.error;
  const qs = new URLSearchParams(next).toString();
  return qs ? `/search?${qs}` : "/search";
}

function errorMessage(code: string) {
  switch (code) {
    case "bad-zip":
      return "Please enter a 5-digit ZIP code.";
    case "zip-not-found":
      return "We couldn't find that ZIP. Try another.";
    case "no-mapbox-token":
      return "Location search isn't configured yet.";
    default:
      return "Something went wrong with the location lookup.";
  }
}

export const dynamic = "force-dynamic";

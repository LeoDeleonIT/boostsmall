import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/business/business-card";
import { UserNav } from "@/components/user-nav";
import { topRated, recentlyAdded, SAMPLE_BUSINESSES } from "@/lib/sample-businesses";
import { championsLoveBusinesses } from "@/lib/champions-love";
import { db } from "@/lib/db";
import { RatingStars } from "@/components/review/rating-stars";
import { relativeTime } from "@/lib/format";
import {
  Utensils,
  House,
  Car,
  Sparkles,
  Palette,
  ShoppingBag,
  MoreHorizontal,
} from "@/components/icons";
import { SearchAutocomplete } from "@/components/search-autocomplete";
import { searchIndex } from "@/lib/search-index";

const NAV_CATEGORIES: Array<{ label: string; href: string }> = [
  { label: "Eat & Drink",       href: "/search?category=FOOD_DRINK" },
  { label: "Health & Wellness", href: "/search?category=HEALTH_BEAUTY" },
  { label: "Shop",              href: "/search?category=RETAIL" },
  { label: "Services",          href: "/search?category=SERVICES" },
  { label: "Arts",              href: "/search?category=ARTS" },
  { label: "Recommendations",   href: "/recommendations" },
];

interface CategoryTile {
  name: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const TILES: CategoryTile[] = [
  {
    name: "Restaurants",
    description: "Cafés, bakeries, family kitchens",
    href: "/search?category=FOOD_DRINK",
    icon: Utensils,
  },
  {
    name: "Home & Garden",
    description: "Plumbers, cleaners, landscapers",
    href: "/search?category=SERVICES&sub=home",
    icon: House,
  },
  {
    name: "Auto Services",
    description: "Repair, detail, body shops",
    href: "/search?category=SERVICES&sub=auto",
    icon: Car,
  },
  {
    name: "Health & Wellness",
    description: "Dentists, yoga, massage, salons, barbers",
    href: "/search?category=HEALTH_BEAUTY",
    icon: Sparkles,
  },
  {
    name: "Arts",
    description: "Galleries, music, photographers",
    href: "/search?category=ARTS",
    icon: Palette,
  },
  {
    name: "Local Shops",
    description: "Bookstores, records, boutiques",
    href: "/search?category=RETAIL",
    icon: ShoppingBag,
  },
  {
    name: "More",
    description: "Everything else worth knowing",
    href: "/search",
    icon: MoreHorizontal,
  },
];

export default async function HomePage() {
  const [championsPicks, latestReviews] = await Promise.all([
    championsLoveBusinesses(),
    db.review.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        rating: true,
        body: true,
        createdAt: true,
        user: { select: { name: true, username: true, trustScore: true } },
        business: { select: { slug: true, name: true, city: true, state: true } },
      },
    }),
  ]);

  // Stats strip — pulls from the static seed so it stays accurate without
  // a DB round-trip per page load.
  const businessCount = SAMPLE_BUSINESSES.length;
  const cityCount = new Set(SAMPLE_BUSINESSES.map((b) => b.city)).size;
  const categoryCount = new Set(SAMPLE_BUSINESSES.map((b) => b.category)).size;
  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] overflow-hidden text-white">
        {/* Background photo (placeholder until owners upload their own) */}
        <Image
          src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradient: dark on the left for legibility, fading to none on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
        {/* Soft warm tint for the entire hero — pulls toward the brand cream */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />

        {/* Top nav */}
        <header className="relative z-10">
          <div className="mx-auto max-w-[1400px] px-6 py-5 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="font-wordmark text-2xl lowercase leading-none tracking-tight">
                <span className="text-white">boost</span>
                <span className="text-terracotta">small</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-white/95">
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="inline-flex items-center hover:text-white"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>

            <UserNav variant="dark" />
          </div>
        </header>

        {/* Hero text */}
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-20 md:pt-32 pb-32">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80 mb-5">
            Houston Metro · Coming soon
          </p>
          <h1
            className="font-display text-white leading-[0.95] max-w-[16ch]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Find the family-owned places near you.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-[42ch] leading-relaxed">
            Real reviews of independent neighborhood favorites — restaurants,
            dentists, plumbers, bookstores, salons, and more. No chains.
          </p>

          {/* Search bar - prominent over the photo */}
          <form
            action="/search"
            className="mt-10 flex flex-col sm:flex-row gap-2 max-w-2xl"
          >
            <SearchAutocomplete entries={searchIndex()} size="md" />
            <Button variant="warm" size="pill" type="submit" className="shrink-0">
              Search
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-white/80">Try:</span>
            {[
              { q: "thai", label: "Thai food" },
              { q: "dentist", label: "Dentists" },
              { q: "bookstore", label: "Bookstores" },
              { q: "bike", label: "Bike repair" },
            ].map((s) => (
              <Link
                key={s.q}
                href={`/search?q=${s.q}`}
                className="rounded-full bg-white/15 text-white/95 px-3 py-1 backdrop-blur-sm hover:bg-white/25"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Photo credit (Yelp pattern) */}
        <div className="absolute bottom-5 left-6 z-10 text-white text-xs leading-tight">
          <p className="font-bold">Common Bond — Houston</p>
          <p className="opacity-80">Photo placeholder · we credit owners directly</p>
        </div>
      </section>

      {/* ─── STATS STRIP ────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-10 grid grid-cols-3 gap-6 text-center">
          <Stat n={businessCount} label="family-owned spots" />
          <Stat n={cityCount} label={cityCount === 1 ? "city" : "Houston-metro cities"} />
          <Stat n={categoryCount} label="categories" />
        </div>
      </section>

      {/* ─── CATEGORIES ──────────────────────────────────────────────────── */}
      <section className="bg-background-soft border-y border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-2">
                Browse
              </p>
              <h2 className="font-display text-ink text-3xl md:text-4xl leading-tight">
                Local favorites by category
              </h2>
              <p className="mt-3 text-ink-soft max-w-[52ch]">
                Every business is independently owned. No publicly-traded
                parent companies, no franchise pop-ups — just family-run
                neighborhood spots.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-4">
            {TILES.map((t) => (
              <Link
                key={t.name}
                href={t.href}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-5 transition-all hover:border-sage hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(125,139,94,0.12)]"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage/10 text-sage-deep transition-colors group-hover:bg-sage/20">
                  <t.icon size={22} />
                </span>
                <div>
                  <h3 className="font-bold text-ink leading-tight">{t.name}</h3>
                  <p className="mt-1 text-xs text-ink-soft leading-snug">
                    {t.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-2">
              How it works
            </p>
            <h2 className="font-display text-ink text-3xl md:text-4xl leading-tight">
              Find places, then make them better
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <Step
              n={1}
              title="Discover"
              body="Search by ZIP, browse by category, or follow recommendations from neighbors who've earned trust."
            />
            <Step
              n={2}
              title="Visit"
              body="Family-owned spots only. Tap 'I'm here' on a business page to verify a real visit when you stop by."
            />
            <Step
              n={3}
              title="Review"
              body="Your reviews build trust over time — and help the next neighbor find what you found."
            />
          </div>
        </div>
      </section>

      {/* ─── RECENTLY ADDED ──────────────────────────────────────────────── */}
      <section className="bg-background-soft border-y border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-terracotta-deep font-bold mb-2">
                New to boostsmall
              </p>
              <h2 className="font-display text-ink text-3xl md:text-4xl leading-tight">
                Recently added
              </h2>
            </div>
            <Link
              href="/search?sort=newest"
              className="text-sm font-bold text-terracotta-deep hover:underline underline-offset-4 shrink-0"
            >
              See all →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyAdded(6).map((b) => (
              <BusinessCard key={b.slug} business={b} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CHAMPIONS LOVE ─────────────────────────────────────────────── */}
      {championsPicks.length > 0 && (
        <section className="bg-background border-b border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20">
            <div className="flex items-end justify-between gap-6 mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-terracotta-deep font-bold mb-2">
                  🌳 Champions love
                </p>
                <h2 className="font-display text-ink text-3xl md:text-4xl leading-tight">
                  Picks from neighbors who&apos;ve earned it
                </h2>
                <p className="mt-3 text-sm text-ink-soft max-w-prose">
                  Places that top-tier reviewers — Neighborhood Guides and
                  above — have written about recently.{" "}
                  <Link
                    href="/about/trust"
                    className="text-terracotta-deep hover:underline underline-offset-4 font-semibold"
                  >
                    What are tiers? →
                  </Link>
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {championsPicks.map((b) => (
                <BusinessCard key={b.slug} business={b} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── TOP RATED ───────────────────────────────────────────────────── */}
      <section className="bg-background-soft border-y border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20">
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-2">
                Top rated this month
              </p>
              <h2 className="font-display text-ink text-3xl md:text-4xl leading-tight">
                Loved by neighbors
              </h2>
            </div>
            <Link
              href="/search?sort=rating"
              className="text-sm font-bold text-sage-deep hover:underline underline-offset-4 shrink-0"
            >
              See all →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRated(6).map((b) => (
              <BusinessCard key={b.slug} business={b} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FROM THE NEIGHBORHOOD ──────────────────────────────────────── */}
      {latestReviews.length > 0 && (
        <section className="bg-background">
          <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20">
            <div className="flex items-end justify-between gap-6 mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-2">
                  From the neighborhood
                </p>
                <h2 className="font-display text-ink text-3xl md:text-4xl leading-tight">
                  What neighbors are saying
                </h2>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestReviews.map((r) => (
                <Link
                  key={r.id}
                  href={`/b/${r.business.slug}#review-${r.id}`}
                  className="block rounded-2xl border border-border bg-surface p-6 hover:border-border-strong transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-bold text-ink truncate">{r.business.name}</p>
                      <p className="text-xs text-ink-soft truncate">
                        {r.business.city}, {r.business.state}
                      </p>
                    </div>
                    <RatingStars rating={r.rating} size="sm" />
                  </div>
                  <p className="text-sm text-ink leading-relaxed line-clamp-4">
                    &ldquo;{r.body}&rdquo;
                  </p>
                  <p className="mt-4 text-xs text-ink-soft">
                    — {r.user.name ?? r.user.username ?? "Neighbor"} ·{" "}
                    {relativeTime(r.createdAt.toISOString())}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FOR OWNERS CTA ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-sage-deep text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-24 grid md:grid-cols-[1.5fr_1fr] gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/70 font-bold mb-3">
              For owners
            </p>
            <h2
              className="font-display leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              You run the place. Tell your story.
            </h2>
            <p className="mt-4 max-w-prose text-white/90 leading-relaxed">
              Claim your listing free — verified owners can respond to reviews,
              update your hours, upload your own photos, and reach neighbors
              looking for exactly what you do. No pay-to-rank, no ads buried in
              search results.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button variant="warm" size="lg" asChild className="self-start md:self-stretch">
              <Link href="/search">Find your business →</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="self-start md:self-stretch border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50"
            >
              <Link href="/submit">Add a new listing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── PROMISE STRIP ──────────────────────────────────────────────── */}
      <section className="bg-background py-14">
        <div className="mx-auto max-w-[1200px] px-6 grid md:grid-cols-3 gap-8">
          <Pillar
            title="Independent only"
            body="Family-owned and not publicly traded. Not on the chain blocklist. Verified by humans before they go live."
          />
          <Pillar
            title="Reviews from neighbors"
            body="Accounts under 24 hours old can't post. Copy-paste reviews get flagged. Quality over volume, every time."
          />
          <Pillar
            title="Owners can speak"
            body="Verified owners can respond to reviews, post photos, and update their info — without paying to be ranked."
          />
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background-soft mt-auto">
        <div className="mx-auto max-w-[1400px] px-6 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <Wordmark useImage size="lg" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft">
            <Link href="/about" className="hover:text-ink">About</Link>
            <Link href="/submit" className="hover:text-ink">Add a business</Link>
            <Link href="/owner" className="hover:text-ink">For owners</Link>
            <Link href="/design" className="hover:text-ink">Design preview</Link>
          </div>
          <p className="text-xs text-ink-soft">
            © 2026 boostsmall · Houston metro
          </p>
        </div>
      </footer>
    </main>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-display text-ink text-2xl">{title}</h3>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p
        className="font-display text-ink tnum leading-none"
        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
      >
        {n.toLocaleString()}
      </p>
      <p className="mt-2 text-xs uppercase tracking-widest font-bold text-sage-deep">
        {label}
      </p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-terracotta text-white font-display text-lg font-bold mb-4">
        {n}
      </span>
      <h3 className="font-display text-ink text-2xl leading-tight">{title}</h3>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}

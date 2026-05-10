import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BusinessCard } from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import { SAMPLE_BUSINESSES, dedupeByBrand, type Category } from "@/lib/sample-businesses";

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

export default function RecommendationsPage() {
  // Curated lists collapse multi-location brands to one entry so a single
  // chain (e.g. Trinity Dental's 16 sites) can't dominate the page.
  const deduped = dedupeByBrand(SAMPLE_BUSINESSES);

  const topRated = [...deduped]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 6);

  const ownerVerified = [...deduped]
    .filter((b) => b.ownerVerified)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const newest = deduped.filter((b) => b.recentlyAdded).slice(0, 6);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-[1400px] px-6 py-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-3">
            Recommendations
          </p>
          <h1 className="font-display text-ink leading-tight" style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}>
            The places we&apos;d send a friend.
          </h1>
          <p className="mt-4 max-w-prose text-ink-soft leading-relaxed">
            Hand-picked across the Houston metro — the highest-rated, most
            loved family-owned spots in every category. New picks rotate as
            reviews and listings come in.
          </p>
        </div>
      </section>

      {/* TOP RATED OVERALL */}
      <Section
        eyebrow="Top rated overall"
        title="Loved by neighbors across Houston"
        seeAllHref="/search?sort=rating"
      >
        <Grid businesses={topRated} />
      </Section>

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
            seeAllHref={`/search?category=${cat.id}&sort=rating`}
          >
            <Grid businesses={top} />
          </Section>
        );
      })}

      {/* OWNER VERIFIED */}
      {ownerVerified.length > 0 && (
        <Section
          eyebrow="Owner verified"
          title="Owners who showed up to claim their spot"
          seeAllHref="/search"
          tint="warm"
        >
          <Grid businesses={ownerVerified} />
        </Section>
      )}

      {/* NEWEST */}
      {newest.length > 0 && (
        <Section
          eyebrow="New to boostsmall"
          title="Recently added"
          seeAllHref="/search?sort=newest"
        >
          <Grid businesses={newest} />
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

function Grid({ businesses }: { businesses: typeof SAMPLE_BUSINESSES }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((b) => (
        <BusinessCard key={b.slug} business={b} />
      ))}
    </div>
  );
}

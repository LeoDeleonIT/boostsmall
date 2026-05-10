import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "About",
  description:
    "boostsmall is a discovery and review platform for independent, family-owned businesses in the Houston metro and East Texas. No chains, no franchises.",
};

export default async function AboutPage() {
  const [businesses, chains] = await Promise.all([
    db.business.count({ where: { status: "APPROVED" } }),
    db.chainBlocklist.count(),
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:py-24">
          <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-5">
            About boostsmall
          </p>
          <h1
            className="font-display text-ink leading-[1.05]"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
          >
            A review site for the{" "}
            <span className="text-terracotta-deep">family-owned places</span>{" "}
            that anchor a neighborhood.
          </h1>
          <p className="mt-6 text-lg text-ink leading-relaxed max-w-prose">
            We started boostsmall because the corner taqueria, the family
            dentist, the one-person record store, and the regional plumbing
            crew that&apos;s been around three generations all deserve their
            own front page — not page 14 of a site dominated by national
            chains optimizing for ad spend.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[820px] px-6 py-10 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <Stat number={businesses.toLocaleString()} label="Family-owned listings" />
          <Stat number={chains.toLocaleString()} label="Chains kept out" />
          <Stat number="Houston" label="Currently serving" />
        </div>
      </section>

      {/* The rule */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[820px] px-6 py-16">
          <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-3">
            The rule
          </p>
          <h2 className="font-display text-ink text-3xl md:text-4xl leading-tight">
            Family-owned, not publicly-traded.
          </h2>
          <div className="mt-6 space-y-5 text-ink leading-relaxed">
            <p>
              A business is welcome on boostsmall if it&apos;s independently
              held, not publicly traded, and not majority-owned by a
              publicly-traded parent. That&apos;s it. We specifically{" "}
              <em>don&apos;t</em> use a hard cap on number of locations — a
              16-location regional family-owned dental group is exactly what
              this platform is for.
            </p>
            <p>
              Every submission goes through a chain blocklist (the obvious
              chains — McDonald&apos;s, Starbucks, etc., {chains}+ entries
              and counting), then a fuzzy-match check, then a human
              moderator. Multi-location submissions go to a real person
              before they&apos;re published.
            </p>
            <p>
              Examples of what gets in: <strong>a single-location Vietnamese
              spot</strong>, <strong>a 2-store local coffee roaster</strong>,{" "}
              <strong>a one-person record store</strong>,{" "}
              <strong>a family-run plumbing business</strong>,{" "}
              <strong>a 3-location regional taqueria</strong>.
            </p>
            <p>
              Examples of what gets rejected:{" "}
              <strong>any McDonald&apos;s</strong>,{" "}
              <strong>any Chipotle</strong>, <strong>any Sweetgreen</strong>,
              and the rest of the publicly-traded restaurant world.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-[820px] px-6 py-16">
          <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-3">
            How it works
          </p>
          <h2 className="font-display text-ink text-3xl md:text-4xl leading-tight">
            Three things, kept simple.
          </h2>
          <div className="mt-8 space-y-8">
            <Step
              num="1"
              title="Discover"
              body="Search by category, neighborhood, or just browse. Maps land on the actual rooftop. Photos come from owners themselves whenever possible."
            />
            <Step
              num="2"
              title="Review (coming soon)"
              body="Reviews are written by people in the neighborhood — accounts under 24 hours old can't post, copy-pasted text gets flagged. Quality over volume."
            />
            <Step
              num="3"
              title="Owners can speak"
              body="Verified owners can claim their listing, edit info, upload photos, and respond to reviews — without paying to be ranked. Verification is by email-domain match or a document a moderator reviews."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background">
        <div className="mx-auto max-w-[820px] px-6 py-16 text-center">
          <h2 className="font-display text-ink text-3xl md:text-4xl leading-tight">
            Know a place we&apos;re missing?
          </h2>
          <p className="mt-3 text-ink-soft max-w-prose mx-auto">
            Add it. We review every submission to keep the platform honest.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button variant="warm" size="lg" asChild>
              <Link href="/submit">Add a business</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/search">Browse listings</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl md:text-4xl text-ink leading-none tnum">
        {number}
      </p>
      <p className="mt-2 text-xs uppercase tracking-widest text-ink-soft font-bold">
        {label}
      </p>
    </div>
  );
}

function Step({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <div className="grid grid-cols-[60px_1fr] gap-5">
      <div className="font-display text-4xl text-terracotta-deep tnum leading-none">
        {num}
      </div>
      <div>
        <h3 className="font-display text-2xl text-ink leading-tight">{title}</h3>
        <p className="mt-2 text-ink leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

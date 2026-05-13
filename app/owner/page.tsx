import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "For owners — boostsmall",
  description:
    "Claim your family-owned business on boostsmall. Free, no pay-to-rank, respond to reviews and reach the neighbors looking for exactly what you do.",
};

export default async function ForOwnersPage() {
  // If the visitor is already an owner of something, show a small link
  // to their dashboard at the top — but still render the pitch page so
  // Leo can reference this URL verbally regardless of audience.
  const session = await auth();
  let ownedCount = 0;
  if (session?.user?.id) {
    ownedCount = await db.businessOwner.count({
      where: { userId: session.user.id },
    });
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-[860px] px-6 py-14 md:py-20">
          <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-3">
            For owners
          </p>
          <h1
            className="font-display text-ink leading-tight"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
          >
            You run the place. Tell your story.
          </h1>
          <p className="mt-5 text-ink-soft leading-relaxed max-w-prose text-lg">
            boostsmall is the neighborhood review site for independent,
            family-owned businesses in Houston — no chains, no franchises, no
            pay-to-rank. Claiming your listing is free and takes a few minutes.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button variant="warm" size="lg" asChild>
              <Link href="/search">Find your business</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/submit">Add a new listing</Link>
            </Button>
            {ownedCount > 0 && (
              <Button variant="ghost" size="lg" asChild>
                <Link href="/owner/dashboard">
                  Your dashboard ({ownedCount}) →
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ─────────────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-[860px] px-6 py-12 md:py-16">
          <h2 className="font-display text-2xl md:text-3xl text-ink leading-tight mb-6">
            What you get when you claim
          </h2>

          <ul className="space-y-4">
            <li className="rounded-2xl border border-border bg-surface p-5">
              <p className="font-bold text-ink">A verified-owner badge</p>
              <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                Neighbors see at a glance that the listing is run by the
                actual owner — not a third-party aggregator.
              </p>
            </li>
            <li className="rounded-2xl border border-border bg-surface p-5">
              <p className="font-bold text-ink">Respond to every review</p>
              <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                Thank the regular who wrote a kind one. Address the
                complaint publicly. Owner responses show right below the
                review with your name and badge.
              </p>
            </li>
            <li className="rounded-2xl border border-border bg-surface p-5">
              <p className="font-bold text-ink">Upload your own photos</p>
              <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                Replace stock placeholders with the food you actually
                plate, your shop floor, your staff. Owner photos lead the
                hero gallery.
              </p>
            </li>
            <li className="rounded-2xl border border-border bg-surface p-5">
              <p className="font-bold text-ink">Update hours, address, phone</p>
              <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                Edit anything that&apos;s wrong about your listing — no
                support ticket, no waiting. Changes go live after a quick
                human review.
              </p>
            </li>
            <li className="rounded-2xl border border-border bg-surface p-5">
              <p className="font-bold text-ink">Get notified about new reviews</p>
              <p className="mt-1 text-sm text-ink-soft leading-relaxed">
                Email alerts when someone posts about your business so you
                don&apos;t find out a week later from a regular.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="bg-background-soft border-y border-border">
        <div className="mx-auto max-w-[860px] px-6 py-12 md:py-16">
          <h2 className="font-display text-2xl md:text-3xl text-ink leading-tight mb-6">
            How claiming works
          </h2>
          <ol className="space-y-5 text-ink leading-relaxed">
            <li>
              <span className="font-bold">1. Find your listing.</span>{" "}
              <Link href="/search" className="text-terracotta-deep font-bold hover:underline underline-offset-4">
                Search boostsmall
              </Link>{" "}
              for your business by name. If it isn&apos;t there yet, you can{" "}
              <Link href="/submit" className="text-terracotta-deep font-bold hover:underline underline-offset-4">
                add it
              </Link>{" "}
              — every submission is reviewed by a human to keep chains out.
            </li>
            <li>
              <span className="font-bold">2. Click &ldquo;Claim this listing.&rdquo;</span>{" "}
              Tell us who you are at the business (owner, manager, family
              member). We verify by phone or email at the listed contact —
              usually the same day.
            </li>
            <li>
              <span className="font-bold">3. You&apos;re in.</span> Your
              dashboard lets you respond, edit, upload, and watch reviews
              roll in. No subscription, no upsell.
            </li>
          </ol>
        </div>
      </section>

      {/* ── WHAT IT COSTS / TRUST ────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-[860px] px-6 py-12 md:py-16">
          <h2 className="font-display text-2xl md:text-3xl text-ink leading-tight mb-6">
            What we don&apos;t do
          </h2>
          <ul className="space-y-3 text-ink leading-relaxed">
            <li>
              <strong>We don&apos;t take money to rank you higher.</strong>{" "}
              No ads, no &ldquo;featured&rdquo; tier you can buy into. The
              order you see on /search is the order everyone sees.
            </li>
            <li>
              <strong>We don&apos;t list chains or franchises.</strong>{" "}
              Family-owned and not publicly traded, full stop. You compete
              against other independents — not against the franchise on the
              next corner.
            </li>
            <li>
              <strong>We don&apos;t hide reviews you don&apos;t like.</strong>{" "}
              Reviews get filtered for the standard stuff (off-topic,
              harassment, fake accounts) by humans, never paid hidden.
            </li>
            <li>
              <strong>We don&apos;t scrape and re-sell your data.</strong>{" "}
              Your listing is yours; you can update it or have it removed at
              any time.
            </li>
          </ul>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-sage-deep text-white">
        <div className="mx-auto max-w-[860px] px-6 py-14 md:py-18 text-center">
          <h2 className="font-display leading-tight" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}>
            Ready to claim your spot?
          </h2>
          <p className="mt-3 text-white/85 leading-relaxed max-w-prose mx-auto">
            Find your business below — or add it if we haven&apos;t gotten to
            it yet. Both are free.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button variant="warm" size="lg" asChild>
              <Link href="/search">Find your business</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50"
            >
              <Link href="/submit">Add a new listing</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

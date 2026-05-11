import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TIERS, SPECIALTIES } from "@/lib/reviewer-trust";
import { ReviewerBadge } from "@/components/review/reviewer-badge";
import { SpecialtyBadge } from "@/components/review/specialty-badge";

export const metadata: Metadata = {
  title: "How trust works on boostsmall",
  description:
    "Reviewer tiers reward neighbors who write helpful, authentic reviews — not loudest voices or paid placements.",
};

export default function TrustPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-[760px] px-6 py-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-3">
            About trust
          </p>
          <h1
            className="font-display text-ink leading-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
          >
            Reviews from neighbors who actually live here.
          </h1>
          <p className="mt-4 text-ink-soft leading-relaxed">
            Trust on boostsmall is earned slowly and quietly. We don&apos;t
            rank reviewers by who shouts loudest or who pays. Tiers grow
            when neighbors find your reviews useful, when owners respond
            to them, and when you keep showing up.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[760px] px-6 py-12 space-y-8">
          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-2">
              The tiers
            </h2>
            <p className="text-sm text-ink-soft mb-6">
              You move up as your reviews accumulate genuine signals.
              You can&apos;t buy your way in.
            </p>
            <ul className="space-y-3">
              {TIERS.map((t) => (
                <li
                  key={t.key}
                  className="rounded-2xl border border-border bg-surface p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <ReviewerBadge tier={t} size="md" link={false} className="self-start sm:self-center shrink-0" />
                  <p className="text-sm text-ink leading-relaxed">{t.blurb}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-2">
              Specialty badges
            </h2>
            <p className="text-sm text-ink-soft mb-6">
              Stack these on top of your tier as you find your lane.
            </p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {SPECIALTIES.map((s) => (
                <li
                  key={s.key}
                  className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-3"
                >
                  <SpecialtyBadge specialty={s} className="shrink-0" />
                  <p className="text-sm text-ink-soft leading-relaxed">{s.blurb}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              What earns trust
            </h2>
            <ul className="space-y-2 text-ink leading-relaxed text-sm">
              <li>
                <strong>Writing reviews</strong> for places you actually
                visited. Specifics help — what you ordered, who was working,
                what surprised you.
              </li>
              <li>
                <strong>Helpful votes from neighbors.</strong> When your
                reviews help someone decide, that&apos;s the strongest signal
                we have.
              </li>
              <li>
                <strong>Owners replying to you.</strong> When a verified owner
                takes time to respond, your review mattered.
              </li>
              <li>
                <strong>Adding photos.</strong> A real picture of what you
                ate or where you sat tells more than 500 words.
              </li>
              <li>
                <strong>Time on the platform.</strong> Drive-by accounts can&apos;t
                fake a year of showing up.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              What loses trust
            </h2>
            <ul className="space-y-2 text-ink leading-relaxed text-sm">
              <li>
                <strong>Reviews that get reported</strong> by other neighbors
                or flagged by our moderators (off-topic, harassment, paid placements).
              </li>
              <li>
                <strong>Owner-reviewing-their-own-place.</strong> Not allowed.
              </li>
              <li>
                <strong>Brand-new accounts dropping 5 reviews in an hour.</strong>{" "}
                We notice. Tiers stay locked until activity looks real.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-sage/30 bg-sage/5 p-6">
            <h2 className="font-display text-xl text-ink leading-tight mb-2">
              The whole point
            </h2>
            <p className="text-sm text-ink leading-relaxed">
              Reading a review on boostsmall should feel like asking the neighbor
              who&apos;s lived here for ten years. Tiers are how we surface those
              voices — not to rank people, but to make trust legible.
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              <Link
                href="/search"
                className="text-terracotta-deep font-bold hover:underline underline-offset-4"
              >
                Find a place to review →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

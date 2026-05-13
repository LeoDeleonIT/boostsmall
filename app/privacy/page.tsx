import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How boostsmall handles your data — what we collect, what we don't, and what you can ask us to delete.",
};

const LAST_UPDATED = "May 12, 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-[760px] px-6 py-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-3">
            Privacy
          </p>
          <h1
            className="font-display text-ink leading-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
          >
            What we keep, what we don&apos;t.
          </h1>
          <p className="mt-4 text-ink-soft leading-relaxed">
            Plain-English version. Last updated {LAST_UPDATED}.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[760px] px-6 py-12 space-y-10 text-ink leading-relaxed">
          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              What we collect
            </h2>
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>
                <strong>Email address</strong> — when you sign in. We use a
                magic-link, so no password is stored.
              </li>
              <li>
                <strong>Reviews you write</strong> — text, star rating, the
                business you reviewed, and any photos you attach.
              </li>
              <li>
                <strong>Bookmarks (saved places)</strong>.
              </li>
              <li>
                <strong>Helpful votes and reports</strong> you make on other
                people&apos;s reviews.
              </li>
              <li>
                <strong>Basic profile</strong> — your username, an optional
                display name, an optional bio.
              </li>
              <li>
                <strong>Activity timestamps</strong> — when you last signed
                in, when reviews were posted. This is how the trust system
                tells &ldquo;new account dropping five reviews in an
                hour&rdquo; apart from &ldquo;regular over a year.&rdquo;
              </li>
              <li>
                <strong>Anonymous web logs</strong> — your browser sends a
                user-agent and an IP address when you load a page. These
                roll up in normal hosting logs.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              What we don&apos;t collect
            </h2>
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>No passwords (sign-in is magic-link only).</li>
              <li>No payment information.</li>
              <li>No third-party advertising trackers.</li>
              <li>No social media pixels.</li>
              <li>No precise location unless you tap &ldquo;Find nearby&rdquo; — that uses your ZIP, kept only for the duration of the search.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Who sees your data
            </h2>
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>
                Reviews you post are <strong>public</strong> by design — the
                whole point of the site. Your username appears on every
                review you write.
              </li>
              <li>
                Bookmarks, your email address, and your activity log are
                <strong> private</strong>. Only you and the boostsmall team
                see them.
              </li>
              <li>
                Verified business owners can see who reviewed their place
                (the username already on the review). They can&apos;t see
                your email, bookmarks, or activity.
              </li>
              <li>
                We don&apos;t sell your data. We never have. If that ever
                changes, this page changes first, and you&apos;ll get an
                email.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Service providers we use
            </h2>
            <p className="text-sm mb-3">
              Running the site means handing some data to companies whose
              tools we run on. Each one is contracted to keep your data
              confidential.
            </p>
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>
                <strong>Vercel</strong> — hosts the website. Sees normal
                request logs.
              </li>
              <li>
                <strong>Neon</strong> — runs the database that stores
                accounts, reviews, bookmarks.
              </li>
              <li>
                <strong>Resend</strong> — sends sign-in emails and new-review
                notifications to verified owners.
              </li>
              <li>
                <strong>UploadThing</strong> — stores photos you upload to
                your reviews or your business listing.
              </li>
              <li>
                <strong>Mapbox</strong> — renders the map on /search. Sees
                your IP when you load the map.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Cookies
            </h2>
            <p className="text-sm">
              One cookie for sign-in (so you stay logged in) and one cookie
              for protection against forged form submissions. No tracking
              cookies. No analytics cookies. We don&apos;t need a cookie
              banner because we don&apos;t set cookies that need consent
              under GDPR or California rules.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Your rights
            </h2>
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>
                <strong>See everything we have on you</strong> — email us and
                we&apos;ll send a download.
              </li>
              <li>
                <strong>Delete your account</strong> — email us. Reviews you
                wrote will either be removed or kept anonymously (your
                choice).
              </li>
              <li>
                <strong>Fix something wrong</strong> — edit your profile any
                time, or email us if it&apos;s something you can&apos;t
                edit yourself.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Kids
            </h2>
            <p className="text-sm">
              boostsmall is not for people under 13. We don&apos;t knowingly
              collect data from kids. If you find an account that
              shouldn&apos;t be here, report it and we&apos;ll handle it.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Changes to this policy
            </h2>
            <p className="text-sm">
              If we make any material change to how we handle your data,
              we&apos;ll update this page and email everyone with an
              account at least 14 days before the change takes effect.
            </p>
          </div>

          <div className="rounded-2xl border border-sage/30 bg-sage/5 p-6">
            <h2 className="font-display text-xl text-ink leading-tight mb-2">
              Questions
            </h2>
            <p className="text-sm text-ink leading-relaxed">
              Email us at{" "}
              <a
                href="mailto:hello@boostsmall.com"
                className="text-terracotta-deep font-bold hover:underline underline-offset-4"
              >
                hello@boostsmall.com
              </a>{" "}
              for anything — data requests, mistakes you spot, places
              this policy isn&apos;t clear.
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              <Link
                href="/terms"
                className="text-terracotta-deep font-bold hover:underline underline-offset-4"
              >
                Read the terms of service →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

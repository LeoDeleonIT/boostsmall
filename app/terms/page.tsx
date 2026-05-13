import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The agreement between you and boostsmall — what you can do, what we can do, and what's not allowed.",
};

const LAST_UPDATED = "May 12, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-[760px] px-6 py-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-3">
            Terms of service
          </p>
          <h1
            className="font-display text-ink leading-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
          >
            The deal between you and us.
          </h1>
          <p className="mt-4 text-ink-soft leading-relaxed">
            Plain-English version, last updated {LAST_UPDATED}. By using
            boostsmall you agree to what&apos;s on this page.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[760px] px-6 py-12 space-y-10 text-ink leading-relaxed">
          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              What boostsmall is
            </h2>
            <p className="text-sm">
              A review platform for independent, family-owned small
              businesses in the Houston metro and East Texas. Free to
              browse, free to write reviews, free to claim your business.
              No pay-to-rank, no chains, no ads.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Your account
            </h2>
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>
                You must be 13 or older. By signing up you&apos;re saying
                you are.
              </li>
              <li>
                One account per person. Don&apos;t create fakes to inflate
                or attack a business.
              </li>
              <li>
                You&apos;re responsible for what gets posted from your
                account. Don&apos;t share your sign-in link.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Reviews — the rules
            </h2>
            <p className="text-sm mb-3">
              The whole site rests on reviews being honest. So:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>
                <strong>Only review places you actually visited.</strong>{" "}
                Specifics help — what you ordered, who was working, what
                surprised you.
              </li>
              <li>
                <strong>Don&apos;t review your own business.</strong> Same
                for family members, employees, and competitors.
              </li>
              <li>
                <strong>No paid reviews.</strong> Don&apos;t accept money,
                free food, or anything else to write a review. Don&apos;t
                pay anyone else to.
              </li>
              <li>
                <strong>No harassment, slurs, threats, or doxing.</strong>{" "}
                We&apos;ll remove these and ban repeat offenders.
              </li>
              <li>
                <strong>No spam, no copy-paste, no AI-generated reviews.</strong>{" "}
                We filter these out.
              </li>
              <li>
                <strong>Photos must be yours.</strong> Don&apos;t upload
                someone else&apos;s photo or a screenshot from another site.
              </li>
            </ul>
            <p className="text-sm mt-3">
              We can remove reviews that break these rules, with or without
              notice. Reviews that get reported by neighbors or flagged by
              our moderators go through a human review before action is
              taken.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Who owns what you post
            </h2>
            <p className="text-sm">
              <strong>You keep ownership</strong> of your reviews and
              photos. By posting them you give boostsmall a non-exclusive
              license to display them on the site, in emails to verified
              owners, and in press coverage of boostsmall. If you delete a
              review, we delete our copy too (subject to legal hold
              requirements).
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Owners — claiming and responding
            </h2>
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>
                You can claim a listing if you&apos;re the actual owner or
                an authorized representative. We verify by phone or email at
                the listed contact.
              </li>
              <li>
                Owner responses are public. Stay professional —
                threatening, insulting, or doxing a reviewer means losing
                the listing.
              </li>
              <li>
                You can&apos;t pay to bury a review or boost your ranking.
                That isn&apos;t a feature and never will be.
              </li>
              <li>
                If you sell or close the business, transfer or release the
                claim. Listings for closed businesses get archived.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Things you can&apos;t do
            </h2>
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>Scrape the site, run bots, or hammer our servers.</li>
              <li>Try to reverse-engineer or break the moderation system.</li>
              <li>
                Impersonate someone else — another reviewer, an owner, a
                staff member.
              </li>
              <li>
                Use boostsmall to promote chains, franchises, or businesses
                that don&apos;t meet the &ldquo;family-owned and not
                publicly traded&rdquo; bar.
              </li>
              <li>Use the site to do anything illegal.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              No warranty, limit of liability
            </h2>
            <p className="text-sm">
              boostsmall is provided as-is. We work hard to keep the data
              right and the site up, but we can&apos;t guarantee a listing
              is current, a review is accurate, or the site is bug-free.
              You use it at your own risk. To the maximum extent the law
              allows, boostsmall isn&apos;t liable for indirect or
              consequential damages from using (or not being able to use)
              the site.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Closing your account
            </h2>
            <p className="text-sm">
              You can close your account any time by emailing us. We may
              suspend or close accounts that break these rules. We&apos;ll
              try to tell you why, unless doing so would interfere with an
              investigation.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Changes to these terms
            </h2>
            <p className="text-sm">
              If something material changes, we&apos;ll update this page
              and email accounts at least 14 days before the change takes
              effect. Continuing to use the site after that counts as
              acceptance.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink leading-tight mb-3">
              Governing law
            </h2>
            <p className="text-sm">
              These terms are governed by the laws of the State of Texas.
              Disputes go to the state or federal courts located in Harris
              County, Texas.
            </p>
          </div>

          <div className="rounded-2xl border border-sage/30 bg-sage/5 p-6">
            <h2 className="font-display text-xl text-ink leading-tight mb-2">
              Questions or a dispute
            </h2>
            <p className="text-sm text-ink leading-relaxed">
              Email{" "}
              <a
                href="mailto:hello@boostsmall.com"
                className="text-terracotta-deep font-bold hover:underline underline-offset-4"
              >
                hello@boostsmall.com
              </a>
              . We&apos;d rather work things out directly than wait for
              lawyers.
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              <Link
                href="/privacy"
                className="text-terracotta-deep font-bold hover:underline underline-offset-4"
              >
                Read the privacy policy →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

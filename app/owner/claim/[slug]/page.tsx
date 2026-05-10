import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  claimBusinessAction,
  emailDomainMatchesWebsite,
} from "@/server/actions/owner";

export const metadata: Metadata = {
  title: "Claim business",
  robots: { index: false, follow: false },
};

export default async function ClaimBusinessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;

  const session = await auth();
  if (!session?.user) redirect(`/sign-in?callbackUrl=/owner/claim/${slug}`);

  const business = await db.business.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      city: true,
      state: true,
      websiteUrl: true,
      owners: {
        select: {
          userId: true,
          user: { select: { username: true } },
        },
      },
    },
  });
  if (!business) notFound();

  const alreadyOwnedByMe = business.owners.some((o) => o.userId === session.user.id);
  const otherOwners = business.owners.filter((o) => o.userId !== session.user.id);
  const emailMatch = emailDomainMatchesWebsite(
    session.user.email,
    business.websiteUrl
  );
  const isAdmin = session.user.role === "ADMIN";

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader showSearch={false} />

      <section className="mx-auto max-w-2xl px-6 py-12 w-full">
        <Link
          href={`/b/${business.slug}`}
          className="text-sm text-ink-soft hover:text-ink underline-offset-4 hover:underline"
        >
          ← back to {business.name}
        </Link>

        <h1 className="font-display text-4xl text-ink mt-4 leading-tight">
          Claim {business.name}
        </h1>
        <p className="mt-3 text-ink-soft">
          Verified owners can edit listing info, respond to reviews, upload
          photos, and see basic analytics.
        </p>

        {alreadyOwnedByMe && (
          <div className="mt-6 rounded-2xl border border-sage/40 bg-sage/5 p-5">
            <p className="font-bold text-ink">
              You already own this listing.
            </p>
            <Button variant="sage" size="sm" className="mt-3" asChild>
              <Link href="/owner/dashboard">Go to your dashboard</Link>
            </Button>
          </div>
        )}

        {!alreadyOwnedByMe && otherOwners.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-background-soft p-5 text-sm text-ink-soft">
            <p>
              <span className="font-semibold text-ink">Heads up:</span> this
              listing is already claimed by{" "}
              {otherOwners
                .map((o) => `@${o.user.username ?? "another user"}`)
                .join(", ")}
              . Multiple verified owners are allowed (e.g. you and a colleague
              both managing the same office).
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-terracotta/40 bg-terracotta/10 p-5 text-sm">
            <p className="text-terracotta-deep font-semibold">
              {errorMessage(error)}
            </p>
          </div>
        )}

        {!alreadyOwnedByMe && (
          <div className="mt-8 space-y-4">
            <p className="text-xs uppercase tracking-widest font-bold text-sage-deep">
              Choose a verification method
            </p>

            {/* Email domain match */}
            <ClaimMethod
              title="Email domain match"
              available={emailMatch}
              method="EMAIL_DOMAIN"
              businessSlug={business.slug}
              statusLabel={
                emailMatch
                  ? `Your email (${session.user.email}) matches the business's website domain.`
                  : business.websiteUrl
                  ? `Your email (${session.user.email}) does not match ${new URL(business.websiteUrl).hostname.replace(/^www\./, "")}.`
                  : "This business has no website on file."
              }
            />

            {/* Document upload (disabled — needs UploadThing) */}
            <ClaimMethod
              title="Document upload"
              available={false}
              method="DOCUMENT"
              businessSlug={business.slug}
              statusLabel="Disabled until UploadThing is configured. Routes to moderation when enabled."
            />

            {/* Admin override */}
            {isAdmin && (
              <ClaimMethod
                title="Admin override"
                available={true}
                method="ADMIN_OVERRIDE"
                businessSlug={business.slug}
                statusLabel="You're signed in as admin. Use this to claim on behalf of an owner before they're set up with their own verification."
                accent="warm"
              />
            )}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}

function ClaimMethod({
  title,
  available,
  method,
  businessSlug,
  statusLabel,
  accent = "sage",
}: {
  title: string;
  available: boolean;
  method: "EMAIL_DOMAIN" | "DOCUMENT" | "ADMIN_OVERRIDE";
  businessSlug: string;
  statusLabel: string;
  accent?: "sage" | "warm";
}) {
  return (
    <form
      action={claimBusinessAction}
      className={
        available
          ? "rounded-2xl border border-border bg-surface p-5"
          : "rounded-2xl border border-border bg-background-soft p-5 opacity-60"
      }
    >
      <input type="hidden" name="businessSlug" value={businessSlug} />
      <input type="hidden" name="method" value={method} />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-ink">{title}</p>
            {!available && <Badge variant="muted">Unavailable</Badge>}
          </div>
          <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">
            {statusLabel}
          </p>
        </div>
        {available && (
          <Button type="submit" variant={accent} size="sm" className="shrink-0">
            Verify
          </Button>
        )}
      </div>
    </form>
  );
}

function errorMessage(code: string) {
  switch (code) {
    case "invalid":
      return "Something was wrong with the form. Try again.";
    case "rate-limited":
      return "Too many claim attempts. Wait a bit and try again.";
    case "email-mismatch":
      return "Your email doesn't match this business's website domain.";
    case "forbidden":
      return "You're not allowed to use that verification method.";
    default:
      return "Something went wrong.";
  }
}

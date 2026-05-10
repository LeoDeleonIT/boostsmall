import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Check your email",
};

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader showSearch={false} />

      <section className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sage/15">
            <EnvelopeIcon />
          </span>
          <h1 className="font-display text-4xl mt-6 text-ink">
            Check your email
          </h1>
          <p className="text-ink-soft mt-3">
            {email ? (
              <>We sent a sign-in link to <span className="text-ink font-semibold">{email}</span>.</>
            ) : (
              <>We sent a sign-in link to your email.</>
            )}{" "}
            Click the link to finish signing in.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-surface p-5 text-left">
            <p className="text-xs uppercase tracking-widest text-sage-deep font-bold mb-2">
              Doesn&apos;t arrive in a minute?
            </p>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>· Check your spam folder for a message from <code>noreply@boostsmall.com</code></li>
              <li>· Make sure you typed your email correctly</li>
              <li>· The link expires in 10 minutes — request a fresh one if needed</li>
            </ul>
          </div>

          <Button variant="ghost" asChild className="mt-6">
            <Link href="/sign-in">← Try a different email</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function EnvelopeIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-sage-deep"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

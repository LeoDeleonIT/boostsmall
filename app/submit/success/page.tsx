import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Submitted",
};

export default async function SubmitSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; note?: string }>;
}) {
  const { note } = await searchParams;

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader showSearch={false} />

      <section className="mx-auto max-w-xl px-6 py-16 w-full text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sage/15 text-sage-deep text-3xl font-bold">
          ✓
        </span>
        <h1 className="font-display text-4xl text-ink mt-6 leading-tight">
          Submitted for review
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          Thanks for adding this. A moderator will look at it and either
          approve, reject, or ask for more info.
        </p>

        {note && (
          <div className="mt-6 rounded-2xl border border-terracotta/30 bg-terracotta/5 p-5 text-sm text-left">
            <p className="font-semibold text-ink mb-1">Heads up</p>
            <p className="text-ink-soft">
              {noteMessage(note)}
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button variant="warm" asChild>
            <Link href="/submit">Submit another</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function noteMessage(note: string) {
  switch (note) {
    case "FUZZY_MATCH":
      return "The name fuzzy-matched something on the chain blocklist. A human moderator will check it isn't actually a chain before approving.";
    case "MULTI_LOCATION":
      return "You marked this as having more than 5 locations. That's allowed for family-owned multi-location businesses, but a moderator will verify before approving.";
    default:
      return "A moderator will review and follow up.";
  }
}

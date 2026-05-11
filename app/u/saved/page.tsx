import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/business/business-card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { findBusinessBySlug } from "@/lib/sample-businesses";

export const metadata: Metadata = {
  title: "Saved",
  robots: { index: false, follow: false },
};

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/u/saved");

  const bookmarks = await db.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      business: {
        select: { slug: true },
      },
    },
  });

  // Bookmarks reference DB businesses, but our seed-backed UI lives in
  // sample-businesses.ts. Filter to ones we can actually render.
  const savedBusinesses = bookmarks
    .map((b) => findBusinessBySlug(b.business.slug))
    .filter((b): b is NonNullable<typeof b> => !!b);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader showSearch={false} />

      <section className="mx-auto max-w-[1200px] px-6 py-12 w-full">
        <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-2">
          Your saved list
        </p>
        <h1 className="font-display text-4xl text-ink leading-tight">
          {savedBusinesses.length === 0
            ? "Nothing saved yet."
            : `${savedBusinesses.length} place${savedBusinesses.length === 1 ? "" : "s"} you saved`}
        </h1>
        <p className="mt-3 text-ink-soft max-w-prose">
          {savedBusinesses.length === 0
            ? "Tap the heart on any business to save it here. Your saved list is private."
            : "Your saved list is private — only you can see it."}
        </p>

        {savedBusinesses.length === 0 ? (
          <Button variant="warm" size="lg" className="mt-6" asChild>
            <Link href="/search">Find something to save</Link>
          </Button>
        ) : (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedBusinesses.map((b) => (
              <BusinessCard
                key={b.slug}
                business={b}
                bookmarked
                bookmarkRedirectTo="/u/saved"
              />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}

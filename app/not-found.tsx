import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          <p className="font-display text-terracotta-deep text-7xl tnum leading-none">
            404
          </p>
          <h1 className="font-display text-ink text-3xl mt-6 leading-tight">
            We couldn&apos;t find that.
          </h1>
          <p className="mt-3 text-ink-soft leading-relaxed">
            The page might&apos;ve moved, or you may have followed an old link.
            If you were looking for a specific business, try search.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="warm" size="lg" asChild>
              <Link href="/search">Search businesses</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

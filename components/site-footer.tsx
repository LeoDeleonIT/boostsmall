import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background-soft mt-auto">
      <div className="mx-auto max-w-[1400px] px-6 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <Wordmark useImage size="lg" />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft">
          <Link href="/about" className="hover:text-ink">About</Link>
          <Link href="/submit" className="hover:text-ink">Add a business</Link>
          <Link href="/owner" className="hover:text-ink">For owners</Link>
          <Link href="/design" className="hover:text-ink">Design preview</Link>
        </div>
        <p className="text-xs text-ink-soft">
          © 2026 boostsmall · Houston metro
        </p>
      </div>
    </footer>
  );
}

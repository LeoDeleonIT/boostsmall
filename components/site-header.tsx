import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { UserNav } from "@/components/user-nav";
import { Search } from "@/components/icons";

const NAV_ITEMS = [
  { label: "Eat & Drink",       href: "/search?category=FOOD_DRINK" },
  { label: "Health & Wellness", href: "/search?category=HEALTH_BEAUTY" },
  { label: "Shop",              href: "/search?category=RETAIL" },
  { label: "Services",          href: "/search?category=SERVICES" },
  { label: "Arts",              href: "/search?category=ARTS" },
  { label: "Recommendations",   href: "/recommendations" },
  { label: "Find your thing",   href: "/discover" },
];

interface SiteHeaderProps {
  variant?: "solid" | "transparent";
  showSearch?: boolean;
}

export async function SiteHeader({
  variant = "solid",
  showSearch = true,
}: SiteHeaderProps) {
  const isSolid = variant === "solid";
  return (
    <header
      className={
        isSolid
          ? "border-b border-border bg-background-soft"
          : "absolute top-0 inset-x-0 z-10"
      }
    >
      <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="inline-flex items-center gap-3 shrink-0">
          {isSolid ? (
            <Wordmark useImage size="default" asLink={false} />
          ) : (
            <span className="font-wordmark text-2xl lowercase leading-none tracking-tight">
              <span className="text-white">boost</span>
              <span className="text-terracotta">small</span>
            </span>
          )}
        </Link>

        {showSearch && isSolid && (
          <form
            action="/search"
            className="hidden md:flex flex-1 max-w-xl items-center rounded-full border border-border-strong bg-surface px-4 py-2 focus-within:ring-2 focus-within:ring-terracotta"
          >
            <Search size={18} />
            <input
              type="text"
              name="q"
              placeholder="Coffee, dentist, bike repair…"
              className="ml-3 flex-1 bg-transparent text-sm placeholder:text-ink-soft/70 focus:outline-none"
            />
          </form>
        )}

        <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                isSolid
                  ? "text-ink-soft hover:text-ink"
                  : "text-white/95 hover:text-white"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <UserNav variant={isSolid ? "light" : "dark"} />
      </div>
    </header>
  );
}

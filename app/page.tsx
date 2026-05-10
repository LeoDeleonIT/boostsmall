import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Search,
  Utensils,
  House,
  Car,
  Sparkles,
  Palette,
  ShoppingBag,
  MoreHorizontal,
} from "@/components/icons";

const NAV_CATEGORIES = [
  "Restaurants",
  "Home & Garden",
  "Auto Services",
  "Health & Beauty",
  "Arts",
  "More",
] as const;

interface CategoryTile {
  name: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const TILES: CategoryTile[] = [
  {
    name: "Restaurants",
    description: "Cafés, bakeries, family kitchens",
    href: "/search?category=FOOD_DRINK",
    icon: Utensils,
  },
  {
    name: "Home & Garden",
    description: "Plumbers, cleaners, landscapers",
    href: "/search?category=SERVICES&sub=home",
    icon: House,
  },
  {
    name: "Auto Services",
    description: "Repair, detail, body shops",
    href: "/search?category=SERVICES&sub=auto",
    icon: Car,
  },
  {
    name: "Health & Beauty",
    description: "Dentists, salons, barbers, spas",
    href: "/search?category=HEALTH_BEAUTY",
    icon: Sparkles,
  },
  {
    name: "Arts",
    description: "Galleries, music, photographers",
    href: "/search?category=ARTS",
    icon: Palette,
  },
  {
    name: "Local Shops",
    description: "Bookstores, records, boutiques",
    href: "/search?category=RETAIL",
    icon: ShoppingBag,
  },
  {
    name: "More",
    description: "Everything else worth knowing",
    href: "/search",
    icon: MoreHorizontal,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] overflow-hidden text-white">
        {/* Background photo (placeholder until owners upload their own) */}
        <Image
          src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradient: dark on the left for legibility, fading to none on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
        {/* Soft warm tint for the entire hero — pulls toward the brand cream */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />

        {/* Top nav */}
        <header className="relative z-10">
          <div className="mx-auto max-w-[1400px] px-6 py-5 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="font-wordmark text-2xl lowercase leading-none tracking-tight">
                <span className="text-white">boost</span>
                <span className="text-terracotta">small</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-white/95">
              {NAV_CATEGORIES.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="inline-flex items-center gap-1.5 hover:text-white"
                >
                  {label}
                  <ChevronDown />
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 font-semibold"
                asChild
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button variant="warm" className="hidden sm:inline-flex" asChild>
                <Link href="/sign-in">Join boostsmall</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero text */}
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-20 md:pt-32 pb-32">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80 mb-5">
            Houston Metro · Coming soon
          </p>
          <h1
            className="font-display text-white leading-[0.95] max-w-[16ch]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Find the family-owned places near you.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-[42ch] leading-relaxed">
            Real reviews of independent neighborhood favorites — restaurants,
            dentists, plumbers, bookstores, salons, and more. No chains.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button variant="warm" size="pill" asChild>
              <Link href="/search">
                <Search />
                Find a local favorite
              </Link>
            </Button>
            <Button
              variant="outline"
              size="pill"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
              asChild
            >
              <Link href="/submit">Add a business</Link>
            </Button>
          </div>
        </div>

        {/* Photo credit (Yelp pattern) */}
        <div className="absolute bottom-5 left-6 z-10 text-white text-xs leading-tight">
          <p className="font-bold">Common Bond — Houston</p>
          <p className="opacity-80">Photo placeholder · we credit owners directly</p>
        </div>
      </section>

      {/* ─── CATEGORIES ──────────────────────────────────────────────────── */}
      <section className="bg-background-soft border-y border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-2">
                Browse
              </p>
              <h2 className="font-display text-ink text-3xl md:text-4xl leading-tight">
                Local favorites by category
              </h2>
              <p className="mt-3 text-ink-soft max-w-[52ch]">
                Every business is independently owned, with five or fewer
                locations. No chains, no franchises, no publicly-traded parent
                companies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-4">
            {TILES.map((t) => (
              <Link
                key={t.name}
                href={t.href}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-5 transition-all hover:border-sage hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(125,139,94,0.12)]"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage/10 text-sage-deep transition-colors group-hover:bg-sage/20">
                  <t.icon size={22} />
                </span>
                <div>
                  <h3 className="font-bold text-ink leading-tight">{t.name}</h3>
                  <p className="mt-1 text-xs text-ink-soft leading-snug">
                    {t.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROMISE STRIP ──────────────────────────────────────────────── */}
      <section className="bg-background py-14">
        <div className="mx-auto max-w-[1200px] px-6 grid md:grid-cols-3 gap-8">
          <Promise
            title="Independent only"
            body="Five locations or fewer. Not publicly traded. Not on the chain blocklist. Verified by humans before they go live."
          />
          <Promise
            title="Reviews from neighbors"
            body="Accounts under 24 hours old can't post. Copy-paste reviews get flagged. Quality over volume, every time."
          />
          <Promise
            title="Owners can speak"
            body="Verified owners can respond to reviews, post photos, and update their info — without paying to be ranked."
          />
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────────── */}
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
    </main>
  );
}

function Promise({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-display text-ink text-2xl">{title}</h3>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}

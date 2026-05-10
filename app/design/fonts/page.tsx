import type { Metadata } from "next";
import {
  Inter,
  Instrument_Serif,
  Fraunces,
  Newsreader,
  Lora,
  DM_Serif_Display,
  Caveat,
  Crimson_Pro,
} from "next/font/google";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Font comparison",
  robots: { index: false, follow: false },
};

// Body sans — kept consistent across all options so only the display font changes.
const inter = Inter({ subsets: ["latin"], variable: "--demo-body" });

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-fraunces",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});
const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-lora",
});
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
});
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});
const crimson = Crimson_Pro({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
});

interface Sample {
  id: string;
  label: string;
  vibe: string;
  notes?: string;
  className: string; // Tailwind classes that set font-family from the loaded variable
  italicNote?: string;
}

const SAMPLES: Sample[] = [
  {
    id: "instrument",
    label: "Instrument Serif (current)",
    vibe: "Editorial · sharp · magazine. The current pick — clean & confident.",
    className: "[font-family:var(--font-instrument)]",
  },
  {
    id: "fraunces",
    label: "Fraunces",
    vibe: "Warm contemporary serif. Soft curves, soulful italic. Used by indie food brands constantly.",
    notes: "Closest to 'homey but still grown-up'.",
    className: "[font-family:var(--font-fraunces)]",
  },
  {
    id: "newsreader",
    label: "Newsreader",
    vibe: "Humanist serif from Production Type. Designed to feel like a thoughtful local newsletter.",
    className: "[font-family:var(--font-newsreader)]",
  },
  {
    id: "lora",
    label: "Lora",
    vibe: "Well-rounded serif, calm and readable. Very 'family-owned bookstore website'.",
    className: "[font-family:var(--font-lora)]",
  },
  {
    id: "dm-serif",
    label: "DM Serif Display",
    vibe: "Chunky high-contrast display serif. More dramatic, warmer than Instrument.",
    className: "[font-family:var(--font-dm-serif)]",
  },
  {
    id: "crimson",
    label: "Crimson Pro",
    vibe: "Classical book-style serif. Most traditional. Reads like a paperback.",
    className: "[font-family:var(--font-crimson)]",
  },
  {
    id: "caveat",
    label: "Caveat — handwritten",
    vibe: "Actual handwritten script. Most 'loving', the riskiest pick.",
    notes: "Original brief specifically said no script — flagging in case that no still stands.",
    className: "[font-family:var(--font-caveat)]",
  },
];

export default function FontsComparisonPage() {
  return (
    <main
      className={`min-h-screen bg-background ${inter.variable} ${instrument.variable} ${fraunces.variable} ${newsreader.variable} ${lora.variable} ${dmSerif.variable} ${caveat.variable} ${crimson.variable}`}
    >
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-5 flex items-center justify-between">
          <Link
            href="/design"
            className="text-sm text-ink-soft hover:text-ink underline-offset-4 hover:underline"
          >
            ← back to design system
          </Link>
          <span className="text-xs text-ink-soft tnum">font comparison</span>
        </div>
      </header>

      {/* Intro */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-12">
          <p className="text-xs uppercase tracking-[0.16em] text-ink-soft mb-4">
            Pick a display font
          </p>
          <h1 className="text-3xl text-ink leading-tight max-w-[680px]">
            Same headline, same body. Only the display font changes.
          </h1>
          <p className="mt-4 max-w-[680px] text-ink-soft leading-relaxed">
            Tell me which one feels right (e.g. &ldquo;use Fraunces&rdquo;) and
            I&apos;ll swap it in everywhere — no other code change. Body text is
            Inter throughout for consistency; we can tune that separately.
          </p>
        </div>
      </section>

      {/* Samples */}
      <div className="mx-auto max-w-[1200px] px-6">
        {SAMPLES.map((s) => (
          <FontBlock key={s.id} sample={s} />
        ))}
      </div>

      <footer className="border-t border-border mt-8">
        <div className="mx-auto max-w-[1200px] px-6 py-10 text-xs text-ink-soft">
          When you pick one, just say the name and I&apos;ll lock it in.
        </div>
      </footer>
    </main>
  );
}

function FontBlock({ sample }: { sample: Sample }) {
  return (
    <section className="border-b border-border py-12 md:grid md:grid-cols-[200px_1fr] md:gap-12">
      <aside className="mb-6 md:mb-0">
        <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
          option
        </p>
        <h2 className="mt-1 text-xl font-semibold text-ink">{sample.label}</h2>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          {sample.vibe}
        </p>
        {sample.notes && (
          <p className="mt-3 text-xs text-accent leading-relaxed">
            {sample.notes}
          </p>
        )}
      </aside>

      <div className="space-y-8">
        {/* Hero headline */}
        <div className={sample.className}>
          <p
            className="text-ink leading-[0.98] tracking-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)" }}
          >
            A discovery and review site for the{" "}
            <em className="text-accent not-italic md:italic">small places</em>{" "}
            that make a neighborhood feel like one.
          </p>
        </div>

        {/* Business card name + meta */}
        <div className="border border-border rounded-lg bg-surface p-5 max-w-[440px]">
          <h3
            className={`${sample.className} text-3xl text-ink leading-none`}
          >
            Bangkok Social
          </h3>
          <p className="mt-2 text-sm text-ink-soft">
            Thai · Cocktails · Houston, TX · $$$
          </p>
        </div>

        {/* Smaller display use */}
        <div className={`${sample.className}`}>
          <p
            className="text-ink"
            style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)" }}
          >
            Trinity Dental · Pearl Dentistry · Brennan&apos;s of Houston
          </p>
        </div>

        {/* Body context — always Inter */}
        <p className="text-sm text-ink-soft max-w-[680px] leading-relaxed">
          Body copy stays in Inter regardless of the display pick. Display fonts
          carry the personality; body fonts stay quiet and readable.
        </p>
      </div>
    </section>
  );
}

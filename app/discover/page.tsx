import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { discoverAction } from "@/server/actions/discover";

export const metadata: Metadata = {
  title: "Find something to do",
  description:
    "Tell us the vibe, budget, and neighborhood — we'll send you to a handful of family-owned local spots that fit.",
};

const VIBES = [
  { id: "eat-drink",  label: "Eat & drink",       emoji: "🍽️" },
  { id: "date-night", label: "Date night",        emoji: "🌙" },
  { id: "coffee",     label: "Coffee + work",     emoji: "☕" },
  { id: "shop",       label: "Shop something local", emoji: "🛍️" },
  { id: "arts",       label: "Something arty",    emoji: "🎨" },
  { id: "wellness",   label: "Wellness break",    emoji: "🧘" },
  { id: "services",   label: "Help around the house", emoji: "🛠️" },
  { id: "with-kids",  label: "With the kids",     emoji: "🧒" },
  { id: "outdoors",   label: "Plants + outdoors", emoji: "🌿" },
] as const;

const BUDGETS = [
  { id: "cheap",  label: "Cheap",  hint: "Up to $"   },
  { id: "medium", label: "Medium", hint: "Up to $$$" },
  { id: "treat",  label: "Treat",  hint: "Anything"  },
] as const;

const RADIUS_OPTIONS = ["3", "5", "10", "25", "50"] as const;

export default function DiscoverPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-background-soft">
        <div className="mx-auto max-w-[900px] px-6 py-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.16em] text-sage-deep font-bold mb-3">
            Find your thing
          </p>
          <h1
            className="font-display text-ink leading-tight"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}
          >
            Tell me what you&apos;re in the mood for.
          </h1>
          <p className="mt-4 max-w-prose text-ink-soft leading-relaxed">
            Pick a vibe, set a budget, drop a ZIP. I&apos;ll send you to a
            short list of family-owned spots that fit.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-10 md:py-14">
          <form action={discoverAction} className="space-y-10">
            {/* VIBE */}
            <fieldset>
              <legend className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-4">
                Vibe
              </legend>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {VIBES.map((v, i) => (
                  <label
                    key={v.id}
                    className="group relative flex items-center gap-3 rounded-2xl border border-border-strong bg-surface px-4 py-3 cursor-pointer hover:border-sage transition-colors has-[:checked]:bg-sage/10 has-[:checked]:border-sage"
                  >
                    <input
                      type="radio"
                      name="vibe"
                      value={v.id}
                      defaultChecked={i === 0}
                      className="sr-only peer"
                    />
                    <span className="text-2xl" aria-hidden>{v.emoji}</span>
                    <span className="text-sm font-semibold text-ink peer-checked:text-sage-deep">
                      {v.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* BUDGET */}
            <fieldset>
              <legend className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-4">
                Budget
              </legend>
              <div className="grid grid-cols-3 gap-3">
                {BUDGETS.map((b, i) => (
                  <label
                    key={b.id}
                    className="flex flex-col items-center gap-1 rounded-2xl border border-border-strong bg-surface px-4 py-3 cursor-pointer hover:border-sage transition-colors has-[:checked]:bg-sage/10 has-[:checked]:border-sage"
                  >
                    <input
                      type="radio"
                      name="budget"
                      value={b.id}
                      defaultChecked={i === 1}
                      className="sr-only peer"
                    />
                    <span className="text-base font-bold text-ink peer-checked:text-sage-deep">
                      {b.label}
                    </span>
                    <span className="text-xs text-ink-soft tnum">{b.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* WHERE */}
            <fieldset>
              <legend className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-4">
                Where
              </legend>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-sm text-ink-soft font-semibold whitespace-nowrap shrink-0">
                  📍 ZIP
                </span>
                <Input
                  name="zip"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{5}"
                  maxLength={5}
                  placeholder="77007 (optional)"
                  className="rounded-full max-w-[160px] tnum"
                />
                <span className="text-ink-soft text-xs">within</span>
                <select
                  name="radius"
                  defaultValue="10"
                  className="rounded-full border border-border-strong bg-surface px-4 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                >
                  {RADIUS_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r} miles
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                Leave blank to search all of metro Houston.
              </p>
            </fieldset>

            {/* OPTIONAL FREE-FORM */}
            <fieldset>
              <legend className="text-xs uppercase tracking-widest font-bold text-sage-deep mb-4">
                Anything specific? (optional)
              </legend>
              <Input
                name="q"
                type="text"
                placeholder="bbq, pottery class, indie bookstore…"
                className="rounded-full"
              />
            </fieldset>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="submit" variant="warm" size="lg" className="rounded-full">
                Find places →
              </Button>
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

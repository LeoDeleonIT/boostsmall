// Dark ink section pitching verification to small-business owners.
// Two columns: copy on left, polaroid photo on right tilted -2deg.

import { Check } from "lucide-react";
import { SectionReveal, RevealItem } from "./SectionReveal.jsx";

const POINTS = [
  "Free forever — no listing fees, no commissions, no 'boosted' tier",
  "You control your page, your hours, your photos, your story",
  "A verified stamp so neighbors know you're the real deal",
  "No ads from your competitors shown on top of your listing — ever",
];

export default function ForOwners() {
  return (
    <section className="relative bg-ink text-cream py-20 md:py-28 overflow-hidden">
      <div className="max-w-content mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        <SectionReveal stagger>
          <RevealItem>
            <p className="text-xs md:text-sm font-semibold uppercase tracking-meta text-ochre mb-4">
              For owners
            </p>
          </RevealItem>

          <RevealItem>
            <h2 className="font-serif font-medium text-cream text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight mb-6">
              Run a shop? We're on your side.
            </h2>
          </RevealItem>

          <RevealItem>
            <p className="text-lg text-cream/80 leading-relaxed mb-10 max-w-lg">
              boostsmall exists because the internet has made it harder — not easier — for
              small shops to be found. If you're independent and local, we want you here.
            </p>
          </RevealItem>

          <RevealItem>
            <ul className="space-y-4 mb-10">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center">
                    <Check size={12} strokeWidth={3} className="text-sage" />
                  </span>
                  <span className="text-base text-cream/90 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-ochre hover:bg-ochre/90 text-ink px-6 py-3.5 rounded-full text-sm font-semibold tracking-wide shadow-warm-md transition-colors"
            >
              Claim your business
            </a>
          </RevealItem>
        </SectionReveal>

        {/* Polaroid */}
        <SectionReveal className="flex justify-center lg:justify-end">
          <div
            className="relative bg-cream p-3 pb-14 shadow-warm-lg rotate-[-2deg] max-w-sm w-full"
            style={{ transformOrigin: "center" }}
          >
            <div className="aspect-[4/5] bg-cream-dark overflow-hidden with-fallback">
              <img
                src="https://picsum.photos/seed/boostsmall-shopkeeper-rosa/600/750"
                alt="Shop owner standing in the doorway of her bakery"
                loading="lazy"
                className="w-full h-full object-cover photo-warm"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <p className="absolute bottom-3 left-0 right-0 text-center font-hand text-2xl text-ink/80">
              Rosa, since 2011
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

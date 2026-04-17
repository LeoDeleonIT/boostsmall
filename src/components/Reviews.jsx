// Reviews strip — 3 handwritten-feel cards, each slightly rotated.
// Sage callout below reminds visitors these are real neighbors.

import { TESTIMONIALS } from "../data/testimonials.js";
import Star from "./svg/Star.jsx";
import { SectionReveal, RevealItem } from "./SectionReveal.jsx";

export default function Reviews() {
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-content mx-auto px-5 md:px-8">
        <SectionReveal className="text-center mb-14 md:mb-20">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-meta text-sage-dark mb-4">
            Real neighbors
          </p>
          <h2 className="font-serif font-medium text-ink text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight max-w-2xl mx-auto">
            Word gets around.
          </h2>
        </SectionReveal>

        <SectionReveal
          stagger
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10"
        >
          {TESTIMONIALS.map((t, i) => (
            <RevealItem key={i}>
              <ReviewCard t={t} />
            </RevealItem>
          ))}
        </SectionReveal>

        <SectionReveal className="text-center">
          <p className="inline-block text-sm text-sage-dark bg-sage/10 px-4 py-2 rounded-full">
            Every review here is from a real neighbor who visited the shop.
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}

function ReviewCard({ t }) {
  return (
    <div
      className="bg-cream rounded-2xl p-7 md:p-8 shadow-warm-sm border border-cream-dark h-full flex flex-col"
      style={{ transform: `rotate(${t.tilt}deg)` }}
    >
      <div className="flex items-center gap-0.5 mb-4" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={14} filled={n <= t.rating} />
        ))}
      </div>
      <p className="font-hand text-2xl md:text-[1.4rem] text-ink leading-snug mb-6 flex-1">
        “{t.quote}”
      </p>
      <div className="pt-4 border-t border-cream-dark">
        <p className="font-serif text-lg text-ink font-medium">{t.name}</p>
        <p className="text-xs text-ink-soft mt-0.5">{t.neighborhood}</p>
      </div>
    </div>
  );
}

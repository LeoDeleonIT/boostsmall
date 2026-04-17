// "How it works" — three numbered cards on a darker cream background.
// Handwritten Caveat subhead for personal tone.

import { SectionReveal, RevealItem } from "./SectionReveal.jsx";

const STEPS = [
  {
    n: "01",
    title: "Find what's nearby",
    body:
      "Search by neighborhood or category — cafés, bookstores, tattoo shops, florists. Only independent, only real.",
  },
  {
    n: "02",
    title: "See who's verified",
    body:
      "Every owner-verified listing has been claimed by the actual person running the shop. No ghosts, no lookalikes.",
  },
  {
    n: "03",
    title: "Hear from your neighbors",
    body:
      "Reviews come from people who live here. No bots, no paid placements, no mysterious five-star brigades.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-cream-dark py-20 md:py-28">
      <div className="max-w-content mx-auto px-5 md:px-8">
        <SectionReveal className="text-center mb-14 md:mb-20">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-meta text-sage-dark mb-4">
            How it works
          </p>
          <h2 className="font-serif font-medium text-ink text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight max-w-2xl mx-auto">
            Built the way a good neighborhood guide should be.
          </h2>
          <p className="font-hand text-2xl md:text-3xl text-terracotta mt-6">
            simple, like it should be
          </p>
        </SectionReveal>

        <SectionReveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {STEPS.map((s) => (
            <RevealItem
              key={s.n}
              className="bg-cream rounded-2xl p-7 md:p-8 shadow-warm-sm border border-cream-dark"
            >
              <p className="font-serif text-5xl md:text-6xl text-terracotta/90 leading-none mb-5">
                {s.n}
              </p>
              <h3 className="font-serif text-xl md:text-2xl text-ink font-medium mb-3 leading-snug">
                {s.title}
              </h3>
              <p className="text-base text-ink-soft leading-relaxed">
                {s.body}
              </p>
            </RevealItem>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}

// "Verified & Loved" — 6 featured business cards in a 3/2/1 responsive grid.

import { FEATURED_BUSINESSES } from "../data/businesses.js";
import BusinessCard from "./BusinessCard.jsx";
import { SectionReveal, RevealItem } from "./SectionReveal.jsx";

export default function FeaturedBusinesses() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-content mx-auto px-5 md:px-8">
        <SectionReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="text-xs md:text-sm font-semibold uppercase tracking-meta text-sage-dark mb-4">
              Verified & Loved
            </p>
            <h2 className="font-serif font-medium text-ink text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight max-w-xl">
              Six shops worth a visit.
            </h2>
          </div>
          <a
            href="#"
            className="text-sm font-semibold text-terracotta hover:text-terracotta-dark self-start md:self-auto"
          >
            See all 1,247 →
          </a>
        </SectionReveal>

        <SectionReveal
          stagger
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {FEATURED_BUSINESSES.map((b) => (
            <RevealItem key={b.slug}>
              <BusinessCard business={b} />
            </RevealItem>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}

// 9 category tiles. Horizontal scroll on mobile, 3×3 grid on md+.

import { CATEGORIES } from "../data/categories.js";
import { SectionReveal, RevealItem } from "./SectionReveal.jsx";

export default function CategoryGrid() {
  return (
    <section className="bg-cream-dark py-20 md:py-28">
      <div className="max-w-content mx-auto px-5 md:px-8">
        <SectionReveal className="mb-12 md:mb-16">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-meta text-sage-dark mb-4">
            Browse by craft
          </p>
          <h2 className="font-serif font-medium text-ink text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight max-w-xl">
            Whatever you're looking for, start here.
          </h2>
        </SectionReveal>

        {/* Mobile horizontal scroll */}
        <SectionReveal
          stagger
          className="md:hidden flex gap-4 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-4"
        >
          {CATEGORIES.map((c) => (
            <RevealItem key={c.slug}>
              <CategoryTile cat={c} />
            </RevealItem>
          ))}
        </SectionReveal>

        {/* Desktop grid */}
        <SectionReveal
          stagger
          className="hidden md:grid grid-cols-3 gap-5 lg:gap-6"
        >
          {CATEGORIES.map((c) => (
            <RevealItem key={c.slug}>
              <CategoryTile cat={c} />
            </RevealItem>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}

function CategoryTile({ cat }) {
  const { name, icon: Icon, count } = cat;
  return (
    <a
      href="#"
      className="group flex-shrink-0 w-[180px] md:w-auto h-[180px] bg-cream rounded-2xl p-6 flex flex-col justify-between border border-cream-dark hover:border-terracotta/30 hover:shadow-warm-md transition-all duration-200"
    >
      <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center group-hover:bg-terracotta group-hover:scale-105 transition-all duration-200">
        <Icon size={22} strokeWidth={1.6} className="text-terracotta group-hover:text-cream transition-colors" />
      </div>
      <div>
        <h3 className="font-serif text-xl text-ink font-medium leading-tight">
          {name}
        </h3>
        <p className="text-xs text-ink-soft mt-1">{count} shops</p>
      </div>
    </a>
  );
}

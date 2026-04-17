// Brick-red centered manifesto — founder's note.

import { SectionReveal } from "./SectionReveal.jsx";

export default function Manifesto() {
  return (
    <section className="bg-brick text-cream py-24 md:py-32">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <SectionReveal>
          <p className="font-serif text-2xl md:text-3xl leading-[1.4] text-cream/95">
            Big retail sold us convenience and took our main streets with it.
            boostsmall is a small bet that a neighborhood still matters — that
            the bakery, the barber, the bike shop, and the bookstore are
            worth remembering the names of.
          </p>
          <p className="font-hand text-3xl md:text-4xl text-ochre mt-10">
            — Leo, founder
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}

// Hero section — 60/40 two column on desktop, stacked on mobile.
// Left: eyebrow, headline with squiggle under "home", subhead, CTAs, stat row.
// Right: collage of 4 rotated photos that "settle" into place.

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Squiggle from "./svg/Squiggle.jsx";

// Photo seeds via picsum.photos — deterministic so each reload shows
// the same four shots. Swap to /images/hero/*.jpg when real photos
// are sourced; the onError fallback hides any broken img gracefully.
const COLLAGE = [
  {
    src: "https://picsum.photos/seed/boostsmall-bakery/600/750",
    alt: "Hands pulling bread from a neighborhood bakery oven",
    rotate: -4,
    top: "0%",
    left: "4%",
    w: "58%",
    delay: 0.1,
  },
  {
    src: "https://picsum.photos/seed/boostsmall-bookshop/600/750",
    alt: "Warm bookshop interior with a reading nook",
    rotate: 3,
    top: "12%",
    left: "42%",
    w: "56%",
    delay: 0.25,
  },
  {
    src: "https://picsum.photos/seed/boostsmall-florist/600/750",
    alt: "A florist arranging stems at her worktable",
    rotate: -2,
    top: "52%",
    left: "0%",
    w: "54%",
    delay: 0.4,
  },
  {
    src: "https://picsum.photos/seed/boostsmall-coffee/600/750",
    alt: "Pour-over coffee at an independent cafe",
    rotate: 4,
    top: "58%",
    left: "46%",
    w: "52%",
    delay: 0.55,
  },
];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden">
      <div className="max-w-content mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
        {/* Left: text column (60%) */}
        <div className="lg:col-span-3">
          <motion.p
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs md:text-sm font-semibold uppercase tracking-meta text-sage-dark mb-6"
          >
            For the little guys
          </motion.p>

          <motion.h1
            initial={reduce ? {} : { opacity: 0, y: 14 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-serif font-medium text-ink leading-[1.05] tracking-tight text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[4.4rem]"
          >
            The shops that make your neighborhood feel like{" "}
            <span className="relative inline-block whitespace-nowrap">
              home
              <Squiggle className="absolute left-0 -bottom-2 md:-bottom-3 w-full h-3 md:h-4" />
            </span>
            .
          </motion.h1>

          <motion.p
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-7 text-lg md:text-xl text-ink-soft max-w-xl leading-relaxed"
          >
            boostsmall is a directory of the independent places your neighbors
            actually love — verified, reviewed, and never ranked by who paid the most.
          </motion.p>

          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-9 flex flex-col sm:flex-row gap-3"
          >
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-cream px-6 py-3.5 rounded-full text-sm font-semibold tracking-wide shadow-warm-md transition-colors"
            >
              Find a shop near you
              <ArrowRight size={16} strokeWidth={2.2} />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-ink border border-ink/15 hover:border-ink/40 hover:bg-cream-dark/60 transition-colors"
            >
              For owners
            </a>
          </motion.div>

          <motion.p
            initial={reduce ? {} : { opacity: 0 }}
            animate={reduce ? {} : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 text-sm text-ink-soft/80 font-medium"
          >
            <span className="text-ink font-semibold">1,247</span> shops ·{" "}
            <span className="text-ink font-semibold">89</span> verified owners ·{" "}
            <span className="text-ink font-semibold">0</span> corporate chains
          </motion.p>
        </div>

        {/* Right: photo collage (40%) */}
        <div className="lg:col-span-2 relative w-full aspect-[4/5] max-w-md mx-auto lg:mx-0">
          {COLLAGE.map((p, i) => (
            <motion.div
              key={i}
              initial={
                reduce
                  ? {}
                  : { opacity: 0, y: -28, rotate: p.rotate * 3, scale: 0.96 }
              }
              animate={
                reduce
                  ? {}
                  : { opacity: 1, y: 0, rotate: p.rotate, scale: 1 }
              }
              transition={{
                duration: 0.9,
                delay: p.delay,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              style={{
                top: p.top,
                left: p.left,
                width: p.w,
                transform: reduce ? `rotate(${p.rotate}deg)` : undefined,
              }}
              className="absolute aspect-[4/5] bg-cream-dark rounded-sm shadow-warm-md overflow-hidden p-2 pb-6 with-fallback"
            >
              <img
                src={p.src}
                alt={p.alt}
                loading={i < 2 ? "eager" : "lazy"}
                className="w-full h-full object-cover photo-warm"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

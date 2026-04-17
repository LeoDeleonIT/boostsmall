// Footer — newsletter signup, 4-column link grid, ochre divider, bottom row.

import { Instagram, Twitter, Mail } from "lucide-react";
import Sprout from "./svg/Sprout.jsx";

const COLS = [
  {
    title: "Discover",
    links: ["Browse shops", "By neighborhood", "By category", "New listings"],
  },
  {
    title: "For owners",
    links: ["Claim your shop", "How verification works", "Pricing (it's free)", "Owner FAQ"],
  },
  {
    title: "About",
    links: ["Our story", "Manifesto", "Press", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookies", "Accessibility"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/70">
      {/* Newsletter signup */}
      <div className="border-b border-cream/10">
        <div className="max-w-content mx-auto px-5 md:px-8 py-14 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-cream font-medium leading-snug">
              New shops worth knowing, once a month.
            </h3>
            <p className="text-sm text-cream/60 mt-2">
              A short note from a human. No spam, no algorithms.
            </p>
          </div>
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-2 flex-1 bg-cream/5 border border-cream/15 rounded-full px-4 py-3 focus-within:border-ochre/60 transition-colors">
              <Mail size={15} strokeWidth={2} className="text-cream/40 flex-shrink-0" />
              <input
                type="email"
                placeholder="you@neighborhood.com"
                className="flex-1 bg-transparent outline-none text-sm text-cream placeholder:text-cream/40"
              />
            </div>
            <button
              type="submit"
              className="bg-ochre hover:bg-ochre/90 text-ink px-6 py-3 rounded-full text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="max-w-content mx-auto px-5 md:px-8 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-0.5 mb-4">
              <span className="font-serif text-xl font-medium text-cream">b</span>
              <span className="relative inline-block">
                <span className="font-serif text-xl font-medium text-cream">o</span>
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2">
                  <Sprout size={10} />
                </span>
              </span>
              <span className="font-serif text-xl font-medium text-cream">ostsmall</span>
            </a>
            <p className="text-sm text-cream/60 leading-relaxed max-w-xs">
              A directory for the shops that still know your name.
            </p>
            <div className="flex gap-2 mt-5">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-cream/5 hover:bg-cream/10 flex items-center justify-center text-cream/60 hover:text-cream transition-colors"
              >
                <Instagram size={15} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-cream/5 hover:bg-cream/10 flex items-center justify-center text-cream/60 hover:text-cream transition-colors"
              >
                <Twitter size={15} />
              </a>
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-meta text-cream mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-cream/60 hover:text-cream transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Ochre divider */}
        <div className="h-px bg-ochre/50 mb-6" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-cream/50">
          <p>© 2026 boostsmall · made with care in Houston</p>
          <p>no investors · no ads · no algorithms playing favorites</p>
        </div>
      </div>
    </footer>
  );
}

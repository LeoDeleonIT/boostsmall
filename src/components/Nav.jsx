// Sticky top nav. Transparent over hero, solid cream after scroll.
// Wordmark "boost(o)small" with sprout growing from the "o".
// Desktop: center links + location chip + Sign in + mobile hamburger fallback.

import { useEffect, useState } from "react";
import { MapPin, Menu, X } from "lucide-react";
import Sprout from "./svg/Sprout.jsx";

const LINKS = ["Discover", "For owners", "Our story"];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md border-b border-cream-dark"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-content mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        {/* Wordmark with sprout in the "o" */}
        <a href="#" className="flex items-center gap-0.5 group" aria-label="boostsmall home">
          <span className="font-serif text-2xl font-medium tracking-tight text-ink">
            b
          </span>
          <span className="relative inline-block">
            <span className="font-serif text-2xl font-medium tracking-tight text-ink">
              o
            </span>
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none">
              <Sprout size={12} />
            </span>
          </span>
          <span className="font-serif text-2xl font-medium tracking-tight text-ink">
            ostsmall
          </span>
        </a>

        {/* Desktop center nav */}
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
            >
              {l}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-5">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-dark/70 hover:bg-cream-dark text-xs font-medium text-ink-soft transition-colors"
          >
            <MapPin size={12} strokeWidth={2} className="text-terracotta" />
            Houston, TX
          </button>
          <a
            href="#"
            className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
          >
            Sign in
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 text-ink"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-cream/98 backdrop-blur-md border-b border-cream-dark">
          <div className="px-5 py-4 flex flex-col gap-3">
            {LINKS.map((l) => (
              <a
                key={l}
                href="#"
                className="text-base font-medium text-ink py-1.5"
              >
                {l}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-2 border-t border-cream-dark mt-2">
              <MapPin size={14} className="text-terracotta" />
              <span className="text-sm text-ink-soft">Houston, TX</span>
            </div>
            <a href="#" className="text-sm font-medium text-ink-soft pt-1">
              Sign in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { useEffect } from "react";

// Wires the two halves of /search:
//   - card hover  → highlight the matching map pin (via window event)
//   - pin click   → scroll the matching card into view + flash a ring
// Decoupled by CustomEvent so neither side has to import the other.
export function SearchInteractions() {
  useEffect(() => {
    let activeSlug: string | null = null;

    const slugFor = (target: EventTarget | null): string | null => {
      const el = (target as HTMLElement)?.closest?.("[data-business-slug]");
      return (el as HTMLElement | null)?.dataset?.businessSlug ?? null;
    };

    const onOver = (e: MouseEvent) => {
      const slug = slugFor(e.target);
      if (!slug || slug === activeSlug) return;
      activeSlug = slug;
      window.dispatchEvent(
        new CustomEvent("bs:hover-card", { detail: { slug } })
      );
    };
    const onOut = (e: MouseEvent) => {
      const slug = slugFor(e.target);
      // mouseout fires on every child element; only clear when leaving the card
      const next = slugFor(e.relatedTarget);
      if (slug && next !== slug) {
        activeSlug = null;
        window.dispatchEvent(
          new CustomEvent("bs:leave-card", { detail: { slug } })
        );
      }
    };

    const onPinClick = (e: Event) => {
      const slug = (e as CustomEvent<{ slug: string }>).detail?.slug;
      if (!slug) return;
      const card = document.querySelector<HTMLElement>(
        `[data-business-slug="${CSS.escape(slug)}"]`
      );
      if (!card) return;
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.dataset.mapActive = "true";
      window.setTimeout(() => {
        delete card.dataset.mapActive;
      }, 1800);
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("bs:pin-click", onPinClick);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("bs:pin-click", onPinClick);
    };
  }, []);

  return null;
}

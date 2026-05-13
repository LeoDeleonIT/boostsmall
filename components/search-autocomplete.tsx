"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Search } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { SearchIndexEntry } from "@/lib/search-index";

// Controlled input + suggestions popover. Drops into any /search form
// in place of the bare <input>; the surrounding <form action="/search">
// still handles Enter the way it always did (full search results page),
// but clicking a suggestion jumps straight to that business's page so
// the user skips the results list entirely.
//
// Two visual variants:
//   size="sm" — the slim pill used in the site header
//   size="md" — the prominent white pill on the home hero / /search top bar
export function SearchAutocomplete({
  entries,
  placeholder = "Coffee, dentist, bike repair…",
  size = "md",
  className,
  defaultQuery = "",
}: {
  entries: SearchIndexEntry[];
  placeholder?: string;
  size?: "sm" | "md";
  className?: string;
  /** Seeds the input from a URL param like /search?q=foo. */
  defaultQuery?: string;
}) {
  const [q, setQ] = useState(defaultQuery);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return entries
      .filter(
        (e) =>
          e.name.toLowerCase().includes(term) ||
          e.subcategory.toLowerCase().includes(term) ||
          e.city.toLowerCase().includes(term),
      )
      .slice(0, 8);
  }, [q, entries]);

  const showPopover = open && matches.length > 0;

  const wrapperClass =
    size === "sm"
      ? "rounded-full border border-border-strong bg-surface px-4 py-2 focus-within:ring-2 focus-within:ring-terracotta"
      : "rounded-full bg-white px-5 py-3 shadow-lg";
  const inputClass =
    size === "sm"
      ? "ml-3 flex-1 bg-transparent text-sm placeholder:text-ink-soft/70 focus:outline-none"
      : "ml-3 flex-1 bg-transparent text-base text-ink placeholder:text-ink-soft/60 focus:outline-none";
  const iconSize = size === "sm" ? 18 : 20;

  return (
    <div className={cn("relative flex-1 flex items-center", wrapperClass, className)}>
      <Search size={iconSize} />
      <input
        ref={inputRef}
        type="text"
        name="q"
        placeholder={placeholder}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        // Delay closing so clicks on suggestions register before blur
        // tears down the popover.
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            inputRef.current?.blur();
          }
        }}
        className={inputClass}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={showPopover}
      />
      {showPopover && (
        <ul
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 max-h-[60vh] overflow-y-auto rounded-2xl border border-border bg-surface shadow-xl z-50"
        >
          {matches.map((m) => (
            <li key={m.slug} role="option" aria-selected="false">
              <Link
                href={`/b/${m.slug}`}
                // Prevent the input's onBlur from firing before the
                // click registers — otherwise the popover unmounts
                // mid-tap and the link never fires.
                onMouseDown={(e) => e.preventDefault()}
                className="flex flex-col gap-0.5 px-4 py-2.5 hover:bg-background-soft border-b border-border last:border-b-0"
              >
                <span className="text-sm text-ink font-bold">{m.name}</span>
                <span className="text-xs text-ink-soft">
                  {m.subcategory} · {m.city}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

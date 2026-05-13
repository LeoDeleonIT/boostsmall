"use client";

import { useState } from "react";

// Address block with a click-to-copy affordance. Clicking anywhere on
// the block (or the small copy icon) copies the full single-line
// address to the clipboard and flashes a brief "Copied" confirmation
// next to the icon. Falls back silently if the clipboard API is
// blocked (we don't want a copy-button to behave like a save dialog).
export function CopyAddress({
  addressLine1,
  city,
  state,
  postalCode,
}: {
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
}) {
  const full = `${addressLine1}, ${city}, ${state} ${postalCode}`;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Some browsers / contexts (insecure origins, embedded webviews)
      // block writeText. Nothing we can do — leave silent.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy address"
      title={copied ? "Address copied" : "Click to copy address"}
      className="group flex w-full items-start gap-2 text-left rounded-lg -mx-1 px-1 py-0.5 hover:bg-background-soft transition-colors cursor-copy"
    >
      <div className="flex-1 min-w-0">
        <p className="font-bold text-ink">{addressLine1}</p>
        <p className="text-sm text-ink-soft">
          {city}, {state} {postalCode}
        </p>
      </div>
      <span
        className={
          copied
            ? "shrink-0 inline-flex items-center gap-1 text-xs font-bold text-sage-deep mt-1"
            : "shrink-0 inline-flex items-center gap-1 text-xs text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity mt-1"
        }
        aria-hidden={!copied}
      >
        {copied ? (
          <>
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </>
        )}
      </span>
    </button>
  );
}

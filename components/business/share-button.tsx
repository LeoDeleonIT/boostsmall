"use client";

import { useState } from "react";

// Icon-only button that opens the native share sheet on mobile (and any
// desktop browser that supports it) or falls back to copying the URL to
// the clipboard. The label confirms the copy with a brief "Copied"
// state so the user knows it worked without a toast system.
export function ShareButton({
  url,
  title,
  text,
}: {
  url: string;
  title: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const data: ShareData = { url, title, text };
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share(data);
        return;
      } catch (e) {
        // User cancelled or share blocked — fall through to copy.
        if ((e as DOMException)?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Last-resort fallback: open mailto with the link prefilled.
      window.location.href = `mailto:?subject=${encodeURIComponent(
        title,
      )}&body=${encodeURIComponent(text + "\n\n" + url)}`;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Share this place"
      title={copied ? "Link copied" : "Share this place"}
      className={
        copied
          ? "inline-flex items-center justify-center h-12 w-12 rounded-2xl border border-sage text-sage-deep bg-sage/10 transition-colors"
          : "inline-flex items-center justify-center h-12 w-12 rounded-2xl border border-border-strong bg-surface text-ink-soft hover:text-terracotta-deep hover:border-terracotta transition-colors"
      }
    >
      {copied ? (
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      )}
    </button>
  );
}

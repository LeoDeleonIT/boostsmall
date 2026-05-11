"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const LABELS = ["Terrible", "Poor", "OK", "Great", "Perfect"];

export function RatingInput({
  name = "rating",
  defaultValue = 0,
}: {
  name?: string;
  defaultValue?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex items-center gap-3">
      <input type="hidden" name={name} value={value} />
      <div
        className="inline-flex items-center gap-1"
        role="radiogroup"
        aria-label="Rating"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= display;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} star${n === 1 ? "" : "s"} (${LABELS[n - 1]})`}
              onClick={() => setValue(n)}
              onMouseEnter={() => setHover(n)}
              className={cn(
                "p-0.5 rounded transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2",
                "hover:scale-110"
              )}
            >
              <Star
                filled={filled}
                className={cn(
                  "h-9 w-9 transition-colors",
                  filled ? "text-terracotta" : "text-ink-soft/30"
                )}
              />
            </button>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-ink-soft tabular-nums w-20">
        {display ? `${display} · ${LABELS[display - 1]}` : "Pick one"}
      </span>
    </div>
  );
}

function Star({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      aria-hidden="true"
    >
      <path
        strokeLinejoin="round"
        d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.74.99-5.79L1.58 7.62l5.82-.85L10 1.5z"
      />
    </svg>
  );
}

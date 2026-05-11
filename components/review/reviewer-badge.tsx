/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { type Tier } from "@/lib/reviewer-trust";
import { cn } from "@/lib/utils";

// Standard pill: icon + label. The icon is either an emoji or, when a
// tier has an illustrated badge image set, a small thumbnail of that
// image (label text baked into the art is too small to read inline, so
// we always render the label as real text alongside).
//
// On `size="lg"` we render the full badge art (label and all) without
// the pill chrome — useful on /about/trust where each tier has room to
// breathe.
export function ReviewerBadge({
  tier,
  size = "sm",
  link = true,
  className,
}: {
  tier: Tier;
  size?: "sm" | "md" | "lg";
  /** Wraps the badge in a link to /about/trust. Disable inside other links. */
  link?: boolean;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const useImage = !!tier.image && !imageFailed;

  let inner: React.ReactNode;

  if (size === "lg" && useImage) {
    // Full-art mode: just the illustrated badge, no pill chrome.
    inner = (
      <img
        src={tier.image!}
        alt={tier.label}
        title={`${tier.label} · ${tier.blurb}`}
        onError={() => setImageFailed(true)}
        className={cn("h-24 w-auto select-none drop-shadow-sm", className)}
      />
    );
  } else {
    // Icon-pill mode: small icon + label text.
    const sizeClass =
      size === "md"
        ? "text-sm px-2.5 py-1 gap-1.5"
        : "text-xs px-2 py-0.5 gap-1";
    const iconSize = size === "md" ? "h-5 w-5" : "h-4 w-4";
    inner = (
      <span
        title={`${tier.label} · ${tier.blurb}`}
        className={cn(
          "inline-flex items-center rounded-full border font-bold leading-none whitespace-nowrap",
          sizeClass,
          tier.pillClass,
          className
        )}
      >
        {useImage ? (
          <img
            src={tier.image!}
            alt=""
            onError={() => setImageFailed(true)}
            className={cn("rounded-full object-cover", iconSize)}
          />
        ) : (
          <span aria-hidden>{tier.emoji}</span>
        )}
        <span>{tier.label}</span>
      </span>
    );
  }

  if (!link) return inner;
  return (
    <Link
      href="/about/trust"
      className="inline-flex hover:opacity-80 transition-opacity"
    >
      {inner}
    </Link>
  );
}

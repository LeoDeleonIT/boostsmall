"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { type Specialty } from "@/lib/reviewer-trust";
import { cn } from "@/lib/utils";

// Specialty badges sit beside the tier on the profile. Renders the emoji by
// default; if the badge def has a custom illustration path AND that file
// exists in /public, the renderer swaps to the image. Failed loads fall
// back to emoji silently — so missing PNGs don't break the page.
export function SpecialtyBadge({
  specialty,
  className,
}: {
  specialty: Specialty;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const useImage = specialty.image && !imageFailed;

  return (
    <span
      title={`${specialty.label} — ${specialty.blurb}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-bold text-xs px-2.5 py-1 leading-none whitespace-nowrap",
        specialty.pillClass,
        className
      )}
    >
      {useImage ? (
        <img
          src={specialty.image}
          alt=""
          width={16}
          height={16}
          className="h-4 w-4 rounded-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden>{specialty.emoji}</span>
      )}
      <span>{specialty.label}</span>
    </span>
  );
}

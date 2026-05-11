import Link from "next/link";
import { type Tier } from "@/lib/reviewer-trust";
import { cn } from "@/lib/utils";

// Small inline pill. Shown next to the author name on review cards and on
// /u/[username]. Hover/title gives the friendly blurb so users learn what
// each tier means without leaving the page.
export function ReviewerBadge({
  tier,
  size = "sm",
  link = true,
  className,
}: {
  tier: Tier;
  size?: "sm" | "md";
  /** Wraps the pill in a link to /about/trust. Disable inside other links. */
  link?: boolean;
  className?: string;
}) {
  const sizeClass =
    size === "md"
      ? "text-sm px-2.5 py-1 gap-1.5"
      : "text-xs px-2 py-0.5 gap-1";

  const pill = (
    <span
      title={`${tier.label} · ${tier.blurb}`}
      className={cn(
        "inline-flex items-center rounded-full border font-bold leading-none whitespace-nowrap",
        sizeClass,
        tier.pillClass,
        className
      )}
    >
      <span aria-hidden>{tier.emoji}</span>
      <span>{tier.label}</span>
    </span>
  );

  if (!link) return pill;
  return (
    <Link
      href="/about/trust"
      className="inline-flex hover:opacity-80 transition-opacity"
    >
      {pill}
    </Link>
  );
}

import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  outOf?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function RatingStars({
  rating,
  outOf = 5,
  size = "md",
  showNumber = false,
  className,
  ariaLabel,
}: RatingStarsProps) {
  const sizes = {
    sm: { star: "h-3 w-3", gap: "gap-0.5", text: "text-xs" },
    md: { star: "h-4 w-4", gap: "gap-1", text: "text-sm" },
    lg: { star: "h-5 w-5", gap: "gap-1", text: "text-base" },
  } as const;

  const s = sizes[size];

  return (
    <span
      className={cn("inline-flex items-center", s.gap, className)}
      role="img"
      aria-label={ariaLabel ?? `${rating.toFixed(1)} out of ${outOf} stars`}
    >
      {Array.from({ length: outOf }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return <Star key={i} filled={filled} className={s.star} />;
      })}
      {showNumber && (
        <span className={cn("ml-1.5 tnum text-ink-soft", s.text)}>
          {rating.toFixed(1)}
        </span>
      )}
    </span>
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

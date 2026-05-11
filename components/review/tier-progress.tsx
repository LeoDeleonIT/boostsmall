import { type Tier } from "@/lib/reviewer-trust";

// Linear progress bar between the user's current tier and the next one.
// Bar grows sage→terracotta as you climb. At the top tier, shows a quiet
// "Top tier" pill instead. Score itself stays hidden — we surface progress
// as a fraction, not a number.
export function TierProgress({
  current,
  next,
  progress,
}: {
  current: Tier;
  next: Tier | null;
  /** 0–1 fraction between the two tier thresholds. */
  progress: number;
}) {
  if (!next) {
    return (
      <div className="rounded-2xl border border-terracotta/40 bg-terracotta/10 p-4 text-sm text-terracotta-deep flex items-center gap-2">
        <span aria-hidden>{current.emoji}</span>
        <span className="font-bold">{current.label}</span>
        <span className="text-ink-soft">·</span>
        <span>Top tier — thanks for being a fixture around here.</span>
      </div>
    );
  }

  const pct = Math.round(progress * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="inline-flex items-center gap-1 text-ink-soft">
          <span aria-hidden>{current.emoji}</span>
          <span className="font-bold text-ink">{current.label}</span>
        </span>
        <span className="text-ink-soft tnum">{pct}% to next</span>
        <span className="inline-flex items-center gap-1 text-ink-soft">
          <span className="font-bold text-ink">{next.label}</span>
          <span aria-hidden>{next.emoji}</span>
        </span>
      </div>
      <div
        className="relative h-2 w-full rounded-full bg-ink/8 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`${pct}% of the way from ${current.label} to ${next.label}`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sage to-terracotta"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

import "server-only";
import { db } from "@/lib/db";

// ─── Public tiers ──────────────────────────────────────────────────────────
// Each tier is unlocked at a fixed trust-score threshold. Names are
// neighborhood-warm, not gamified. Icons are plant/storefront cues —
// seedling → oak as you grow. Public-facing.

export type TierKey =
  | "new-neighbor"
  | "local-supporter"
  | "trusted-regular"
  | "neighborhood-guide"
  | "community-favorite"
  | "local-champion";

export interface Tier {
  key: TierKey;
  label: string;
  blurb: string;
  threshold: number;
  emoji: string;
  // Tailwind utility classes for the pill (bg + text + border).
  pillClass: string;
}

export const TIERS: readonly Tier[] = [
  {
    key: "new-neighbor",
    label: "New Neighbor",
    blurb: "Just joined the block.",
    threshold: 0,
    emoji: "🌱",
    pillClass: "bg-sage/10 text-sage-deep border-sage/30",
  },
  {
    key: "local-supporter",
    label: "Local Supporter",
    blurb: "Showing up for the neighborhood.",
    threshold: 25,
    emoji: "🌿",
    pillClass: "bg-sage/15 text-sage-deep border-sage/40",
  },
  {
    key: "trusted-regular",
    label: "Trusted Regular",
    blurb: "Reviews you can take to the bank.",
    threshold: 100,
    emoji: "🪴",
    pillClass: "bg-sage/20 text-sage-deep border-sage/50",
  },
  {
    key: "neighborhood-guide",
    label: "Neighborhood Guide",
    blurb: "Knows every block, every patio.",
    threshold: 280,
    emoji: "🌳",
    pillClass: "bg-terracotta/10 text-terracotta-deep border-terracotta/40",
  },
  {
    key: "community-favorite",
    label: "Community Favorite",
    blurb: "Other neighbors learn from their picks.",
    threshold: 700,
    emoji: "🏪",
    pillClass: "bg-terracotta/15 text-terracotta-deep border-terracotta/50",
  },
  {
    key: "local-champion",
    label: "Local Champion",
    blurb: "Earned every recommendation over years.",
    threshold: 1500,
    emoji: "🌳",
    pillClass: "bg-terracotta/25 text-terracotta-deep border-terracotta",
  },
] as const;

export function tierForScore(score: number): Tier {
  // Walk from highest down so the first hit wins.
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (score >= TIERS[i].threshold) return TIERS[i];
  }
  return TIERS[0];
}

// ─── Score formula ─────────────────────────────────────────────────────────
// Hidden from users (we surface the public tier, not the number). Weights
// chosen so a thoughtful reviewer reaches "Trusted Regular" after ~5 quality
// reviews with some peer helpful votes, not 50.

interface TrustSignals {
  reviewCount: number;
  helpfulReceived: number; // sum of helpfulCount across their reviews
  helpfulGiven: number;
  responsesEarned: number; // # of their reviews with an owner response
  reviewsWithPhotos: number;
  flagsReceived: number; // ModerationFlag rows with targetType=REVIEW pointing at one of their reviews
  accountAgeDays: number;
}

function scoreFromSignals(s: TrustSignals): number {
  const raw =
    10 * s.reviewCount +
    6 * s.helpfulReceived +
    8 * s.responsesEarned +
    5 * s.reviewsWithPhotos +
    1 * s.helpfulGiven +
    0.5 * Math.sqrt(Math.max(0, s.accountAgeDays)) -
    25 * s.flagsReceived;
  return Math.max(0, Math.round(raw));
}

// ─── Recompute ─────────────────────────────────────────────────────────────
// Called from server actions after any signal-changing event. Cheap to run
// (a handful of indexed counts), and we write back to User.trustScore so
// review bylines stay denormalized.

export async function recomputeTrust(userId: string): Promise<number> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { createdAt: true },
  });
  if (!user) return 0;

  const reviews = await db.review.findMany({
    where: { userId, status: "PUBLISHED" },
    select: {
      id: true,
      helpfulCount: true,
      ownerResponse: true,
      _count: { select: { photos: true } },
    },
  });

  const reviewIds = reviews.map((r) => r.id);
  const [helpfulGiven, flagsReceived] = await Promise.all([
    db.reviewHelpful.count({ where: { userId } }),
    reviewIds.length
      ? db.moderationFlag.count({
          where: { targetType: "REVIEW", targetId: { in: reviewIds } },
        })
      : Promise.resolve(0),
  ]);

  const signals: TrustSignals = {
    reviewCount: reviews.length,
    helpfulReceived: reviews.reduce((acc, r) => acc + r.helpfulCount, 0),
    helpfulGiven,
    responsesEarned: reviews.filter((r) => r.ownerResponse).length,
    reviewsWithPhotos: reviews.filter((r) => r._count.photos > 0).length,
    flagsReceived,
    accountAgeDays: Math.max(
      0,
      Math.floor((Date.now() - user.createdAt.getTime()) / 86_400_000)
    ),
  };

  const score = scoreFromSignals(signals);
  await db.user.update({
    where: { id: userId },
    data: { trustScore: score },
  });
  return score;
}

// ─── Public-facing signals on the profile page ─────────────────────────────
// We don't show the raw score; we show the activity that earned it.

export interface PublicTrustSnapshot {
  tier: Tier;
  reviewCount: number;
  helpfulReceived: number;
  responsesEarned: number;
  reviewsWithPhotos: number;
  joinedMonthsAgo: number;
}

export async function publicTrustSnapshot(
  userId: string
): Promise<PublicTrustSnapshot | null> {
  const u = await db.user.findUnique({
    where: { id: userId },
    select: { trustScore: true, createdAt: true },
  });
  if (!u) return null;

  const reviews = await db.review.findMany({
    where: { userId, status: "PUBLISHED" },
    select: {
      helpfulCount: true,
      ownerResponse: true,
      _count: { select: { photos: true } },
    },
  });

  const joinedMonths = Math.max(
    0,
    Math.floor((Date.now() - u.createdAt.getTime()) / (86_400_000 * 30))
  );

  return {
    tier: tierForScore(u.trustScore),
    reviewCount: reviews.length,
    helpfulReceived: reviews.reduce((acc, r) => acc + r.helpfulCount, 0),
    responsesEarned: reviews.filter((r) => r.ownerResponse).length,
    reviewsWithPhotos: reviews.filter((r) => r._count.photos > 0).length,
    joinedMonthsAgo: joinedMonths,
  };
}

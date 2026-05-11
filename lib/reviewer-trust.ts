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

// ─── Specialty badges ──────────────────────────────────────────────────────
// Orthogonal to the tier. A user can earn multiple. Each badge has a
// criterion checked against the same review-history signals used for trust.
// Image paths are placeholders — drop a real illustration at the listed
// /public/badges path and it'll override the emoji automatically.

export interface Specialty {
  key: string;
  label: string;
  blurb: string;
  emoji: string;
  /** Optional path under /public. Renderer prefers image when present. */
  image?: string;
  pillClass: string;
}

export const SPECIALTIES: readonly Specialty[] = [
  {
    key: "coffee-expert",
    label: "Coffee Expert",
    blurb: "5+ reviews on coffee shops & cafés.",
    emoji: "☕",
    image: "/badges/coffee-expert.png",
    pillClass: "bg-amber-100 text-amber-900 border-amber-300",
  },
  {
    key: "hidden-gem-finder",
    label: "Hidden Gem Finder",
    blurb: "Three+ reviews on under-the-radar spots.",
    emoji: "💎",
    image: "/badges/hidden-gem-finder.png",
    pillClass: "bg-sage/15 text-sage-deep border-sage/40",
  },
  {
    key: "burger-hunter",
    label: "Burger Hunter",
    blurb: "5+ reviews chasing the perfect burger.",
    emoji: "🍔",
    image: "/badges/burger-hunter.png",
    pillClass: "bg-terracotta/15 text-terracotta-deep border-terracotta/40",
  },
  {
    key: "photographer",
    label: "Photographer",
    blurb: "5+ reviews with your own photos.",
    emoji: "📸",
    image: "/badges/photographer.png",
    pillClass: "bg-ink/10 text-ink border-ink/30",
  },
  {
    key: "helpful-voice",
    label: "Helpful Voice",
    blurb: "50+ neighbors found your reviews useful.",
    emoji: "🤝",
    image: "/badges/helpful-voice.png",
    pillClass: "bg-sage/20 text-sage-deep border-sage/50",
  },
  {
    key: "longtime-local",
    label: "Longtime Local",
    blurb: "Active reviewer for 6+ months.",
    emoji: "🏡",
    image: "/badges/longtime-local.png",
    pillClass: "bg-terracotta/10 text-terracotta-deep border-terracotta/40",
  },
];

// Returns the keys of all specialties the user has earned. Cheap to call —
// one join'd findMany over their reviews. Use on the profile page; skip on
// list pages.
export async function getSpecialties(userId: string): Promise<Specialty[]> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { createdAt: true },
  });
  if (!user) return [];

  const reviews = await db.review.findMany({
    where: { userId, status: "PUBLISHED" },
    select: {
      body: true,
      helpfulCount: true,
      _count: { select: { photos: true } },
      business: {
        select: {
          category: true,
          subcategory: true,
          _count: { select: { reviews: { where: { status: "PUBLISHED" } } } },
        },
      },
    },
  });

  const coffeeCount = reviews.filter((r) => {
    const sc = (r.business.subcategory ?? "").toLowerCase();
    return r.business.category === "FOOD_DRINK" && sc.includes("coffee");
  }).length;

  const burgerCount = reviews.filter((r) => {
    const sc = (r.business.subcategory ?? "").toLowerCase();
    return sc.includes("burger") || /\bburger\b/i.test(r.body);
  }).length;

  // "Under the radar" = the business has <10 real reviews so far.
  const hiddenGemCount = reviews.filter(
    (r) => r.business._count.reviews < 10
  ).length;

  const photoReviewCount = reviews.filter((r) => r._count.photos > 0).length;
  const helpfulReceived = reviews.reduce((acc, r) => acc + r.helpfulCount, 0);
  const accountAgeDays = Math.floor(
    (Date.now() - user.createdAt.getTime()) / 86_400_000
  );

  const earnedKeys = new Set<string>();
  if (coffeeCount >= 5) earnedKeys.add("coffee-expert");
  if (burgerCount >= 5) earnedKeys.add("burger-hunter");
  if (hiddenGemCount >= 3) earnedKeys.add("hidden-gem-finder");
  if (photoReviewCount >= 5) earnedKeys.add("photographer");
  if (helpfulReceived >= 50) earnedKeys.add("helpful-voice");
  if (accountAgeDays >= 180 && reviews.length >= 3) {
    earnedKeys.add("longtime-local");
  }

  return SPECIALTIES.filter((s) => earnedKeys.has(s.key));
}

// ─── Review weighting ──────────────────────────────────────────────────────
// Combines reviewer trust, helpful votes, and recency into one score used
// to sort reviews on /b/[slug]. Higher = surfaced higher.
//
// Shape (intuition):
//   trustFactor    ranges ~0.5–4.0 (a New Neighbor is ~1.0; Local Champion ~4)
//   helpfulFactor  1 + helpfulCount / 10  (10 votes ~doubles the weight)
//   recencyFactor  exp(-ageDays / 180)    (half-weight at ~125 days, ~1/10 at a year)
//
// Mock reviews with no trust score get a neutral 1.0 baseline so they fall
// after real-but-fresh reviews and before stale anonymous ones.

export interface WeightInputs {
  /** undefined for mock seed reviews; treated as a neutral baseline. */
  trustScore?: number | null;
  helpfulCount: number;
  ageDays: number;
}

export function reviewWeight(w: WeightInputs): number {
  const trustFactor =
    w.trustScore == null ? 1 : 0.5 + Math.sqrt(w.trustScore) / 5;
  const helpfulFactor = 1 + w.helpfulCount / 10;
  const recencyFactor = Math.exp(-Math.max(0, w.ageDays) / 180);
  return trustFactor * helpfulFactor * recencyFactor;
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

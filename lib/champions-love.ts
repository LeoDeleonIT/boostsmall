import "server-only";
import { db } from "@/lib/db";
import { TIERS } from "@/lib/reviewer-trust";
import { findBusinessBySlug, type SampleBusiness } from "@/lib/sample-businesses";

// Threshold = Neighborhood Guide and above (top three tiers).
const TRUSTED_THRESHOLD =
  TIERS.find((t) => t.key === "neighborhood-guide")?.threshold ?? 280;

const WINDOW_DAYS = 90;
const LIMIT = 6;

// Returns up to LIMIT businesses that high-tier reviewers have written
// about in the recent window. Sorted by # of trusted reviews descending
// (ties broken by most-recent activity). Cheap-ish — one indexed join.
export async function championsLoveBusinesses(): Promise<SampleBusiness[]> {
  const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000);

  const trustedReviews = await db.review.findMany({
    where: {
      status: "PUBLISHED",
      createdAt: { gte: since },
      user: { trustScore: { gte: TRUSTED_THRESHOLD } },
    },
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      business: { select: { slug: true } },
    },
    // Cap before we even bring it to the app layer; one trusted user can't
    // monopolize the list.
    take: 200,
  });

  // Group by slug, keep count + most recent timestamp.
  const buckets = new Map<string, { count: number; latest: number }>();
  for (const r of trustedReviews) {
    const slug = r.business.slug;
    const cur = buckets.get(slug) ?? { count: 0, latest: 0 };
    cur.count += 1;
    cur.latest = Math.max(cur.latest, r.createdAt.getTime());
    buckets.set(slug, cur);
  }

  const ranked = [...buckets.entries()]
    .sort((a, b) => b[1].count - a[1].count || b[1].latest - a[1].latest)
    .slice(0, LIMIT)
    .map(([slug]) => findBusinessBySlug(slug))
    .filter((b): b is SampleBusiness => !!b);

  return ranked;
}

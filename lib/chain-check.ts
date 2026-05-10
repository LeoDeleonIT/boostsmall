import "server-only";
import { db } from "@/lib/db";
import { normalizeName, levenshtein } from "@/lib/normalize";

export { normalizeName, levenshtein };

const MAX_LOCATIONS_ALLOWED = 5;
const FUZZY_THRESHOLD = 2; // Levenshtein distance ≤ 2 → route to moderation

export type ChainCheckResult =
  | { allowed: true; warnings: string[] }
  | { allowed: false; reason: "EXACT_BLOCKLIST" | "TOO_MANY_LOCATIONS" | "DOMAIN_MATCH"; matched?: string }
  | { allowed: "REVIEW"; reason: "FUZZY_MATCH"; matched: string; distance: number };

export async function checkBusinessAgainstChains(input: {
  name: string;
  websiteUrl?: string | null;
  locationCount: number;
}): Promise<ChainCheckResult> {
  if (input.locationCount > MAX_LOCATIONS_ALLOWED) {
    return { allowed: false, reason: "TOO_MANY_LOCATIONS" };
  }

  const normalized = normalizeName(input.name);

  // 1. Exact match
  const exact = await db.chainBlocklist.findUnique({
    where: { normalizedName: normalized },
  });
  if (exact) {
    return { allowed: false, reason: "EXACT_BLOCKLIST", matched: exact.name };
  }

  // 2. Domain match (cheap pre-filter using known chain domains)
  if (input.websiteUrl) {
    try {
      const host = new URL(input.websiteUrl).hostname.replace(/^www\./, "");
      const rootHost = host.split(".").slice(-2).join(".");
      const domainMatch = await db.chainBlocklist.findFirst({
        where: { normalizedName: { contains: rootHost.split(".")[0] } },
      });
      if (domainMatch) {
        return { allowed: false, reason: "DOMAIN_MATCH", matched: domainMatch.name };
      }
    } catch {
      // bad URL → ignore, fall through to fuzzy
    }
  }

  // 3. Fuzzy match — scan all blocklist entries (fine for ≤ ~1000 rows;
  //    swap to a trigram index in Postgres later if it grows).
  const all = await db.chainBlocklist.findMany({
    select: { name: true, normalizedName: true },
  });
  const warnings: string[] = [];
  for (const entry of all) {
    const distance = levenshtein(normalized, entry.normalizedName);
    if (distance > 0 && distance <= FUZZY_THRESHOLD) {
      return {
        allowed: "REVIEW",
        reason: "FUZZY_MATCH",
        matched: entry.name,
        distance,
      };
    }
  }

  return { allowed: true, warnings };
}

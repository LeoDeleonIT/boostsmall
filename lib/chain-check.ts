import "server-only";
import { db } from "@/lib/db";
import { normalizeName, levenshtein } from "@/lib/normalize";

export { normalizeName, levenshtein };

// We deliberately removed the "≤5 locations" auto-reject. The real filter
// is family-owned vs. publicly-traded chain — a 17-location regional
// family-owned dental group is welcome here; a 6-location franchise of a
// publicly-traded restaurant brand is not. Multi-location submissions
// still flow through moderation (REVIEW path), where the admin decides.
const FUZZY_THRESHOLD = 2;
const MULTI_LOCATION_REVIEW_THRESHOLD = 5; // > 5 → moderation review

export type ChainCheckResult =
  | { allowed: true; warnings: string[] }
  | { allowed: false; reason: "EXACT_BLOCKLIST" | "DOMAIN_MATCH"; matched?: string }
  | { allowed: "REVIEW"; reason: "FUZZY_MATCH" | "MULTI_LOCATION"; matched?: string; distance?: number };

export async function checkBusinessAgainstChains(input: {
  name: string;
  websiteUrl?: string | null;
  locationCount: number;
}): Promise<ChainCheckResult> {
  const warnings: string[] = [];
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

  // 4. Multi-location → moderation (NOT auto-reject). Family-owned
  //    multi-location businesses are welcome; the admin reviews to be sure.
  if (input.locationCount > MULTI_LOCATION_REVIEW_THRESHOLD) {
    return { allowed: "REVIEW", reason: "MULTI_LOCATION" };
  }

  return { allowed: true, warnings };
}

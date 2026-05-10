import "server-only";

// Simple in-memory token-bucket rate limiter.
// Per-process — fine for `next dev` and a single-instance deploy.
// Swap to Upstash Redis in lib/rate-limit-redis.ts before scaling out.

interface Bucket {
  tokens: number;
  updatedAt: number;
}

const buckets = new Map<string, Bucket>();

interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetMs: number;
}

interface RateLimitOptions {
  /** Bucket capacity (and the burst limit). */
  capacity: number;
  /** Tokens added per second. */
  refillPerSec: number;
}

export function rateLimit(
  key: string,
  opts: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);
  const capacity = opts.capacity;

  let tokens: number;
  if (!existing) {
    tokens = capacity;
  } else {
    const elapsedSec = (now - existing.updatedAt) / 1000;
    tokens = Math.min(capacity, existing.tokens + elapsedSec * opts.refillPerSec);
  }

  if (tokens < 1) {
    const resetMs = Math.ceil(((1 - tokens) / opts.refillPerSec) * 1000);
    buckets.set(key, { tokens, updatedAt: now });
    return { ok: false, remaining: 0, resetMs };
  }

  tokens -= 1;
  buckets.set(key, { tokens, updatedAt: now });
  return { ok: true, remaining: Math.floor(tokens), resetMs: 0 };
}

// Common presets.
export const limits = {
  // Public submission — strict. 5 per hour per IP.
  submission: { capacity: 5, refillPerSec: 5 / 3600 },
  // Reviews — 10 per hour per user.
  review: { capacity: 10, refillPerSec: 10 / 3600 },
  // Magic-link sign-in requests — 5 per 10 minutes per email.
  signIn: { capacity: 5, refillPerSec: 5 / 600 },
} as const;

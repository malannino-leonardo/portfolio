/**
 * Fixed-window rate limiter.
 *
 * - If UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, counters
 *   live in Upstash Redis (shared across every serverless instance).
 * - Otherwise it falls back to an in-memory Map. That still blocks bursts
 *   hitting a warm instance, but on Vercel each cold instance has its own
 *   memory, so set up Upstash for a hard guarantee.
 */

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the current window resets. */
  resetIn: number;
};

type Bucket = { count: number; resetAt: number };

const memoryStore = new Map<string, Bucket>();
const MAX_MEMORY_KEYS = 10_000;

function memoryHit(key: string, windowMs: number, now: number): Bucket {
  const existing = memoryStore.get(key);
  if (existing && existing.resetAt > now) {
    existing.count += 1;
    return existing;
  }

  // Opportunistic cleanup so the map can't grow without bound.
  if (memoryStore.size >= MAX_MEMORY_KEYS) {
    memoryStore.forEach((bucket, k) => {
      if (bucket.resetAt <= now) memoryStore.delete(k);
    });
    if (memoryStore.size >= MAX_MEMORY_KEYS) {
      const oldest = memoryStore.keys().next().value;
      if (oldest !== undefined) memoryStore.delete(oldest);
    }
  }

  const fresh = { count: 1, resetAt: now + windowMs };
  memoryStore.set(key, fresh);
  return fresh;
}

async function upstashHit(
  key: string,
  windowMs: number,
  now: number
): Promise<Bucket | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["PEXPIRE", key, String(windowMs), "NX"],
        ["PTTL", key],
      ]),
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: number }[];
    const count = Number(data?.[0]?.result);
    const ttl = Number(data?.[2]?.result);
    if (!Number.isFinite(count)) return null;
    return { count, resetAt: now + (ttl > 0 ? ttl : windowMs) };
  } catch {
    return null; // Redis unreachable: fall back to memory rather than fail open.
  }
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const bucket =
    (await upstashHit(`rl:${key}`, windowMs, now)) ??
    memoryHit(`rl:${key}`, windowMs, now);

  return {
    allowed: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    resetIn: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

/** Test helper. */
export function __resetMemoryStore() {
  memoryStore.clear();
}

/**
 * Best-effort client IP. On Vercel, x-forwarded-for is set by the edge and
 * its first entry is the real client; x-real-ip is the fallback.
 */
export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return (headers.get("x-real-ip") ?? "unknown").trim().slice(0, 64);
}

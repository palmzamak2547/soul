import { createHmac, randomBytes } from "node:crypto";

import type { NextRequest } from "next/server";

const MAX_BUCKETS = 10_000;
const buckets = new Map<string, RateLimitBucket>();

interface RateLimitBucket {
  count: number;
  readonly resetAt: number;
}

export interface RateLimitPolicy {
  readonly limit: number;
  readonly windowMs: number;
}

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly limit: number;
  readonly remaining: number;
  readonly retryAfterSeconds: number;
  readonly resetAt: number;
}

let localRateLimitSecret: string | undefined;

/**
 * Best-effort only: each Vercel function instance has an independent map.
 * The map stores an HMAC fingerprint, never the raw forwarded address.
 */
export function consumeRequestRateLimit(
  request: NextRequest,
  scope: string,
  policy: RateLimitPolicy,
  now = Date.now(),
): RateLimitResult {
  const key = `${scope}:${clientFingerprint(request)}`;
  let bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) pruneBuckets(now);
    bucket = { count: 0, resetAt: now + policy.windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  const allowed = bucket.count <= policy.limit;

  return {
    allowed,
    limit: policy.limit,
    remaining: Math.max(0, policy.limit - bucket.count),
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1_000)),
    resetAt: bucket.resetAt,
  };
}

export function rateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  const headers: Record<string, string> = {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(Math.ceil(result.resetAt / 1_000)),
  };
  if (!result.allowed) {
    headers["Retry-After"] = String(result.retryAfterSeconds);
  }
  return headers;
}

function clientFingerprint(request: NextRequest): string {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unavailable";
  const firstHop = forwarded.split(",", 1)[0]?.trim().slice(0, 128);
  const source = firstHop || "unavailable";

  return createHmac("sha256", getRateLimitSecret())
    .update(source, "utf8")
    .digest("base64url");
}

function getRateLimitSecret(): string {
  const configured =
    process.env.RATE_LIMIT_SECRET ?? process.env.ADMIN_SESSION_SECRET;
  if (configured) return configured;
  localRateLimitSecret ??= randomBytes(32).toString("base64url");
  return localRateLimitSecret;
}

function pruneBuckets(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }

  while (buckets.size >= MAX_BUCKETS) {
    const oldestKey = buckets.keys().next().value as string | undefined;
    if (!oldestKey) break;
    buckets.delete(oldestKey);
  }
}


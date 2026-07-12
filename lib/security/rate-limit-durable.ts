/**
 * Tipjai-style durable rate limit boundary.
 * Fail-degraded: if durable backend is unavailable, fall back to in-memory.
 * Wire a real store later via SOUL_RATE_LIMIT_RPC or shared Redis.
 */

import type { RateLimitPolicy, RateLimitResult } from "@/lib/security/rate-limit";
import { consumeRequestRateLimit } from "@/lib/security/rate-limit";
import type { NextRequest } from "next/server";

export async function consumeRequestRateLimitDurable(
  request: NextRequest,
  scope: string,
  policy: RateLimitPolicy,
): Promise<RateLimitResult & { readonly backend: "memory" | "durable" }> {
  // Placeholder for future shared store. Keeps call sites async-ready.
  const enabled = process.env.SOUL_RATE_LIMIT_DURABLE === "1";
  if (!enabled) {
    return { ...consumeRequestRateLimit(request, scope, policy), backend: "memory" };
  }

  try {
    // Future: call Supabase RPC / Upstash. For now still memory but marked durable opt-in path.
    return { ...consumeRequestRateLimit(request, scope, policy), backend: "durable" };
  } catch {
    return { ...consumeRequestRateLimit(request, scope, policy), backend: "memory" };
  }
}

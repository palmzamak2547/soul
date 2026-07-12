import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/http/api";
import { memberDemoProfile } from "@/lib/member/demo";
import {
  consumeRequestRateLimit,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Alias of profile for wallet hooks (`/api/member/me`). */
export async function GET(request: NextRequest) {
  const rateLimit = consumeRequestRateLimit(request, "member-me", {
    limit: 60,
    windowMs: 60_000,
  });
  const headers = rateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return apiError(429, "RATE_LIMITED", "มีคำขอมากเกินไป", headers);
  }
  return apiSuccess(memberDemoProfile, { headers });
}

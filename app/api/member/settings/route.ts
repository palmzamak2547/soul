import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/http/api";
import { memberDemoSettings } from "@/lib/member/demo";
import {
  consumeRequestRateLimit,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const rateLimit = consumeRequestRateLimit(request, "member-settings", {
    limit: 60,
    windowMs: 60_000,
  });
  const headers = rateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return apiError(429, "RATE_LIMITED", "มีคำขอมากเกินไป", headers);
  }
  return apiSuccess(memberDemoSettings, { headers });
}

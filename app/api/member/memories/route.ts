import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/http/api";
import { memberDemoMemories } from "@/lib/member/demo";
import {
  consumeRequestRateLimit,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const rateLimit = consumeRequestRateLimit(request, "member-memories-list", {
    limit: 60,
    windowMs: 60_000,
  });
  const headers = rateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return apiError(429, "RATE_LIMITED", "มีคำขอมากเกินไป", headers);
  }

  const limitRaw = request.nextUrl.searchParams.get("limit");
  const limit = Math.min(
    50,
    Math.max(1, Number.parseInt(limitRaw ?? "20", 10) || 20),
  );
  return apiSuccess(memberDemoMemories.slice(0, limit), { headers });
}

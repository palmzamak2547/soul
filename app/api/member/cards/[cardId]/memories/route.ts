import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/http/api";
import { memberDemoMemories } from "@/lib/member/demo";
import {
  consumeRequestRateLimit,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Ctx {
  readonly params: Promise<{ cardId: string }>;
}

export async function GET(request: NextRequest, context: Ctx) {
  const rateLimit = consumeRequestRateLimit(request, "member-memories", {
    limit: 90,
    windowMs: 60_000,
  });
  const headers = rateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return apiError(429, "RATE_LIMITED", "มีคำขอมากเกินไป", headers);
  }

  const { cardId } = await context.params;
  const memories = memberDemoMemories.filter((item) => item.cardId === cardId);
  return apiSuccess(memories, { headers });
}

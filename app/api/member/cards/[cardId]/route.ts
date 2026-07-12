import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/http/api";
import { memberDemoCards } from "@/lib/member/demo";
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
  const rateLimit = consumeRequestRateLimit(request, "member-card", {
    limit: 90,
    windowMs: 60_000,
  });
  const headers = rateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return apiError(429, "RATE_LIMITED", "มีคำขอมากเกินไป", headers);
  }

  const { cardId } = await context.params;
  const card = memberDemoCards.find((item) => item.id === cardId);
  if (!card) {
    return apiError(404, "MEMBER_CARD_NOT_FOUND", "ไม่พบการ์ดในคลัง demo", headers);
  }
  return apiSuccess(card, { headers });
}

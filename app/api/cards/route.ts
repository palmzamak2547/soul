import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/http/api";
import {
  consumeRequestRateLimit,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";
import { getSoulRepository } from "@/lib/soul/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public catalog of demo collectible cards.
 * Tokens are intentionally static demo values for the prototype tap flow.
 */
export async function GET(request: NextRequest) {
  const rateLimit = consumeRequestRateLimit(request, "public-catalog", {
    limit: 60,
    windowMs: 60_000,
  });
  const limitHeaders = rateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return apiError(
      429,
      "RATE_LIMITED",
      "มีคำขอมากเกินไป โปรดลองใหม่ภายหลัง",
      limitHeaders,
    );
  }

  const repository = getSoulRepository();
  const cards = await repository.listPublicCatalog();

  return apiSuccess(
    {
      count: cards.length,
      cards,
      boundary: {
        ownership: false,
        cryptographicAuthenticity: false,
        note: "แคตตาล็อกต้นแบบสำหรับ demo เท่านั้น ไม่ใช่รายการ ownership จริง",
      },
    },
    { headers: limitHeaders },
  );
}

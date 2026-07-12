import type { NextRequest } from "next/server";
import { z } from "zod";

import { apiError, apiSuccess } from "@/lib/http/api";
import {
  consumeRequestRateLimit,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";
import { resolveDemoCardToken } from "@/lib/soul/nfc";

export const runtime = "nodejs";

const CardTokenSchema = z
  .string()
  .trim()
  .min(8)
  .max(96)
  .regex(/^[A-Za-z0-9_-]+$/);

interface CardRouteContext {
  readonly params: Promise<{ token: string }>;
}

export async function GET(
  request: NextRequest,
  context: CardRouteContext,
) {
  const rateLimit = consumeRequestRateLimit(request, "public-card", {
    limit: 120,
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

  const { token: rawToken } = await context.params;
  const parsedToken = CardTokenSchema.safeParse(rawToken);
  if (!parsedToken.success) {
    return apiError(
      400,
      "INVALID_CARD_TOKEN",
      "รูปแบบ card token ไม่ถูกต้อง",
      limitHeaders,
    );
  }

  const resolution = await resolveDemoCardToken(parsedToken.data);
  if (resolution.status === "not_found") {
    return apiError(
      404,
      "CARD_NOT_FOUND",
      "ไม่พบการ์ดต้นแบบสำหรับ token นี้",
      limitHeaders,
    );
  }

  return apiSuccess(resolution, { headers: limitHeaders });
}


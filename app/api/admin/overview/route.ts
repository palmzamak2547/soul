import type { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/lib/http/api";
import {
  consumeRequestRateLimit,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";
import { authorizeAdminRequest } from "@/lib/security/admin-access";
import { getSoulRepository } from "@/lib/soul/repository";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const rateLimit = consumeRequestRateLimit(request, "admin-overview", {
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

  const access = await authorizeAdminRequest(request);
  if (!access.authorized) {
    return apiError(
      401,
      "ADMIN_SESSION_REQUIRED",
      "ต้องเข้าสู่ระบบผู้ดูแลก่อน",
      limitHeaders,
    );
  }

  const overview = await getSoulRepository().getAdminOverview();
  return apiSuccess(overview, { headers: limitHeaders });
}

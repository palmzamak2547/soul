import type { NextRequest } from "next/server";
import { z } from "zod";

import {
  apiError,
  apiSuccess,
  isSameOriginMutation,
  readJsonBody,
} from "@/lib/http/api";
import {
  consumeRequestRateLimit,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";
import {
  AdminAuthConfigurationError,
  clearAdminSessionCookie,
  createAdminSession,
  setAdminSessionCookie,
  verifyAdminPassword,
} from "@/lib/security/session";

export const runtime = "nodejs";

const LoginBodySchema = z
  .object({
    password: z.string().min(1).max(256),
  })
  .strict();

export async function POST(request: NextRequest) {
  const rateLimit = consumeRequestRateLimit(request, "admin-login", {
    limit: 5,
    windowMs: 10 * 60_000,
  });
  const limitHeaders = rateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return apiError(
      429,
      "RATE_LIMITED",
      "ทดลองเข้าสู่ระบบหลายครั้งเกินไป โปรดลองใหม่ภายหลัง",
      limitHeaders,
    );
  }

  if (!isSameOriginMutation(request)) {
    return apiError(
      403,
      "ORIGIN_NOT_ALLOWED",
      "ไม่อนุญาตคำขอข้ามเว็บไซต์",
      limitHeaders,
    );
  }

  const bodyResult = await readJsonBody(request, 1_024);
  if (!bodyResult.ok) {
    return apiError(
      bodyResult.status,
      bodyResult.code,
      bodyResult.message,
      limitHeaders,
    );
  }

  const body = LoginBodySchema.safeParse(bodyResult.value);
  if (!body.success) {
    return apiError(
      400,
      "INVALID_LOGIN_REQUEST",
      "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง",
      limitHeaders,
    );
  }

  try {
    if (!verifyAdminPassword(body.data.password)) {
      return apiError(
        401,
        "INVALID_CREDENTIALS",
        "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง",
        limitHeaders,
      );
    }

    const session = createAdminSession();
    const response = apiSuccess(
      { authenticated: true as const, expiresAt: session.expiresAt },
      { headers: limitHeaders },
    );
    setAdminSessionCookie(response, session);
    return response;
  } catch (error) {
    if (error instanceof AdminAuthConfigurationError) {
      return apiError(
        503,
        "ADMIN_AUTH_NOT_CONFIGURED",
        "ระบบผู้ดูแลยังไม่ได้ตั้งค่าสำหรับ production",
        limitHeaders,
      );
    }
    throw error;
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSameOriginMutation(request)) {
    return apiError(
      403,
      "ORIGIN_NOT_ALLOWED",
      "ไม่อนุญาตคำขอข้ามเว็บไซต์",
    );
  }

  const response = apiSuccess({ authenticated: false as const });
  clearAdminSessionCookie(response);
  return response;
}


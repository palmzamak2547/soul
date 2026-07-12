import type { NextRequest } from "next/server";

import { SignInSchema } from "@/lib/auth/schemas";
import { apiError, apiSuccess, isSameOriginMutation, readJsonBody } from "@/lib/http/api";
import { logError, logInfo } from "@/lib/observability/logger";
import { consumeRequestRateLimit, rateLimitHeaders } from "@/lib/security/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const requestId = request.headers.get("x-vercel-id");
  const limit = consumeRequestRateLimit(request, "member-sign-in", {
    limit: 8,
    windowMs: 10 * 60_000,
  });
  const headers = rateLimitHeaders(limit);
  if (!limit.allowed) {
    return apiError(429, "RATE_LIMITED", "ลองเข้าสู่ระบบใหม่ภายหลัง", headers);
  }
  if (!isSameOriginMutation(request)) {
    return apiError(403, "ORIGIN_NOT_ALLOWED", "ไม่อนุญาตคำขอข้ามเว็บไซต์", headers);
  }

  const body = await readJsonBody(request, 2_048);
  if (!body.ok) return apiError(body.status, body.code, body.message, headers);
  const input = SignInSchema.safeParse(body.value);
  if (!input.success) {
    return apiError(400, "INVALID_CREDENTIALS", "อีเมลหรือรหัสผ่านไม่ถูกต้อง", headers);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return apiError(503, "AUTH_NOT_CONFIGURED", "ระบบสมาชิกกำลังเตรียมเปิดใช้งาน", headers);
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword(input.data);
    if (error || !data.user) {
      logInfo("Member sign-in denied", { route: "/api/auth/sign-in", requestId });
      return apiError(401, "INVALID_CREDENTIALS", "อีเมลหรือรหัสผ่านไม่ถูกต้อง", headers);
    }
    logInfo("Member sign-in completed", {
      route: "/api/auth/sign-in",
      requestId,
      durationMs: Date.now() - startedAt,
      userId: data.user.id,
    });
    return apiSuccess({ authenticated: true, userId: data.user.id }, { headers });
  } catch (error) {
    logError("Member sign-in failed", error, {
      route: "/api/auth/sign-in",
      requestId,
      durationMs: Date.now() - startedAt,
    });
    return apiError(500, "SIGN_IN_FAILED", "ไม่สามารถเข้าสู่ระบบได้ในขณะนี้", headers);
  }
}

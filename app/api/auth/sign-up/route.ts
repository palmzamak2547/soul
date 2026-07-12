import type { NextRequest } from "next/server";

import { SignUpSchema } from "@/lib/auth/schemas";
import { apiError, apiSuccess, isSameOriginMutation, readJsonBody } from "@/lib/http/api";
import { consumeRequestRateLimit, rateLimitHeaders } from "@/lib/security/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const limit = consumeRequestRateLimit(request, "member-sign-up", {
    limit: 5,
    windowMs: 60 * 60_000,
  });
  const headers = rateLimitHeaders(limit);
  if (!limit.allowed) return apiError(429, "RATE_LIMITED", "ลองสมัครใหม่ภายหลัง", headers);
  if (!isSameOriginMutation(request)) {
    return apiError(403, "ORIGIN_NOT_ALLOWED", "ไม่อนุญาตคำขอข้ามเว็บไซต์", headers);
  }

  const body = await readJsonBody(request, 4_096);
  if (!body.ok) return apiError(body.status, body.code, body.message, headers);
  const input = SignUpSchema.safeParse(body.value);
  if (!input.success) {
    return apiError(400, "INVALID_SIGN_UP", "ข้อมูลสมัครสมาชิกไม่ครบหรือรหัสผ่านไม่ปลอดภัย", headers);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return apiError(503, "AUTH_NOT_CONFIGURED", "ระบบสมาชิกกำลังเตรียมเปิดใช้งาน", headers);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const { data, error } = await supabase.auth.signUp({
    email: input.data.email,
    password: input.data.password,
    options: {
      data: { display_name: input.data.displayName },
      emailRedirectTo: siteUrl ? `${siteUrl}/auth/callback?next=/wallet` : undefined,
    },
  });

  if (error) {
    return apiError(400, "SIGN_UP_UNAVAILABLE", "ไม่สามารถสมัครสมาชิกได้ กรุณาตรวจอีเมลแล้วลองอีกครั้ง", headers);
  }

  return apiSuccess(
    { created: true, confirmationRequired: data.session === null },
    { status: 201, headers },
  );
}

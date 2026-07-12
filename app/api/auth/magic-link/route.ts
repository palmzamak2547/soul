import type { NextRequest } from "next/server";

import { MagicLinkSchema } from "@/lib/auth/schemas";
import { apiError, apiSuccess, isSameOriginMutation, readJsonBody } from "@/lib/http/api";
import { consumeRequestRateLimit, rateLimitHeaders } from "@/lib/security/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const limit = consumeRequestRateLimit(request, "member-magic-link", {
    limit: 3,
    windowMs: 60 * 60_000,
  });
  const headers = rateLimitHeaders(limit);
  if (!limit.allowed) return apiError(429, "RATE_LIMITED", "ลองขอลิงก์ใหม่ภายหลัง", headers);
  if (!isSameOriginMutation(request)) {
    return apiError(403, "ORIGIN_NOT_ALLOWED", "ไม่อนุญาตคำขอข้ามเว็บไซต์", headers);
  }
  const body = await readJsonBody(request, 1_024);
  if (!body.ok) return apiError(body.status, body.code, body.message, headers);
  const input = MagicLinkSchema.safeParse(body.value);
  if (!input.success) return apiError(400, "INVALID_EMAIL", "อีเมลไม่ถูกต้อง", headers);

  const supabase = await createServerSupabaseClient();
  if (!supabase) return apiError(503, "AUTH_NOT_CONFIGURED", "ระบบสมาชิกกำลังเตรียมเปิดใช้งาน", headers);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  await supabase.auth.signInWithOtp({
    email: input.data.email,
    options: {
      emailRedirectTo: siteUrl ? `${siteUrl}/auth/callback?next=/wallet` : undefined,
      shouldCreateUser: true,
    },
  });

  return apiSuccess({ sent: true }, { headers });
}

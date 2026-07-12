import type { NextRequest } from "next/server";
import { z } from "zod";

import {
  apiError,
  apiSuccess,
  isSameOriginMutation,
  readJsonBody,
} from "@/lib/http/api";
import { authorizeAdminRequest } from "@/lib/security/admin-access";
import {
  consumeRequestRateLimit,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";
import {
  generateOpaqueId,
  signOpaqueNfcId,
} from "@/lib/soul/nfc-sign";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z
  .object({
    opaqueId: z
      .string()
      .trim()
      .min(8)
      .max(96)
      .regex(/^[A-Za-z0-9_-]+$/)
      .optional(),
    label: z.string().trim().max(120).optional(),
  })
  .strict();

/**
 * Admin-only NFC URL signer.
 * Requires NFC_SIGNING_SECRET (>=32 chars) in production-ready mode.
 * Without the secret, returns a demo-mode envelope so UI can still preview flow.
 */
export async function POST(request: NextRequest) {
  const rateLimit = consumeRequestRateLimit(request, "admin-nfc-sign", {
    limit: 30,
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

  if (!isSameOriginMutation(request)) {
    return apiError(
      403,
      "ORIGIN_NOT_ALLOWED",
      "ไม่อนุญาตคำขอข้ามเว็บไซต์",
      limitHeaders,
    );
  }

  const access = await authorizeAdminRequest(request);
  if (!access.authorized) {
    return apiError(
      401,
      "ADMIN_UNAUTHORIZED",
      "ต้องเข้าสู่ระบบผู้ดูแลก่อน",
      limitHeaders,
    );
  }

  const bodyResult = await readJsonBody(request, 2_048);
  if (!bodyResult.ok) {
    return apiError(
      bodyResult.status,
      bodyResult.code,
      bodyResult.message,
      limitHeaders,
    );
  }

  const parsed = BodySchema.safeParse(bodyResult.value ?? {});
  if (!parsed.success) {
    return apiError(
      400,
      "INVALID_NFC_SIGN_REQUEST",
      "ข้อมูลสำหรับลงนาม NFC ไม่ถูกต้อง",
      limitHeaders,
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://soulplatform.vercel.app";
  const secret = process.env.NFC_SIGNING_SECRET;
  const opaqueId = parsed.data.opaqueId ?? generateOpaqueId(16);

  if (!secret || secret.length < 32) {
    return apiSuccess(
      {
        mode: "demo_preview" as const,
        signed: false,
        label: parsed.data.label ?? null,
        note: "ตั้ง NFC_SIGNING_SECRET (>=32) เพื่อเปิด signed production URLs",
        previewPath: `/tap/${opaqueId}`,
        previewUrl: `${siteUrl.replace(/\/$/, "")}/tap/${opaqueId}`,
        opaqueId,
        accessMode: access.mode,
      },
      { headers: limitHeaders },
    );
  }

  const signed = signOpaqueNfcId({
    opaqueId,
    secret,
    siteUrl,
  });

  return apiSuccess(
    {
      mode: "signed" as const,
      signed: true,
      label: parsed.data.label ?? null,
      ...signed,
      accessMode: access.mode,
      boundary: {
        ownershipGranted: false,
        note: "ลายเซ็นป้องกันการปลอม URL แต่ไม่ป้องกันการ clone static tag",
      },
    },
    { status: 201, headers: limitHeaders },
  );
}

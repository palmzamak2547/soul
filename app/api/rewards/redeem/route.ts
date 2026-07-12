import type { NextRequest } from "next/server";
import { z } from "zod";

import {
  apiError,
  apiSuccess,
  isSameOriginMutation,
  readJsonBody,
} from "@/lib/http/api";
import { rateLimitHeaders } from "@/lib/security/rate-limit";
import { consumeRequestRateLimitDurable } from "@/lib/security/rate-limit-durable";
import { getSoulRepository } from "@/lib/soul/repository";

export const runtime = "nodejs";

const IdempotencyKeySchema = z
  .string()
  .trim()
  .min(8)
  .max(128)
  .regex(/^[A-Za-z0-9][A-Za-z0-9._:-]+$/);

const RedeemBodySchema = z
  .object({
    cardToken: z
      .string()
      .trim()
      .min(8)
      .max(96)
      .regex(/^[A-Za-z0-9_-]+$/),
    rewardId: z
      .string()
      .trim()
      .min(4)
      .max(96)
      .regex(/^[a-z0-9-]+$/),
    idempotencyKey: IdempotencyKeySchema.optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  const rateLimit = await consumeRequestRateLimitDurable(
    request,
    "prototype-redeem",
    {
      limit: 20,
      windowMs: 60_000,
    },
  );
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

  const bodyResult = await readJsonBody(request);
  if (!bodyResult.ok) {
    return apiError(
      bodyResult.status,
      bodyResult.code,
      bodyResult.message,
      limitHeaders,
    );
  }

  const body = RedeemBodySchema.safeParse(bodyResult.value);
  if (!body.success) {
    return apiError(
      400,
      "INVALID_REDEMPTION_REQUEST",
      "ข้อมูลสำหรับทดลองรับรางวัลไม่ถูกต้อง",
      limitHeaders,
    );
  }

  const headerKeyValue = request.headers.get("idempotency-key");
  const headerKey = headerKeyValue
    ? IdempotencyKeySchema.safeParse(headerKeyValue)
    : null;
  if (headerKey && !headerKey.success) {
    return apiError(
      400,
      "INVALID_IDEMPOTENCY_KEY",
      "รูปแบบ Idempotency-Key ไม่ถูกต้อง",
      limitHeaders,
    );
  }

  const idempotencyKey =
    headerKey?.success === true ? headerKey.data : body.data.idempotencyKey;
  if (!idempotencyKey) {
    return apiError(
      400,
      "IDEMPOTENCY_KEY_REQUIRED",
      "ต้องระบุ Idempotency-Key header หรือ idempotencyKey ใน JSON body",
      limitHeaders,
    );
  }
  if (
    body.data.idempotencyKey &&
    headerKey?.success === true &&
    body.data.idempotencyKey !== headerKey.data
  ) {
    return apiError(
      400,
      "IDEMPOTENCY_KEY_MISMATCH",
      "Idempotency-Key header และ JSON body ต้องตรงกัน",
      limitHeaders,
    );
  }

  const repositoryResult = await getSoulRepository().redeemPrototype({
    cardToken: body.data.cardToken,
    rewardId: body.data.rewardId,
    idempotencyKey,
  });

  switch (repositoryResult.kind) {
    case "created":
    case "replayed":
      return apiSuccess(
        {
          redemption: repositoryResult.redemption,
          idempotency: {
            replayed: repositoryResult.kind === "replayed",
            durability: "best_effort_in_memory" as const,
          },
        },
        {
          status: repositoryResult.kind === "created" ? 201 : 200,
          headers: limitHeaders,
        },
      );
    case "idempotency_conflict":
      return apiError(
        409,
        "IDEMPOTENCY_CONFLICT",
        "Idempotency key นี้ถูกใช้กับคำขออื่นแล้ว",
        limitHeaders,
      );
    case "card_not_found":
      return apiError(
        404,
        "CARD_NOT_FOUND",
        "ไม่พบการ์ดต้นแบบ",
        limitHeaders,
      );
    case "reward_not_found":
      return apiError(
        404,
        "REWARD_NOT_FOUND",
        "ไม่พบรางวัลต้นแบบ",
        limitHeaders,
      );
    case "reward_not_eligible":
      return apiError(
        409,
        "REWARD_NOT_ELIGIBLE",
        "รางวัลต้นแบบนี้ไม่อยู่ในรายการของการ์ด",
        limitHeaders,
      );
  }
}


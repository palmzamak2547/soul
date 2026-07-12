import type { NextRequest } from "next/server";

import { apiError, apiSuccess, isSameOriginMutation, readJsonBody } from "@/lib/http/api";
import {
  cloneDemo,
  demoAudit,
  demoAuthenticity,
  demoCardBatches,
  demoModeration,
  demoNotifications,
  demoOrganization,
  demoRewards,
  demoUsers,
} from "@/lib/operations/demo";
import { authorizeAdminRequest } from "@/lib/security/admin-access";
import { consumeRequestRateLimit, rateLimitHeaders } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  readonly params: Promise<{ readonly segments: string[] }>;
}

const state = {
  users: demoUsers.map((item) => ({ ...item })) as Array<Record<string, unknown>>,
  batches: demoCardBatches.map((item) => ({ ...item })) as Array<Record<string, unknown>>,
  authenticity: demoAuthenticity.map((item) => ({ ...item })) as Array<Record<string, unknown>>,
  moderation: demoModeration.map((item) => ({ ...item })) as Array<Record<string, unknown>>,
  rewards: cloneDemo(demoRewards),
  organization: cloneDemo(demoOrganization),
  notifications: cloneDemo(demoNotifications),
};

export async function GET(request: NextRequest, context: RouteContext) {
  const gate = await guard(request, false);
  if (gate.response) return gate.response;
  const { segments } = await context.params;
  const resource = segments[0];

  switch (resource) {
    case "users":
      return apiSuccess(state.users, { headers: gate.headers });
    case "card-batches":
      return apiSuccess(state.batches, { headers: gate.headers });
    case "authenticity":
      return apiSuccess(state.authenticity, { headers: gate.headers });
    case "moderation":
      return apiSuccess(state.moderation, { headers: gate.headers });
    case "rewards":
      return apiSuccess(state.rewards, { headers: gate.headers });
    case "audit":
      return apiSuccess(cloneDemo(demoAudit), { headers: gate.headers });
    case "organization":
      return apiSuccess(state.organization, { headers: gate.headers });
    case "notifications":
      return apiSuccess(state.notifications, { headers: gate.headers });
    default:
      return apiError(404, "ADMIN_RESOURCE_NOT_FOUND", "ไม่พบข้อมูลส่วนผู้ดูแล", gate.headers);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const gate = await guard(request, true);
  if (gate.response) return gate.response;
  const { segments } = await context.params;
  const body = await readBody(request, gate.headers);
  if (!body.ok) return body.response;

  if (segments[0] === "card-batches" && segments.length === 1) {
    const record = asRecord(body.value);
    const created = {
      ...record,
      id: typeof record.id === "string" ? record.id : `batch_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    state.batches.unshift(created);
    return apiSuccess(created, { status: 201, headers: gate.headers });
  }

  if (segments[0] === "card-batches" && segments[2] === "export") {
    return apiSuccess(
      { exported: true, batchId: segments[1], format: "csv", generatedAt: new Date().toISOString() },
      { status: 201, headers: gate.headers },
    );
  }

  if (segments[0] === "authenticity" && segments[2] === "resolve") {
    updateById(state.authenticity, segments[1], { status: "Resolved", resolution: asRecord(body.value).resolution });
    return apiSuccess({ resolved: true, id: segments[1] }, { headers: gate.headers });
  }

  if (segments[0] === "moderation" && segments[2] === "decision") {
    const decision = asRecord(body.value).decision;
    const status = decision === "approve" ? "Approved" : decision === "reject" ? "Rejected" : "Escalated";
    updateById(state.moderation, segments[1], { status });
    return apiSuccess({ decided: true, id: segments[1], status }, { headers: gate.headers });
  }

  if (segments[0] === "redemptions" && segments[2] === "fulfill") {
    const nextStatus = asRecord(body.value).status;
    const redemptions = state.rewards.redemptions as Array<Record<string, unknown>>;
    updateById(redemptions, segments[1], { status: nextStatus });
    return apiSuccess({ fulfilled: true, id: segments[1], status: nextStatus }, { headers: gate.headers });
  }

  if (segments[0] === "notifications" && segments[2] === "read") {
    const items = state.notifications.items as Array<Record<string, unknown>>;
    updateById(items, segments[1], { read: Boolean(asRecord(body.value).read) });
    return apiSuccess({ updated: true, id: segments[1] }, { headers: gate.headers });
  }

  return apiError(404, "ADMIN_ACTION_NOT_FOUND", "ไม่พบคำสั่งส่วนผู้ดูแล", gate.headers);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const gate = await guard(request, true);
  if (gate.response) return gate.response;
  const { segments } = await context.params;
  const body = await readBody(request, gate.headers);
  if (!body.ok) return body.response;
  const values = asRecord(body.value);

  if (segments[0] === "users" && (segments[2] === "role" || segments[2] === "status")) {
    updateById(state.users, segments[1], values);
    return apiSuccess({ updated: true, id: segments[1], ...values }, { headers: gate.headers });
  }
  if (segments[0] === "rewards" && segments[1]) {
    const rewards = state.rewards.rewards as Array<Record<string, unknown>>;
    updateById(rewards, segments[1], values);
    return apiSuccess({ updated: true, id: segments[1], ...values }, { headers: gate.headers });
  }
  if (segments[0] === "organization") {
    Object.assign(state.organization, values, { updatedAt: new Date().toISOString() });
    return apiSuccess(state.organization, { headers: gate.headers });
  }
  if (segments[0] === "notifications" && segments[1] === "preferences") {
    Object.assign(state.notifications.preferences, values);
    return apiSuccess(state.notifications.preferences, { headers: gate.headers });
  }

  return apiError(404, "ADMIN_ACTION_NOT_FOUND", "ไม่พบคำสั่งส่วนผู้ดูแล", gate.headers);
}

async function guard(request: NextRequest, mutation: boolean) {
  const limit = consumeRequestRateLimit(request, "admin-operations", {
    limit: mutation ? 60 : 240,
    windowMs: 60_000,
  });
  const headers = rateLimitHeaders(limit);
  if (!limit.allowed) {
    return { headers, response: apiError(429, "RATE_LIMITED", "มีคำขอมากเกินไป", headers) };
  }
  if (mutation && !isSameOriginMutation(request)) {
    return { headers, response: apiError(403, "ORIGIN_NOT_ALLOWED", "ไม่อนุญาตคำขอข้ามเว็บไซต์", headers) };
  }
  const access = await authorizeAdminRequest(request);
  if (!access.authorized) {
    return { headers, response: apiError(401, "ADMIN_SESSION_REQUIRED", "ต้องเข้าสู่ระบบผู้ดูแลก่อน", headers) };
  }
  return { headers, response: null };
}

async function readBody(request: NextRequest, headers: HeadersInit) {
  const body = await readJsonBody(request, 16_384);
  if (!body.ok) {
    return { ok: false as const, response: apiError(body.status, body.code, body.message, headers) };
  }
  return { ok: true as const, value: body.value };
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function updateById(items: Array<Record<string, unknown>>, id: string | undefined, values: Record<string, unknown>) {
  const item = items.find((candidate) => candidate.id === id);
  if (item) Object.assign(item, values);
}

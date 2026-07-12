import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_SECURITY_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

export interface ApiErrorBody {
  readonly ok: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
}

export type JsonBodyResult =
  | { readonly ok: true; readonly value: unknown }
  | {
      readonly ok: false;
      readonly status: 400 | 413 | 415;
      readonly code: "INVALID_JSON" | "PAYLOAD_TOO_LARGE" | "UNSUPPORTED_MEDIA_TYPE";
      readonly message: string;
    };

export function apiSuccess<T>(
  data: T,
  options: {
    readonly status?: number;
    readonly headers?: HeadersInit;
  } = {},
): NextResponse<{ ok: true; data: T }> {
  return NextResponse.json(
    { ok: true as const, data },
    {
      status: options.status ?? 200,
      headers: mergedApiHeaders(options.headers),
    },
  );
}

export function apiError(
  status: number,
  code: string,
  message: string,
  headers?: HeadersInit,
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { ok: false as const, error: { code, message } },
    { status, headers: mergedApiHeaders(headers) },
  );
}

export async function readJsonBody(
  request: Request,
  maxBytes = 4_096,
): Promise<JsonBodyResult> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    return {
      ok: false,
      status: 415,
      code: "UNSUPPORTED_MEDIA_TYPE",
      message: "Content-Type ต้องเป็น application/json",
    };
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return {
      ok: false,
      status: 413,
      code: "PAYLOAD_TOO_LARGE",
      message: "Request body มีขนาดใหญ่เกินกำหนด",
    };
  }

  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      receivedBytes += value.byteLength;
      if (receivedBytes > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return {
          ok: false,
          status: 413,
          code: "PAYLOAD_TOO_LARGE",
          message: "Request body มีขนาดใหญ่เกินกำหนด",
        };
      }
      chunks.push(value);
    }
  }

  const bytes = new Uint8Array(receivedBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let rawBody: string;
  try {
    rawBody = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return {
      ok: false,
      status: 400,
      code: "INVALID_JSON",
      message: "Request body ไม่ใช่ JSON ที่ถูกต้อง",
    };
  }

  try {
    return { ok: true, value: JSON.parse(rawBody) as unknown };
  } catch {
    return {
      ok: false,
      status: 400,
      code: "INVALID_JSON",
      message: "Request body ไม่ใช่ JSON ที่ถูกต้อง",
    };
  }
}

export function isSameOriginMutation(request: NextRequest): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;

  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const requestHost =
      request.headers.get("host") ??
      request.headers.get("x-forwarded-host")?.split(",", 1)[0]?.trim();
    if (!requestHost || originUrl.host !== requestHost) return false;
    if (
      process.env.NODE_ENV === "production" &&
      originUrl.protocol !== "https:"
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function mergedApiHeaders(overrides?: HeadersInit): Headers {
  const headers = new Headers(API_SECURITY_HEADERS);
  if (overrides) {
    new Headers(overrides).forEach((value, key) => headers.set(key, value));
  }
  return headers;
}

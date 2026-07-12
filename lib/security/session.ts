import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import type { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const ADMIN_SESSION_COOKIE = "soul_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;
export const DEVELOPMENT_ADMIN_PASSWORD = "SOUL2026";

const DEVELOPMENT_SESSION_SECRET =
  "soul-local-session-secret-development-only-2026";

const SessionPayloadSchema = z
  .object({
    v: z.literal(1),
    iat: z.number().int().nonnegative(),
    exp: z.number().int().positive(),
    nonce: z.string().regex(/^[A-Za-z0-9_-]{16}$/),
  })
  .strict();

type SessionPayload = z.infer<typeof SessionPayloadSchema>;

interface AdminAuthConfig {
  readonly password: string;
  readonly sessionSecret: string;
}

export interface CreatedAdminSession {
  readonly token: string;
  readonly expiresAt: string;
}

export class AdminAuthConfigurationError extends Error {
  constructor() {
    super("Admin authentication is not configured for this environment.");
    this.name = "AdminAuthConfigurationError";
  }
}

export function verifyAdminPassword(candidate: string): boolean {
  const config = getAdminAuthConfig();
  const candidateDigest = hmac(candidate, config.sessionSecret);
  const expectedDigest = hmac(config.password, config.sessionSecret);
  return timingSafeEqual(candidateDigest, expectedDigest);
}

export function createAdminSession(now = Date.now()): CreatedAdminSession {
  const config = getAdminAuthConfig();
  const issuedAt = Math.floor(now / 1_000);
  const payload: SessionPayload = {
    v: 1,
    iat: issuedAt,
    exp: issuedAt + ADMIN_SESSION_TTL_SECONDS,
    nonce: randomBytes(12).toString("base64url"),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  const signature = hmac(encodedPayload, config.sessionSecret).toString(
    "base64url",
  );

  return {
    token: `${encodedPayload}.${signature}`,
    expiresAt: new Date(payload.exp * 1_000).toISOString(),
  };
}

export function verifyAdminSessionToken(
  token: string | undefined,
  now = Date.now(),
): boolean {
  if (!token || token.length > 1_024) return false;

  const [encodedPayload, suppliedSignature, extra] = token.split(".");
  if (!encodedPayload || !suppliedSignature || extra) return false;
  if (!/^[A-Za-z0-9_-]+$/.test(encodedPayload)) return false;
  if (!/^[A-Za-z0-9_-]{43}$/.test(suppliedSignature)) return false;

  const config = getAdminAuthConfig();
  const expectedSignature = hmac(
    encodedPayload,
    config.sessionSecret,
  );

  let suppliedSignatureBytes: Buffer;
  try {
    suppliedSignatureBytes = Buffer.from(suppliedSignature, "base64url");
  } catch {
    return false;
  }
  if (suppliedSignatureBytes.length !== expectedSignature.length) return false;
  if (!timingSafeEqual(suppliedSignatureBytes, expectedSignature)) return false;

  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    );
  } catch {
    return false;
  }

  const result = SessionPayloadSchema.safeParse(parsedPayload);
  if (!result.success) return false;

  const nowSeconds = Math.floor(now / 1_000);
  const { iat, exp } = result.data;
  if (iat > nowSeconds + 60) return false;
  if (exp <= nowSeconds) return false;
  if (exp <= iat || exp - iat > ADMIN_SESSION_TTL_SECONDS) return false;

  return true;
}

export function isAdminRequestAuthenticated(request: NextRequest): boolean {
  return verifyAdminSessionToken(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );
}

export function setAdminSessionCookie(
  response: NextResponse,
  session: CreatedAdminSession,
): void {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: session.token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
    priority: "high",
  });
}

export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
    priority: "high",
  });
}

function getAdminAuthConfig(): AdminAuthConfig {
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (process.env.NODE_ENV === "production") {
    if (
      !password ||
      password.length < 12 ||
      !sessionSecret ||
      sessionSecret.length < 32
    ) {
      throw new AdminAuthConfigurationError();
    }
    return { password, sessionSecret };
  }

  return {
    password: password || DEVELOPMENT_ADMIN_PASSWORD,
    sessionSecret: sessionSecret || DEVELOPMENT_SESSION_SECRET,
  };
}

function hmac(value: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(value, "utf8").digest();
}


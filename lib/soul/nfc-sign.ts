import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Production-shaped opaque NFC URL helpers.
 * The live prototype still uses static demo tokens; these utilities prepare
 * the migration path described in ARCHITECTURE.md without wiring secrets yet.
 */

const DEFAULT_VERSION = "1";

export interface SignedNfcPayload {
  readonly opaqueId: string;
  readonly version: string;
  readonly signature: string;
  readonly path: string;
  readonly absoluteUrl: string;
}

export interface VerifySignedNfcResult {
  readonly ok: boolean;
  readonly reason?:
    | "missing_secret"
    | "malformed"
    | "bad_signature"
    | "version_mismatch";
  readonly opaqueId?: string;
  readonly version?: string;
}

function base64Url(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string): Buffer | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    return Buffer.from(padded + pad, "base64");
  } catch {
    return null;
  }
}

function signingMessage(version: string, opaqueId: string): string {
  return `${version}\n${opaqueId}`;
}

export function generateOpaqueId(bytes = 16): string {
  return base64Url(randomBytes(bytes));
}

export function signOpaqueNfcId(options: {
  readonly opaqueId: string;
  readonly secret: string;
  readonly siteUrl: string;
  readonly version?: string;
}): SignedNfcPayload {
  const version = options.version ?? DEFAULT_VERSION;
  const signature = base64Url(
    createHmac("sha256", options.secret)
      .update(signingMessage(version, options.opaqueId), "utf8")
      .digest(),
  );
  const path = `/c/${options.opaqueId}?v=${version}&sig=${signature}`;
  const base = options.siteUrl.replace(/\/$/, "");
  return {
    opaqueId: options.opaqueId,
    version,
    signature,
    path,
    absoluteUrl: `${base}${path}`,
  };
}

export function verifySignedNfcUrl(options: {
  readonly opaqueId: string;
  readonly version: string;
  readonly signature: string;
  readonly secret: string | undefined;
  readonly expectedVersion?: string;
}): VerifySignedNfcResult {
  if (!options.secret || options.secret.length < 32) {
    return { ok: false, reason: "missing_secret" };
  }
  if (!options.opaqueId || !options.signature || !options.version) {
    return { ok: false, reason: "malformed" };
  }
  const expectedVersion = options.expectedVersion ?? DEFAULT_VERSION;
  if (options.version !== expectedVersion) {
    return { ok: false, reason: "version_mismatch" };
  }

  const expected = createHmac("sha256", options.secret)
    .update(signingMessage(options.version, options.opaqueId), "utf8")
    .digest();
  const provided = fromBase64Url(options.signature);
  if (!provided || provided.length !== expected.length) {
    return { ok: false, reason: "bad_signature" };
  }
  if (!timingSafeEqual(provided, expected)) {
    return { ok: false, reason: "bad_signature" };
  }
  return {
    ok: true,
    opaqueId: options.opaqueId,
    version: options.version,
  };
}

#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHmac, randomBytes } from "node:crypto";
import test from "node:test";

function base64Url(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function sign(version, opaqueId, secret) {
  return base64Url(
    createHmac("sha256", secret)
      .update(`${version}\n${opaqueId}`, "utf8")
      .digest(),
  );
}

test("signed NFC payload is deterministic for same inputs", () => {
  const secret = "x".repeat(32);
  const opaqueId = base64Url(randomBytes(16));
  const a = sign("1", opaqueId, secret);
  const b = sign("1", opaqueId, secret);
  assert.equal(a, b);
  assert.notEqual(a, sign("1", opaqueId + "z", secret));
});

test("signature length is non-trivial", () => {
  const sig = sign("1", "opaque-demo", "s".repeat(40));
  assert.ok(sig.length >= 40);
});

#!/usr/bin/env node
/**
 * Lightweight catalog contract test without Next path aliases.
 * Mirrors the public-catalog shape expected by GET /api/cards.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const seedSource = readFileSync(join(root, "lib/soul/seed.ts"), "utf8");

test("seed defines at least one demo token for tap flow", () => {
  assert.match(seedSource, /publicToken:\s*"soul_demo_/);
});

test("seed cards include reward linkage", () => {
  assert.match(seedSource, /rewardIds:\s*\[/);
  assert.match(seedSource, /reward-pink-sky-wallpaper/);
});

test("API cards route file exists and rate-limits", () => {
  const route = readFileSync(join(root, "app/api/cards/route.ts"), "utf8");
  assert.match(route, /listPublicCatalog/);
  assert.match(route, /RATE_LIMITED/);
  assert.match(route, /public-catalog/);
});

test("health reports version and mode", () => {
  const route = readFileSync(join(root, "app/api/health/route.ts"), "utf8");
  assert.match(route, /version/);
  assert.match(route, /fictional_prototype/);
});

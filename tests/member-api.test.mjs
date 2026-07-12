#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("member API routes exist for wallet resources", () => {
  const files = [
    "app/api/member/profile/route.ts",
    "app/api/member/cards/route.ts",
    "app/api/member/cards/[cardId]/route.ts",
    "app/api/member/cards/[cardId]/memories/route.ts",
    "app/api/member/rewards/route.ts",
  ];
  for (const rel of files) {
    const src = readFileSync(join(root, rel), "utf8");
    assert.match(src, /apiSuccess|RATE_LIMITED/);
  }
});

test("member resource client unwraps ok/data envelope", () => {
  const src = readFileSync(join(root, "components/member-data.tsx"), "utf8");
  assert.match(src, /ok.*true/);
  assert.match(src, /\.data/);
});

test("universities page exists for campus story", () => {
  const src = readFileSync(join(root, "app/universities/page.tsx"), "utf8");
  assert.match(src, /Memory infrastructure/);
});

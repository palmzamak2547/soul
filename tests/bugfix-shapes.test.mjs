#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("useMemberResource does not depend on fallback identity", () => {
  const src = readFileSync(join(root, "components/member-data.tsx"), "utf8");
  assert.match(src, /fallbackRef/);
  assert.doesNotMatch(src, /\[attempt, endpoint, fallback\]/);
});

test("member settings API shape includes sessions + defaultPrivacy", () => {
  const src = readFileSync(join(root, "lib/member/demo.ts"), "utf8");
  assert.match(src, /defaultPrivacy/);
  assert.match(src, /sessions:\s*\[/);
  assert.match(src, /tier:\s*"Pink Member"/);
});

test("tap redeem uses card.primaryRewardId not hard-coded first-light reward", () => {
  const src = readFileSync(join(root, "components/tap-experience.tsx"), "utf8");
  assert.match(src, /primaryRewardId/);
  assert.match(src, /rewardId:\s*card\.primaryRewardId/);
  assert.doesNotMatch(
    src,
    /rewardId:\s*"reward-pink-sky-wallpaper"/,
  );
});

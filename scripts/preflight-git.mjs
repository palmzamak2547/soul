#!/usr/bin/env node
/**
 * Contributor-safe preflight: fetch origin and refuse to ship if we are behind.
 * Usage: node scripts/preflight-git.mjs
 */
import { execSync } from "node:child_process";

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

try {
  run("git fetch origin");
  const branch = run("git rev-parse --abbrev-ref HEAD");
  if (branch !== "main") {
    console.warn(`preflight: on branch ${branch} (expected main)`);
  }
  const counts = run("git rev-list --left-right --count HEAD...origin/main");
  const [ahead, behind] = counts.split(/\s+/).map((n) => Number(n));
  console.log(`preflight: ahead=${ahead} behind=${behind}`);
  if (behind > 0) {
    console.error(
      "preflight: origin/main has commits you do not. Run: git pull --rebase origin main",
    );
    process.exit(2);
  }
  const dirty = run("git status --porcelain");
  if (dirty) {
    console.log("preflight: working tree has local changes (ok if intentional)");
  }
  console.log("preflight: ok");
} catch (error) {
  console.error("preflight failed", error instanceof Error ? error.message : error);
  process.exit(1);
}

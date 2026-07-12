#!/usr/bin/env node
/**
 * Production smoke checks for SOUL.
 * Usage: node tests/smoke.mjs [baseUrl]
 * Default: https://soulplatform.vercel.app
 */

const base = (process.argv[2] || "https://soulplatform.vercel.app").replace(
  /\/$/,
  "",
);

const paths = [
  "/",
  "/collections",
  "/privacy",
  "/admin",
  "/status",
  "/member/wallet",
  "/member/sign-in",
  "/tap/soul_demo_7k3m9q2v",
  "/api/health",
  "/api/cards",
  "/api/cards/soul_demo_7k3m9q2v",
  "/member/cards/founder-088",
];

let failed = 0;

for (const path of paths) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { accept: path.startsWith("/api/") ? "application/json" : "*/*" },
    });
    const ok = res.status >= 200 && res.status < 400;
    if (!ok) failed += 1;
    console.log(`${ok ? "OK " : "FAIL"} ${res.status} ${path}`);
    if (path === "/api/health" && res.ok) {
      const body = await res.json();
      console.log(`     health: ${JSON.stringify(body?.data ?? body)}`);
    }
    if (path === "/api/cards" && res.ok) {
      const body = await res.json();
      const count = body?.data?.count ?? body?.data?.cards?.length;
      console.log(`     catalog cards: ${count}`);
    }
  } catch (error) {
    failed += 1;
    console.log(`FAIL ERR ${path} ${error instanceof Error ? error.message : error}`);
  }
}

if (failed > 0) {
  console.error(`\nSmoke failed: ${failed} path(s)`);
  process.exit(1);
}

console.log(`\nSmoke passed against ${base}`);

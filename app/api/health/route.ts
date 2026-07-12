import { readFileSync } from "node:fs";
import { join } from "node:path";

import { apiSuccess } from "@/lib/http/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readPackageVersion(): string {
  try {
    const raw = readFileSync(join(process.cwd(), "package.json"), "utf8");
    const pkg = JSON.parse(raw) as { version?: string };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

export function GET() {
  return apiSuccess({
    status: "ok" as const,
    service: "soul-phygital-platform",
    version: readPackageVersion(),
    mode: "fictional_prototype" as const,
    repository: "in_memory" as const,
    site: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    commit:
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
      process.env.VERCEL_GIT_COMMIT_REF ??
      null,
    region: process.env.VERCEL_REGION ?? null,
    timestamp: new Date().toISOString(),
  });
}

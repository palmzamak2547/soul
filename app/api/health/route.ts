import { apiSuccess } from "@/lib/http/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return apiSuccess({
    status: "ok" as const,
    service: "soul-phygital-platform",
    mode: "fictional_prototype" as const,
    repository: "in_memory" as const,
    timestamp: new Date().toISOString(),
  });
}


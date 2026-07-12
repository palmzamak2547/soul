import { logInfo } from "@/lib/observability/logger";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    logInfo("SOUL server runtime initialized", {
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      region: process.env.VERCEL_REGION ?? "local",
    });
  }
}

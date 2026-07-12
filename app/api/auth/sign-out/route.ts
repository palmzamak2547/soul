import type { NextRequest } from "next/server";

import { apiError, apiSuccess, isSameOriginMutation } from "@/lib/http/api";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function DELETE(request: NextRequest) {
  if (!isSameOriginMutation(request)) {
    return apiError(403, "ORIGIN_NOT_ALLOWED", "ไม่อนุญาตคำขอข้ามเว็บไซต์");
  }
  const supabase = await createServerSupabaseClient();
  if (supabase) await supabase.auth.signOut({ scope: "local" });
  return apiSuccess({ authenticated: false });
}

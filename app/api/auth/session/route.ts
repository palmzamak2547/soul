import { apiSuccess } from "@/lib/http/api";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return apiSuccess({ configured: false, authenticated: false });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return apiSuccess({ configured: true, authenticated: false });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_path, locale")
    .eq("id", data.user.id)
    .maybeSingle();

  return apiSuccess({
    configured: true,
    authenticated: true,
    user: {
      id: data.user.id,
      email: data.user.email ?? null,
      displayName: profile?.display_name ?? data.user.user_metadata.display_name ?? "SOUL Member",
      avatarPath: profile?.avatar_path ?? null,
      locale: profile?.locale ?? "th",
    },
  });
}

import type { User } from "@supabase/supabase-js";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type VerifiedMember =
  | { readonly mode: "supabase"; readonly user: User }
  | { readonly mode: "demo"; readonly user: null };

export async function getVerifiedMember(): Promise<VerifiedMember | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return process.env.NODE_ENV === "production"
      ? null
      : { mode: "demo", user: null };
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { mode: "supabase", user: data.user };
}

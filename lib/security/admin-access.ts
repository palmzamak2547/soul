import type { NextRequest } from "next/server";

import {
  AdminAuthConfigurationError,
  isAdminRequestAuthenticated,
} from "@/lib/security/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminAccess =
  | { readonly authorized: true; readonly mode: "breakglass" }
  | {
      readonly authorized: true;
      readonly mode: "supabase";
      readonly userId: string;
      readonly role: "owner" | "admin" | "curator";
      readonly organizationId: string;
    }
  | { readonly authorized: false };

export async function authorizeAdminRequest(
  request: NextRequest,
): Promise<AdminAccess> {
  try {
    if (isAdminRequestAuthenticated(request)) {
      return { authorized: true, mode: "breakglass" };
    }
  } catch (error) {
    if (!(error instanceof AdminAuthConfigurationError)) throw error;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { authorized: false };

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return { authorized: false };

  const { data, error } = await supabase
    .from("organization_memberships")
    .select("organization_id, role")
    .eq("user_id", userData.user.id)
    .eq("status", "active")
    .in("role", ["owner", "admin", "curator"])
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) return { authorized: false };
  if (!isAdminRole(data.role)) return { authorized: false };

  return {
    authorized: true,
    mode: "supabase",
    userId: userData.user.id,
    role: data.role,
    organizationId: String(data.organization_id),
  };
}

function isAdminRole(value: unknown): value is "owner" | "admin" | "curator" {
  return value === "owner" || value === "admin" || value === "curator";
}

import type { SupabaseClient } from "@supabase/supabase-js"

export async function getWorkspaceOwnerId(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase.from("dashboard_users").select("workspace_owner_id,role,invited_by").eq("user_id", userId).maybeSingle()
  return data?.workspace_owner_id ?? (data?.role === "Owner" ? userId : data?.invited_by ?? userId)
}

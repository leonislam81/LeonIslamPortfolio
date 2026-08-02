import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { DashboardRole } from "@/lib/dashboard-permissions"
export type { DashboardRole } from "@/lib/dashboard-permissions"
export type DashboardStatus = "Invited" | "Active" | "Disabled"

export async function getDashboardMembership() {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createSupabaseAdminClient()
  const client = admin ?? supabase
  const { data: membership } = await client.from("dashboard_users").select("role,status").eq("user_id", user.id).maybeSingle()

  if (!membership && admin) {
    const { count } = await admin.from("dashboard_users").select("user_id", { count: "exact", head: true })
    if ((count ?? 0) === 0) {
      await admin.from("dashboard_users").upsert({ user_id: user.id, email: user.email ?? "", display_name: user.user_metadata?.full_name ?? null, role: "Owner", status: "Active" })
      return { user, role: "Owner" as DashboardRole, status: "Active" as DashboardStatus }
    }
  }

  if (!membership) return { user, role: null, status: null }
  return { user, role: membership.role as DashboardRole, status: membership.status as DashboardStatus }
}

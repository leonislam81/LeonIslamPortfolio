import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { defaultDashboardWorkflowSettings, normaliseDashboardWorkflowSettings } from "@/lib/dashboard-workflow"

export async function getAuditWorkflowSettings() {
  const supabase = createSupabaseAdminClient()
  const ownerId = process.env.DASHBOARD_OWNER_ID
  if (!supabase || !ownerId) return defaultDashboardWorkflowSettings
  const { data, error } = await supabase.from("dashboard_settings").select("first_follow_up_days, re_audit_days").eq("owner_id", ownerId).maybeSingle()
  if (error || !data) return defaultDashboardWorkflowSettings
  return normaliseDashboardWorkflowSettings({ firstFollowUpDays: data.first_follow_up_days, reAuditDays: data.re_audit_days })
}

import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export async function recordDashboardActivity(input: { workspaceOwnerId: string; actorId: string; actorEmail?: string | null; action: string; entityType: string; entityId?: string | null; details?: Record<string, string | number | boolean | null> }) {
  const admin = createSupabaseAdminClient()
  if (!admin) return
  await admin.from("dashboard_activity_log").insert({ workspace_owner_id: input.workspaceOwnerId, actor_id: input.actorId, actor_email: input.actorEmail ?? null, action: input.action, entity_type: input.entityType, entity_id: input.entityId ?? null, details: input.details ?? {} })
}

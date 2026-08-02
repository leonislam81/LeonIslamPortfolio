import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export async function recordDashboardNotification(input: { workspaceOwnerId: string; title: string; message: string; kind?: "info" | "success" | "warning" | "error"; href?: string }) {
  const admin = createSupabaseAdminClient()
  if (!admin) return
  await admin.from("dashboard_notifications").insert({ workspace_owner_id: input.workspaceOwnerId, title: input.title, message: input.message, kind: input.kind ?? "info", href: input.href ?? null })
}

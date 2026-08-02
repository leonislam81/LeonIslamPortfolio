import { createSupabaseAdminClient } from "@/lib/supabase/admin"

type NotificationCategory = "bookings" | "leads" | "campaigns" | "users" | "system"

export async function recordDashboardNotification(input: { workspaceOwnerId: string; title: string; message: string; kind?: "info" | "success" | "warning" | "error"; href?: string; category?: NotificationCategory }) {
  const admin = createSupabaseAdminClient()
  if (!admin) return
  const { data: members } = await admin.from("dashboard_users").select("user_id,notification_preferences").eq("workspace_owner_id", input.workspaceOwnerId).in("status", ["Active", "Invited"])
  const recipients = (members ?? []).filter((member) => input.category === "system" || input.category === undefined || (member.notification_preferences as Record<string, unknown> | null)?.[input.category] !== false)
  const rows = recipients.length ? recipients.map((member) => ({ workspace_owner_id: input.workspaceOwnerId, recipient_user_id: member.user_id, title: input.title, message: input.message, kind: input.kind ?? "info", href: input.href ?? null })) : [{ workspace_owner_id: input.workspaceOwnerId, recipient_user_id: null, title: input.title, message: input.message, kind: input.kind ?? "info", href: input.href ?? null }]
  await admin.from("dashboard_notifications").insert(rows)
}

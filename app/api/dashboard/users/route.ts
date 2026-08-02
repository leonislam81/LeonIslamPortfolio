import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { recordDashboardActivity } from "@/lib/dashboard-activity"
import { recordDashboardNotification } from "@/lib/dashboard-notifications"

const roles = ["Owner", "Administrator", "Editor", "Author", "Contributor", "Viewer"] as const
const statuses = ["Invited", "Active", "Disabled"] as const

async function getRequestUser() {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

async function getAdminContext() {
  const user = await getRequestUser()
  const admin = createSupabaseAdminClient()
  if (!user || !admin) return { user: null, admin: null, allowed: false, workspaceOwnerId: null }

  const { data: membership } = await admin.from("dashboard_users").select("role,status,workspace_owner_id,invited_by").eq("user_id", user.id).maybeSingle()
  if (!membership) {
    const { count } = await admin.from("dashboard_users").select("user_id", { count: "exact", head: true })
    if ((count ?? 0) === 0) {
      await admin.from("dashboard_users").upsert({ user_id: user.id, workspace_owner_id: user.id, email: user.email ?? "", display_name: user.user_metadata?.full_name ?? null, role: "Owner", status: "Active" })
      return { user, admin, allowed: true, workspaceOwnerId: user.id }
    }
  }

  return { user, admin, allowed: membership?.status === "Active" && (membership.role === "Owner" || membership.role === "Administrator"), workspaceOwnerId: membership?.workspace_owner_id ?? membership?.invited_by ?? user.id }
}

export async function GET() {
  const { admin, allowed } = await getAdminContext()
  if (!admin) return NextResponse.json({ error: "Supabase admin access is not configured." }, { status: 503 })
  if (!allowed) return NextResponse.json({ error: "You do not have permission to manage dashboard users." }, { status: 403 })
  const { data, error } = await admin.from("dashboard_users").select("user_id,email,display_name,role,status,created_at,updated_at").order("created_at", { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users: data ?? [] })
}

export async function POST(request: Request) {
  const { user, admin, allowed, workspaceOwnerId } = await getAdminContext()
  if (!admin || !user) return NextResponse.json({ error: "Supabase admin access is not configured." }, { status: 503 })
  if (!allowed) return NextResponse.json({ error: "You do not have permission to invite dashboard users." }, { status: 403 })
  const body = await request.json() as { email?: string; displayName?: string; role?: string }
  const email = body.email?.trim().toLowerCase()
  const displayName = body.displayName?.trim() || null
  const role = body.role ?? "Viewer"
  if (!email || !email.includes("@")) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  if (!roles.includes(role as typeof roles[number])) return NextResponse.json({ error: "Choose a valid dashboard role." }, { status: 400 })
  if (role === "Owner") return NextResponse.json({ error: "There can only be one account owner from this screen." }, { status: 400 })

  const { data: invitation, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, { data: { full_name: displayName ?? "" } })
  if (inviteError || !invitation.user) return NextResponse.json({ error: inviteError?.message ?? "The invitation could not be sent." }, { status: 400 })
  const { error } = await admin.from("dashboard_users").insert({ user_id: invitation.user.id, workspace_owner_id: workspaceOwnerId, email, display_name: displayName, role, status: "Invited", invited_by: user.id })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await recordDashboardActivity({ workspaceOwnerId: workspaceOwnerId ?? user.id, actorId: user.id, actorEmail: user.email, action: "Invited dashboard user", entityType: "User", entityId: invitation.user.id, details: { email, role } })
  await recordDashboardNotification({ workspaceOwnerId: workspaceOwnerId ?? user.id, title: "New user invited", message: `${email} was invited with the ${role} role.`, kind: "info", href: "/dashboard/users" })
  return NextResponse.json({ ok: true })
}

export async function PATCH(request: Request) {
  const { user, admin, allowed, workspaceOwnerId } = await getAdminContext()
  if (!admin) return NextResponse.json({ error: "Supabase admin access is not configured." }, { status: 503 })
  if (!allowed) return NextResponse.json({ error: "You do not have permission to update dashboard users." }, { status: 403 })
  const body = await request.json() as { userId?: string; role?: string; status?: string }
  if (!body.userId || (body.role && !roles.includes(body.role as typeof roles[number])) || (body.status && !statuses.includes(body.status as typeof statuses[number]))) return NextResponse.json({ error: "Choose a valid role and status." }, { status: 400 })
  const updates = { ...(body.role ? { role: body.role } : {}), ...(body.status ? { status: body.status } : {}), updated_at: new Date().toISOString() }
  const { error } = await admin.from("dashboard_users").update(updates).eq("user_id", body.userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await recordDashboardActivity({ workspaceOwnerId: workspaceOwnerId ?? user?.id ?? body.userId, actorId: user?.id ?? body.userId, actorEmail: user?.email, action: body.role ? "Changed dashboard user role" : "Changed dashboard user status", entityType: "User", entityId: body.userId, details: { role: body.role ?? null, status: body.status ?? null } })
  const changeLabel = body.role ? `role to ${body.role}` : `status to ${body.status}`
  await recordDashboardNotification({ workspaceOwnerId: workspaceOwnerId ?? user?.id ?? body.userId, title: "Dashboard user updated", message: `${body.userId === user?.id ? "Your" : "A dashboard user's"} ${changeLabel}.`, kind: body.status === "Disabled" ? "warning" : "info", href: "/dashboard/users" })
  return NextResponse.json({ ok: true })
}

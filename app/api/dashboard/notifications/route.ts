import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getDashboardMembership } from "@/lib/dashboard-access"

async function getContext() {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { supabase: null, user: null, ownerId: null }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, ownerId: null }
  const membership = await getDashboardMembership()
  return { supabase, user, ownerId: membership?.workspaceOwnerId ?? user.id }
}

export async function GET() {
  const { supabase, user, ownerId } = await getContext()
  if (!supabase || !user || !ownerId) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })
  const { data, error } = await supabase.from("dashboard_notifications").select("id,title,message,kind,href,is_read,created_at").eq("workspace_owner_id", ownerId).order("created_at", { ascending: false }).limit(50)
  if (error) return NextResponse.json({ error: "Could not load notifications." }, { status: 500 })
  return NextResponse.json({ notifications: data ?? [] })
}

export async function PATCH(request: Request) {
  const { supabase, user, ownerId } = await getContext()
  if (!supabase || !user || !ownerId) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })
  const body = await request.json().catch(() => null) as { id?: string; all?: boolean } | null
  const query = supabase.from("dashboard_notifications").update({ is_read: true }).eq("workspace_owner_id", ownerId)
  const { error } = body?.all ? await query : await query.eq("id", body?.id ?? "")
  if (error) return NextResponse.json({ error: "Could not update notifications." }, { status: 500 })
  return NextResponse.json({ ok: true })
}

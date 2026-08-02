import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getDashboardMembership } from "@/lib/dashboard-access"

async function getSession() {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return { supabase: null, user: null }
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function GET(request: Request) {
  const { supabase, user } = await getSession()
  const leadId = new URL(request.url).searchParams.get("leadId")
  if (!supabase || !user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })
  if (!leadId) return NextResponse.json({ error: "Lead is required." }, { status: 400 })
  const { data, error } = await supabase.from("audit_scheduled_emails").select("id, template, scheduled_for, status").eq("lead_id", leadId).order("scheduled_for", { ascending: true })
  if (error) return NextResponse.json({ error: "Could not load scheduled emails." }, { status: 500 })
  return NextResponse.json({ emails: data ?? [] })
}

export async function POST(request: Request) {
  const { supabase, user } = await getSession()
  if (!supabase) return NextResponse.json({ error: "Dashboard is not configured." }, { status: 503 })
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })
  const payload = await request.json().catch(() => null)
  if (!payload || typeof payload.leadId !== "string" || (payload.template !== "follow-up" && payload.template !== "re-audit") || typeof payload.scheduledFor !== "string") return NextResponse.json({ error: "Invalid schedule request." }, { status: 400 })
  const date = new Date(payload.scheduledFor)
  if (!Number.isFinite(date.getTime()) || date.getTime() < Date.now() + 60_000 || date.getTime() > Date.now() + 365 * 24 * 60 * 60 * 1_000) return NextResponse.json({ error: "Choose a date between one minute and one year from now." }, { status: 400 })
  const { data: lead } = await supabase.from("audit_leads").select("id").eq("id", payload.leadId).single()
  if (!lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 })
  const membership = await getDashboardMembership()
  const { error } = await supabase.from("audit_scheduled_emails").insert({ lead_id: payload.leadId, owner_id: membership?.workspaceOwnerId ?? user.id, template: payload.template, scheduled_for: date.toISOString() })
  if (error) return NextResponse.json({ error: "Could not schedule the email. Run the scheduled emails SQL first." }, { status: 500 })
  const field = payload.template === "follow-up" ? "follow_up_at" : "re_audit_at"
  await supabase.from("audit_leads").update({ [field]: date.toISOString().slice(0, 10) }).eq("id", payload.leadId)
  return NextResponse.json({ ok: true })
}

export async function PATCH(request: Request) {
  const { supabase, user } = await getSession()
  if (!supabase || !user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })
  const payload = await request.json().catch(() => null)
  if (!payload || typeof payload.id !== "string" || (payload.action !== "cancel" && payload.action !== "reschedule")) return NextResponse.json({ error: "Invalid schedule update." }, { status: 400 })
  const { data: schedule, error: scheduleError } = await supabase.from("audit_scheduled_emails").select("id, lead_id, template").eq("id", payload.id).eq("status", "scheduled").single()
  if (scheduleError || !schedule) return NextResponse.json({ error: "This scheduled email is no longer available." }, { status: 404 })
  const field = schedule.template === "follow-up" ? "follow_up_at" : "re_audit_at"
  if (payload.action === "cancel") {
    const { error } = await supabase.from("audit_scheduled_emails").update({ status: "cancelled" }).eq("id", schedule.id)
    if (error) return NextResponse.json({ error: "Could not cancel the email." }, { status: 500 })
    await supabase.from("audit_leads").update({ [field]: null }).eq("id", schedule.lead_id)
    return NextResponse.json({ ok: true })
  }
  if (typeof payload.scheduledFor !== "string") return NextResponse.json({ error: "A new date is required." }, { status: 400 })
  const date = new Date(payload.scheduledFor)
  if (!Number.isFinite(date.getTime()) || date.getTime() < Date.now() + 60_000 || date.getTime() > Date.now() + 365 * 24 * 60 * 60 * 1_000) return NextResponse.json({ error: "Choose a date between one minute and one year from now." }, { status: 400 })
  const { error } = await supabase.from("audit_scheduled_emails").update({ scheduled_for: date.toISOString() }).eq("id", schedule.id)
  if (error) return NextResponse.json({ error: "Could not reschedule the email." }, { status: 500 })
  await supabase.from("audit_leads").update({ [field]: date.toISOString().slice(0, 10) }).eq("id", schedule.lead_id)
  return NextResponse.json({ ok: true })
}

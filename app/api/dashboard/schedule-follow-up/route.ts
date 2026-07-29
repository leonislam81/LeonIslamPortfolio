import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return NextResponse.json({ error: "Dashboard is not configured." }, { status: 503 })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })
  const payload = await request.json().catch(() => null)
  if (!payload || typeof payload.leadId !== "string" || (payload.template !== "follow-up" && payload.template !== "re-audit") || typeof payload.scheduledFor !== "string") return NextResponse.json({ error: "Invalid schedule request." }, { status: 400 })
  const date = new Date(payload.scheduledFor)
  if (!Number.isFinite(date.getTime()) || date.getTime() < Date.now() + 60_000 || date.getTime() > Date.now() + 365 * 24 * 60 * 60 * 1_000) return NextResponse.json({ error: "Choose a date between one minute and one year from now." }, { status: 400 })
  const { data: lead } = await supabase.from("audit_leads").select("id").eq("id", payload.leadId).single()
  if (!lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 })
  const { error } = await supabase.from("audit_scheduled_emails").insert({ lead_id: payload.leadId, owner_id: user.id, template: payload.template, scheduled_for: date.toISOString() })
  if (error) return NextResponse.json({ error: "Could not schedule the email. Run the scheduled emails SQL first." }, { status: 500 })
  const field = payload.template === "follow-up" ? "follow_up_at" : "re_audit_at"
  await supabase.from("audit_leads").update({ [field]: date.toISOString().slice(0, 10) }).eq("id", payload.leadId)
  return NextResponse.json({ ok: true })
}

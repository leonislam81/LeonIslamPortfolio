import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getDashboardMembership } from "@/lib/dashboard-access"

const sender = "Leon Islam Website <info@leonislam.com>"
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character)
const renderMessage = (message: string, campaignId: string) => message.split(/(https?:\/\/[^\s]+)/g).map((part) => /^https?:\/\//.test(part) ? `<a href="https://leonislam.com/api/campaigns/click?id=${campaignId}&url=${encodeURIComponent(part)}" style="color:#0f6b8f;">${escapeHtml(part)}</a>` : escapeHtml(part).replace(/\n/g, "<br>")).join("")

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
  if (!supabase || !user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })
  const { data, error } = await supabase.from("email_campaigns").select("id,subject,message,recipient_count,status,error_message,sent_at,open_count,click_count,last_opened_at,last_clicked_at,created_at,updated_at").eq("owner_id", ownerId).order("created_at", { ascending: false }).limit(25)
  if (error) return NextResponse.json({ error: "Could not load campaign history." }, { status: 500 })
  return NextResponse.json({ campaigns: data ?? [] })
}

export async function POST(request: Request) {
  const { supabase, user, ownerId } = await getContext()
  if (!supabase || !user || !ownerId) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })
  const body = await request.json().catch(() => null) as { subject?: string; message?: string; action?: "save" | "send"; campaignId?: string } | null
  const subject = body?.subject?.trim() ?? ""
  const message = body?.message?.trim() ?? ""
  if (!subject || !message || !body?.action || !["save", "send"].includes(body.action)) return NextResponse.json({ error: "Subject, message, and action are required." }, { status: 400 })
  const { data: recipients, error: recipientsError } = await supabase.from("audit_leads").select("email").eq("marketing_consent", true).limit(500)
  if (recipientsError) return NextResponse.json({ error: "Could not load the opted-in audience." }, { status: 500 })
  const emails = Array.from(new Set((recipients ?? []).map((row) => row.email).filter(Boolean)))
  if (body.action === "save") {
    const { data, error } = await supabase.from("email_campaigns").insert({ owner_id: ownerId, subject, message, recipient_count: emails.length, status: "Draft" }).select("id,subject,message,recipient_count,status,error_message,sent_at,open_count,click_count,last_opened_at,last_clicked_at,created_at,updated_at").single()
    if (error) return NextResponse.json({ error: "Could not save the campaign. Run the email campaigns SQL migration first." }, { status: 500 })
    return NextResponse.json({ campaign: data })
  }
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: "Email service is not configured. Save this campaign as a draft instead." }, { status: 503 })
  if (!emails.length) return NextResponse.json({ error: "There are no opted-in recipients yet." }, { status: 400 })
  const { data: campaign, error: campaignError } = await supabase.from("email_campaigns").insert({ owner_id: ownerId, subject, message, recipient_count: emails.length, status: "Draft" }).select("id").single()
  if (campaignError || !campaign) return NextResponse.json({ error: "Could not create the campaign record." }, { status: 500 })
  const html = `<div style="max-width:620px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif;color:#10233f;line-height:1.65;">${renderMessage(message, campaign.id)}<p style="margin-top:28px;color:#52657c;font-size:12px;">If you no longer want these updates, reply with &quot;unsubscribe&quot; and we will remove you from the list.</p></div><img src="https://leonislam.com/api/campaigns/open?id=${campaign.id}" width="1" height="1" alt="" style="display:block;border:0;" />`
  const { error: sendError } = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: sender, to: ["info@leonislam.com"], bcc: emails, replyTo: "info@leonislam.com", subject, html })
  if (sendError) {
    await supabase.from("email_campaigns").update({ status: "Failed", error_message: sendError.message, updated_at: new Date().toISOString() }).eq("id", campaign.id).eq("owner_id", ownerId)
    return NextResponse.json({ error: "The campaign could not be sent. The failed attempt was saved in history." }, { status: 502 })
  }
  const { data: updated } = await supabase.from("email_campaigns").update({ status: "Sent", sent_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", campaign.id).eq("owner_id", ownerId).select("id,subject,message,recipient_count,status,error_message,sent_at,open_count,click_count,last_opened_at,last_clicked_at,created_at,updated_at").single()
  return NextResponse.json({ campaign: updated })
}

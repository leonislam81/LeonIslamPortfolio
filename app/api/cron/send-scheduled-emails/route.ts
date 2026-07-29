import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

const sender = "Leon Islam Website <info@leonislam.com>"

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization")
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse("Unauthorized", { status: 401 })
  const supabase = createSupabaseAdminClient()
  if (!supabase || !process.env.RESEND_API_KEY) return NextResponse.json({ error: "Email schedule is not configured." }, { status: 503 })
  const { data: scheduled } = await supabase.from("audit_scheduled_emails").select("id, lead_id, owner_id, template").eq("status", "scheduled").lte("scheduled_for", new Date().toISOString()).limit(25)
  let sent = 0
  for (const item of scheduled ?? []) {
    const { data: claimed } = await supabase.from("audit_scheduled_emails").update({ status: "processing" }).eq("id", item.id).eq("status", "scheduled").select("id").maybeSingle()
    if (!claimed) continue
    const { data: lead } = await supabase.from("audit_leads").select("email, website_url").eq("id", item.lead_id).single()
    if (!lead) { await supabase.from("audit_scheduled_emails").update({ status: "cancelled" }).eq("id", item.id); continue }
    const isReaudit = item.template === "re-audit"
    const subject = isReaudit ? `Ready for a fresh audit of ${lead.website_url}?` : "A quick follow-up on your website audit"
    const html = `<div style="max-width:620px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif;color:#10233f;line-height:1.65;"><p style="color:#0f6b8f;font-size:12px;font-weight:700;text-transform:uppercase;">Leon Islam · Website audit</p><h1 style="font-size:26px;">${isReaudit ? "See what has improved" : "A practical next step for your website"}</h1><p>Hi,</p><p>${isReaudit ? `You asked to revisit the audit for ${lead.website_url}. If you have made updates, reply when you are ready and I will send an updated snapshot.` : `I wanted to follow up on the website audit for ${lead.website_url}. Reply with your main goal—more leads, sales, bookings, or search traffic—and I will suggest the best first improvement.`}</p><p><a href="https://leonislam.com/book-call" style="display:inline-block;background:#0f6b8f;color:#fff;padding:12px 16px;border-radius:8px;text-decoration:none;font-weight:700;">Book a free review</a></p><p>Best regards,<br><strong>Leon Islam</strong></p></div>`
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: sender, to: [lead.email], replyTo: "info@leonislam.com", subject, html })
    if (error) { await supabase.from("audit_scheduled_emails").update({ status: "scheduled" }).eq("id", item.id); continue }
    await supabase.from("audit_scheduled_emails").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", item.id)
    await supabase.from("audit_lead_activities").insert({ lead_id: item.lead_id, owner_id: item.owner_id, activity_type: "email_sent", detail: `Scheduled ${isReaudit ? "re-audit reminder" : "audit follow-up"} email sent to ${lead.email}.` })
    sent += 1
  }
  return NextResponse.json({ sent })
}

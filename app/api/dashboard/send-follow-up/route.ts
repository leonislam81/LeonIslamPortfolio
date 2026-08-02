import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getDashboardMembership } from "@/lib/dashboard-access"

const sender = "Leon Islam Website <info@leonislam.com>"
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character)

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: "Email service is not configured." }, { status: 503 })
  const supabase = await createSupabaseServerClient()
  if (!supabase) return NextResponse.json({ error: "Dashboard is not configured." }, { status: 503 })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })
  const payload = await request.json().catch(() => null)
  if (!payload || typeof payload.leadId !== "string" || (payload.template !== "follow-up" && payload.template !== "re-audit")) return NextResponse.json({ error: "Invalid email request." }, { status: 400 })
  const { data: lead, error } = await supabase.from("audit_leads").select("email, website_url, performance, seo, notes").eq("id", payload.leadId).single()
  if (error || !lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 })
  const website = escapeHtml(lead.website_url)
  const scoreSummary = `mobile performance ${lead.performance ?? "not available"}/100 and SEO ${lead.seo}/100`
  const isReaudit = payload.template === "re-audit"
  const subject = isReaudit ? `Ready for a fresh audit of ${lead.website_url}?` : `A quick follow-up on your website audit`
  const opening = isReaudit ? `You asked to revisit the audit for <a href="${website}" style="color:#0f6b8f;word-break:break-all;">${website}</a>. If you have made updates, I can run a fresh check and point out what improved.` : `I wanted to follow up on the website audit for <a href="${website}" style="color:#0f6b8f;word-break:break-all;">${website}</a>. The snapshot showed ${escapeHtml(scoreSummary)}.`
  const notes = typeof lead.notes === "string" && lead.notes.trim() ? `<p>One point worth prioritising: ${escapeHtml(lead.notes.trim().slice(0, 500))}</p>` : ""
  const html = `<div style="max-width:620px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif;color:#10233f;line-height:1.65;"><p style="margin:0 0 16px;color:#0f6b8f;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;">Leon Islam · Website audit</p><h1 style="margin:0 0 18px;font-size:26px;line-height:1.25;">${isReaudit ? "See what has improved" : "A practical next step for your website"}</h1><p>Hi,</p><p>${opening}</p>${notes}<p>${isReaudit ? "Reply to this email when you are ready, and I will send an updated snapshot with the next highest-impact opportunities." : "If you would like, reply with your main goal—more leads, sales, bookings, or search traffic—and I will suggest the best first improvement."}</p><p style="margin:26px 0;"><a href="https://leonislam.com/book-call" style="display:inline-block;border-radius:8px;background:#0f6b8f;color:#ffffff;padding:12px 16px;font-weight:700;text-decoration:none;">Book a free review</a></p><p>Best regards,<br><strong>Leon Islam</strong><br><a href="https://leonislam.com" style="color:#0f6b8f;">leonislam.com</a></p></div>`
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error: sendError } = await resend.emails.send({ from: sender, to: [lead.email], replyTo: "info@leonislam.com", subject, html })
  if (sendError) return NextResponse.json({ error: "Could not send the email. Please try again." }, { status: 502 })
  const membership = await getDashboardMembership()
  await supabase.from("audit_lead_activities").insert({ lead_id: payload.leadId, owner_id: membership?.workspaceOwnerId ?? user.id, activity_type: "email_sent", detail: `${isReaudit ? "Re-audit reminder" : "Audit follow-up"} email sent to ${lead.email}.` })
  return NextResponse.json({ ok: true })
}

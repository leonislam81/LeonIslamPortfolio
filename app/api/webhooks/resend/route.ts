import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

async function verifySignature(body: string, request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  const id = request.headers.get("svix-id")
  const timestamp = request.headers.get("svix-timestamp")
  const signature = request.headers.get("svix-signature")
  if (!secret || !id || !timestamp || !signature) return false
  const timestampNumber = Number(timestamp)
  if (!Number.isFinite(timestampNumber) || Math.abs(Date.now() / 1000 - timestampNumber) > 300) return false
  const secretBytes = Uint8Array.from(atob(secret.replace(/^whsec_/, "")), (character) => character.charCodeAt(0))
  const key = await crypto.subtle.importKey("raw", secretBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${id}.${timestamp}.${body}`))
  const expected = btoa(String.fromCharCode(...new Uint8Array(digest)))
  return signature.split(" ").some((item) => item.split(",")[1] === expected)
}

export async function POST(request: Request) {
  const body = await request.text()
  if (!(await verifySignature(body, request))) return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 })
  const payload = JSON.parse(body) as { type?: string; data?: { email_id?: string } }
  const emailId = payload.data?.email_id
  const admin = createSupabaseAdminClient()
  if (!admin || !emailId) return NextResponse.json({ ok: true })
  const event = payload.type ?? ""
  const { data: campaign } = await admin.from("email_campaigns").select("id,delivered_count,bounced_count,complained_count").eq("provider_message_id", emailId).maybeSingle()
  const updates = event === "email.delivered" ? { delivery_status: "delivered", delivered_count: (campaign?.delivered_count ?? 0) + 1 } : event === "email.bounced" ? { delivery_status: "bounced", bounced_count: (campaign?.bounced_count ?? 0) + 1 } : event === "email.complained" ? { delivery_status: "complained", complained_count: (campaign?.complained_count ?? 0) + 1 } : event === "email.failed" ? { delivery_status: "failed" } : null
  if (updates && campaign) await admin.from("email_campaigns").update({ ...updates, last_delivery_event: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", campaign.id)
  return NextResponse.json({ ok: true })
}

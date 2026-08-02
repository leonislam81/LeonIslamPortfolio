import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { recordDashboardNotification } from "@/lib/dashboard-notifications"

async function isValidSignature(body: string, request: Request) {
  const secret = process.env.CAL_WEBHOOK_SECRET
  if (!secret) return false
  const provided = request.headers.get("x-cal-signature-256") ?? request.headers.get("x-cal-signature")
  if (!provided) return false
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body))
  const expected = Array.from(new Uint8Array(digest)).map((value) => value.toString(16).padStart(2, "0")).join("")
  return provided.replace(/^sha256=/, "") === expected
}

export async function POST(request: Request) {
  const body = await request.text()
  if (!(await isValidSignature(body, request))) return NextResponse.json({ error: "Invalid Cal webhook signature." }, { status: 401 })
  const event = JSON.parse(body) as { triggerEvent?: string; payload?: Record<string, unknown> }
  const payload = event.payload ?? {}
  const booking = (payload.booking as Record<string, unknown> | undefined) ?? payload
  const attendees = Array.isArray(booking.attendees) ? booking.attendees as Array<Record<string, unknown>> : []
  const guest = attendees[0] ?? {}
  const responses = (booking.responses as Record<string, unknown> | undefined) ?? {}
  const responseValue = (key: string) => { const value = responses[key]; return typeof value === "object" && value !== null && "value" in value ? String((value as { value?: unknown }).value ?? "") : String(value ?? "") }
  const eventType = booking.eventType && typeof booking.eventType === "object" ? booking.eventType as Record<string, unknown> : {}
  const bookingUid = String(booking.uid ?? booking.id ?? payload.uid ?? "")
  const ownerId = process.env.DASHBOARD_OWNER_ID
  const admin = createSupabaseAdminClient()
  if (!admin || !ownerId || !bookingUid) return NextResponse.json({ error: "Booking storage is not configured." }, { status: 503 })
  const status = event.triggerEvent?.toLowerCase().includes("cancel") ? "Cancelled" : event.triggerEvent?.toLowerCase().includes("resched") ? "Rescheduled" : "Confirmed"
  const { error } = await admin.from("bookings").upsert({ owner_id: ownerId, booking_uid: bookingUid, status, guest_name: String(guest.name ?? responseValue("name") ?? "") || null, guest_email: String(guest.email ?? responseValue("email") ?? "") || null, guest_timezone: String(guest.timeZone ?? guest.timezone ?? "") || null, event_title: String(booking.title ?? eventType.title ?? payload.eventTitle ?? "Project discovery call") || null, start_time: String(booking.startTime ?? "") || null, end_time: String(booking.endTime ?? "") || null, location: String(booking.location ?? "") || null, notes: responseValue("notes") || responseValue("message") || null, payload, updated_at: new Date().toISOString() }, { onConflict: "booking_uid" })
  if (error) return NextResponse.json({ error: "Could not save booking." }, { status: 500 })
  const guestLabel = String(guest.name ?? guest.email ?? "A visitor")
  if (status === "Confirmed") await recordDashboardNotification({ workspaceOwnerId: ownerId, title: "New booking received", message: `${guestLabel} booked a project discovery call.`, kind: "success", href: "/dashboard/bookings", category: "bookings" })
  if (status === "Cancelled") await recordDashboardNotification({ workspaceOwnerId: ownerId, title: "Booking cancelled", message: `${guestLabel}'s project discovery call was cancelled.`, kind: "warning", href: "/dashboard/bookings", category: "bookings" })
  if (status === "Rescheduled") await recordDashboardNotification({ workspaceOwnerId: ownerId, title: "Booking rescheduled", message: `${guestLabel}'s project discovery call was rescheduled.`, kind: "info", href: "/dashboard/bookings", category: "bookings" })
  return NextResponse.json({ ok: true })
}

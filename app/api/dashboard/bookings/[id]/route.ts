import { NextResponse } from "next/server"
import { getDashboardMembership } from "@/lib/dashboard-access"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

const allowedStatuses = new Set(["Confirmed", "Cancelled", "Rescheduled"])

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 })
  const supabase = await createSupabaseServerClient()
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 })
  const membership = await getDashboardMembership()
  const ownerId = membership?.workspaceOwnerId ?? user.id
  const body = await request.json().catch(() => ({})) as { status?: string }
  if (!body.status || !allowedStatuses.has(body.status)) return NextResponse.json({ error: "Invalid booking status." }, { status: 400 })
  const { id } = await params
  const { data, error } = await supabase.from("bookings").update({ status: body.status, updated_at: new Date().toISOString() }).eq("id", id).eq("owner_id", ownerId).select("id,status").single()
  if (error) return NextResponse.json({ error: "Could not update booking." }, { status: 500 })
  return NextResponse.json({ booking: data })
}

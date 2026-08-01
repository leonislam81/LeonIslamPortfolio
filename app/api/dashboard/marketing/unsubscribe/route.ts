import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return NextResponse.json({ error: "Dashboard is not configured." }, { status: 503 })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json().catch(() => null) as { id?: string } | null
  if (!body?.id) return NextResponse.json({ error: "Missing contact." }, { status: 400 })
  const { error } = await supabase.from("audit_leads").update({ marketing_consent: false, marketing_unsubscribed_at: new Date().toISOString() }).eq("id", body.id).eq("owner_id", user.id)
  if (error) return NextResponse.json({ error: "Could not unsubscribe contact." }, { status: 500 })
  return NextResponse.json({ ok: true })
}

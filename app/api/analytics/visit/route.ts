import { createHash } from "crypto"
import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { visitorId?: string; path?: string; referrer?: string } | null
  if (!body?.visitorId || !body.path || body.path.startsWith("/dashboard")) return NextResponse.json({ ok: true })
  const admin = createSupabaseAdminClient()
  if (!admin) return NextResponse.json({ ok: true })
  const visitorKey = createHash("sha256").update(body.visitorId).digest("hex")
  await admin.from("site_visits").insert({ visitor_key: visitorKey, path: body.path.slice(0, 300), referrer: body.referrer?.slice(0, 500) || null })
  return NextResponse.json({ ok: true })
}

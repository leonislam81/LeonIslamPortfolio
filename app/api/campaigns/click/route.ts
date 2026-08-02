import { NextResponse } from "next/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const id = params.get("id")
  const target = params.get("url")
  let destination = "https://leonislam.com"
  try {
    const url = new URL(target ?? destination)
    if (url.protocol === "http:" || url.protocol === "https:") destination = url.toString()
  } catch {}
  const admin = createSupabaseAdminClient()
  if (admin && id) {
    const { data } = await admin.from("email_campaigns").select("click_count").eq("id", id).maybeSingle()
    if (data) await admin.from("email_campaigns").update({ click_count: (data.click_count ?? 0) + 1, last_clicked_at: new Date().toISOString() }).eq("id", id)
  }
  return NextResponse.redirect(destination)
}

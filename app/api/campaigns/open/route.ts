import { createSupabaseAdminClient } from "@/lib/supabase/admin"

const pixel = Uint8Array.from([71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 0, 0, 0, 255, 255, 255, 33, 249, 4, 1, 0, 0, 0, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 68, 1, 0, 59])

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id")
  const admin = createSupabaseAdminClient()
  if (admin && id) {
    const { data } = await admin.from("email_campaigns").select("open_count").eq("id", id).maybeSingle()
    if (data) await admin.from("email_campaigns").update({ open_count: (data.open_count ?? 0) + 1, last_opened_at: new Date().toISOString() }).eq("id", id)
  }
  return new Response(pixel, { headers: { "Content-Type": "image/gif", "Cache-Control": "no-store, no-cache, must-revalidate" } })
}

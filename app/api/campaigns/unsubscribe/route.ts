import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase()
  const admin = createSupabaseAdminClient()
  if (admin && email) await admin.from("audit_leads").update({ marketing_consent: false, marketing_unsubscribed_at: new Date().toISOString() }).eq("email", email)
  const content = email ? `<h1 style="margin:0 0 12px">You’re unsubscribed</h1><p style="margin:0;line-height:1.6;color:#52657c">You will no longer receive marketing updates from Leon Islam.</p>` : `<h1 style="margin:0 0 12px">Unsubscribe</h1><p style="margin:0;line-height:1.6;color:#52657c">Enter your email to stop receiving marketing updates.</p><form method="post" style="margin-top:24px"><input name="email" type="email" required placeholder="you@example.com" style="width:80%;padding:12px;border:1px solid #cbd5e1;border-radius:8px"><button style="display:block;margin:16px auto 0;padding:12px 18px;border:0;border-radius:8px;background:#0f6b8f;color:#fff;font-weight:700">Unsubscribe</button></form>`
  return new Response(`<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#10233f"><main style="max-width:520px;margin:15vh auto;padding:32px;text-align:center;background:#fff;border:1px solid #e2e8f0;border-radius:20px">${content}<a href="https://leonislam.com" style="display:inline-block;margin-top:24px;color:#0f6b8f;font-weight:700">Return to leonislam.com</a></main></body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } })
}

export async function POST(request: Request) {
  const form = await request.formData()
  const email = String(form.get("email") ?? "").trim().toLowerCase()
  const admin = createSupabaseAdminClient()
  if (admin && email) await admin.from("audit_leads").update({ marketing_consent: false, marketing_unsubscribed_at: new Date().toISOString() }).eq("email", email)
  return Response.redirect(new URL(`/api/campaigns/unsubscribe?email=${encodeURIComponent(email)}`, request.url))
}

import { NextResponse } from "next/server"
export async function POST(request: Request) {
  const { url } = await request.json().catch(() => ({}))
  let target: URL
  try { target = new URL(url); if (!/^https?:$/.test(target.protocol)) throw Error() } catch { return NextResponse.json({ error: "Enter a valid public website URL." }, { status: 400 }) }
  const key = process.env.PAGESPEED_API_KEY
  if (!key) return NextResponse.json({ error: "Audit service is not configured." }, { status: 503 })
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(target.href)}&strategy=mobile&category=PERFORMANCE&category=SEO&key=${encodeURIComponent(key)}`
  const response = await fetch(endpoint, { cache: "no-store" })
  if (!response.ok) return NextResponse.json({ error: "The website could not be audited right now." }, { status: 502 })
  const data = await response.json()
  const categories = data.lighthouseResult?.categories || {}
  return NextResponse.json({ url: target.href, performance: Math.round((categories.performance?.score || 0) * 100), seo: Math.round((categories.seo?.score || 0) * 100) })
}

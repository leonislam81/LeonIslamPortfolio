import { isIP } from "node:net"
import { lookup } from "node:dns/promises"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

type PageSpeedResult = {
  lighthouseResult?: {
    categories?: {
      performance?: { score?: number }
      seo?: { score?: number }
    }
  }
}

const retryableStatuses = new Set([429, 500, 502, 503, 504])

function isPrivateAddress(address: string) {
  if (isIP(address) === 4) {
    const [first, second] = address.split(".").map(Number)
    return first === 10 || first === 127 || first === 0 || first === 169 && second === 254 || first === 172 && second >= 16 && second <= 31 || first === 192 && second === 168
  }

  const value = address.toLowerCase()
  return value === "::1" || value === "::" || value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe80:")
}

async function isPublicHost(hostname: string) {
  if (hostname === "localhost" || hostname.endsWith(".localhost")) return false
  const addresses = await lookup(hostname, { all: true, verbatim: true })
  return addresses.length > 0 && addresses.every(({ address }) => !isPrivateAddress(address))
}

async function wait(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function runPageSpeed(target: URL, key: string) {
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(target.href)}&strategy=mobile&category=PERFORMANCE&category=SEO&key=${encodeURIComponent(key)}`

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(endpoint, { cache: "no-store", signal: AbortSignal.timeout(45_000) })
      if (response.ok) return await response.json() as PageSpeedResult
      if (!retryableStatuses.has(response.status) || attempt === 2) return null
    } catch {
      if (attempt === 2) return null
    }

    await wait(700 * (attempt + 1))
  }

  return null
}

function auditHtml(html: string) {
  const hasTitle = /<title\b[^>]*>[^<]+<\/title>/i.test(html)
  const hasDescription = /<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+|<meta\b[^>]*content=["'][^"']+["'][^>]*name=["']description["']/i.test(html)
  const hasViewport = /<meta\b[^>]*name=["']viewport["']/i.test(html)
  const hasCanonical = /<link\b[^>]*rel=["'][^"']*canonical[^"']*["']/i.test(html)
  const hasLanguage = /<html\b[^>]*\blang=["'][^"']+/i.test(html)
  const hasHeading = /<h1\b[^>]*>[^<]+/i.test(html)
  const title = html.match(/<title\b[^>]*>([^<]*)<\/title>/i)?.[1]?.trim()

  const signals = [hasTitle, hasDescription, hasViewport, hasCanonical, hasLanguage, hasHeading]
  return { seo: Math.round((signals.filter(Boolean).length / signals.length) * 100), title: title?.slice(0, 160) || null }
}

async function runFallbackAudit(target: URL) {
  let current = target
  const startedAt = performance.now()

  for (let redirect = 0; redirect < 5; redirect += 1) {
    if (!(await isPublicHost(current.hostname))) throw new Error("This address is not publicly reachable.")

    const response = await fetch(current, {
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
      headers: { "User-Agent": "LeonIslamAudit/1.0 (+https://leonislam.com)" },
    })

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location")
      if (!location) break
      current = new URL(location, current)
      if (!/^https?:$/.test(current.protocol)) break
      continue
    }

    const loadTime = Math.round(performance.now() - startedAt)
    const contentType = response.headers.get("content-type") || ""
    const html = contentType.includes("text/html") ? await response.text() : ""
    const { seo, title } = auditHtml(html.slice(0, 750_000))

    return { url: current.href, status: response.status, loadTime, seo, title }
  }

  throw new Error("The website redirected too many times or returned an unsupported response.")
}

export async function POST(request: Request) {
  const { url } = await request.json().catch(() => ({}))
  let target: URL

  try {
    target = new URL(url)
    if (!/^https?:$/.test(target.protocol) || !(await isPublicHost(target.hostname))) throw new Error()
  } catch {
    return NextResponse.json({ error: "Enter a valid public website URL." }, { status: 400 })
  }

  const key = process.env.PAGESPEED_API_KEY
  if (key) {
    const pageSpeed = await runPageSpeed(target, key)
    const categories = pageSpeed?.lighthouseResult?.categories

    if (categories?.performance?.score !== undefined && categories.seo?.score !== undefined) {
      return NextResponse.json({
        url: target.href,
        performance: Math.round(categories.performance.score * 100),
        seo: Math.round(categories.seo.score * 100),
        source: "pagespeed",
      })
    }
  }

  try {
    const fallback = await runFallbackAudit(target)
    return NextResponse.json({
      ...fallback,
      source: "fallback",
      notice: "Google PageSpeed was temporarily unavailable, so this is a direct website availability and SEO check.",
    })
  } catch {
    return NextResponse.json({ error: "This website could not be reached for an audit. It may be private, protected, or temporarily unavailable." }, { status: 502 })
  }
}

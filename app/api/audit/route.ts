import { isIP } from "node:net"
import { lookup } from "node:dns/promises"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

type LighthouseAudits = Record<string, {
  score?: number | null
  displayValue?: string
}>

type PageSpeedResult = {
  lighthouseResult?: {
    categories?: {
      performance?: { score?: number }
      seo?: { score?: number }
    }
    audits?: LighthouseAudits
  }
}

type AuditFinding = {
  category: "Performance" | "SEO" | "Technical"
  priority: "high" | "medium" | "low"
  title: string
  detail: string
  action: string
}

type AuditMetric = {
  label: string
  value: string
  score?: number | null
}

type AuditCheck = {
  label: string
  status: "pass" | "attention"
  detail: string
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

async function runPageSpeed(target: URL, key: string, attempts = 3, timeout = 45_000) {
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(target.href)}&strategy=mobile&category=PERFORMANCE&category=SEO&key=${encodeURIComponent(key)}`

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      // Keep a recent successful report for the same URL. This avoids losing useful
      // PageSpeed detail when Google's service briefly rate-limits or times out.
      const response = await fetch(endpoint, { next: { revalidate: 21_600 }, signal: AbortSignal.timeout(timeout) })
      if (response.ok) return await response.json() as PageSpeedResult
      if (!retryableStatuses.has(response.status) || attempt === attempts - 1) return null
    } catch {
      if (attempt === attempts - 1) return null
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
  const hasOpenGraphTitle = /<meta\b[^>]*(?:property|name)=["']og:title["']/i.test(html)
  const hasOpenGraphDescription = /<meta\b[^>]*(?:property|name)=["']og:description["']/i.test(html)
  const hasOpenGraphImage = /<meta\b[^>]*(?:property|name)=["']og:image["']/i.test(html)
  const hasFavicon = /<link\b[^>]*rel=["'][^"']*(?:icon|shortcut icon)[^"']*["']/i.test(html)
  const hasStructuredData = /<script\b[^>]*type=["']application\/ld\+json["']/i.test(html)
  const hasContactPath = /href=["'](?:mailto:|tel:)|href=["'][^"']*\/contact|whatsapp|contact\s+us/i.test(html)
  const hasBookingPath = /book\s+(?:a\s+)?(?:call|consultation|appointment)|schedule\s+(?:a\s+)?(?:call|consultation)|calendly|href=["'][^"']*\/(?:book|booking)/i.test(html)
  const callToActionCount = html.match(/(?:get started|contact us|book now|book a call|request (?:a )?quote|free consultation|schedule a call|buy now|shop now|start a project)/gi)?.length ?? 0
  const trustSignalCount = html.match(/(?:testimonial|testimonials|review|reviews|trusted by|case stud(?:y|ies)|client logo|google rating|years of experience)/gi)?.length ?? 0
  const title = html.match(/<title\b[^>]*>([^<]*)<\/title>/i)?.[1]?.trim()
  const pageText = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")
  const wordCount = pageText.match(/[\p{L}\p{N}][\p{L}\p{N}'-]*/gu)?.length ?? 0

  const signals = [hasTitle, hasDescription, hasViewport, hasCanonical, hasLanguage, hasHeading]
  return {
    seo: Math.round((signals.filter(Boolean).length / signals.length) * 100),
    title: title?.slice(0, 160) || null,
    checks: { hasTitle, hasDescription, hasViewport, hasCanonical, hasLanguage, hasHeading, hasOpenGraphTitle, hasOpenGraphDescription, hasOpenGraphImage, hasFavicon, hasStructuredData, hasContactPath, hasBookingPath, callToActionCount, trustSignalCount, wordCount },
  }
}

function priorityFor(score: number | null | undefined, threshold = 0.5): AuditFinding["priority"] {
  if (score === null || score === undefined || score < threshold) return "high"
  return "medium"
}

function buildPageSpeedFindings(audits: LighthouseAudits | undefined) {
  const findings: AuditFinding[] = []
  const addIfFailing = (id: string, category: AuditFinding["category"], title: string, detail: string, action: string, threshold = 0.9) => {
    const audit = audits?.[id]
    if (!audit || audit.score === undefined || audit.score === null || audit.score >= threshold) return
    findings.push({ category, priority: priorityFor(audit.score), title, detail: audit.displayValue ? `${detail} Current result: ${audit.displayValue}.` : detail, action })
  }

  addIfFailing("largest-contentful-paint", "Performance", "Main content loads too slowly", "The largest visible page element takes longer than recommended to appear.", "Optimise the hero image, reduce server work, and preload the main visual.")
  addIfFailing("total-blocking-time", "Performance", "The page is slow to respond", "JavaScript is keeping the browser busy during the first visit.", "Remove unused scripts and delay non-essential widgets until after the page is interactive.")
  addIfFailing("cumulative-layout-shift", "Performance", "Elements move while the page loads", "Layout movement can make visitors tap the wrong item or lose their place.", "Set image and embed dimensions, and reserve space for banners, fonts, and dynamic content.")
  addIfFailing("render-blocking-resources", "Performance", "Files delay the first render", "Some stylesheets or scripts are holding back the first visible content.", "Inline critical styles and defer non-critical CSS and JavaScript.")
  addIfFailing("uses-optimized-images", "Performance", "Images are heavier than needed", "Page images could be delivered in a more efficient size or format.", "Compress large images and serve correctly sized WebP or AVIF versions.")
  addIfFailing("unused-javascript", "Performance", "Unused JavaScript adds weight", "Visitors download code that is not needed for the initial page.", "Remove unused packages and code-split features that are not needed above the fold.")
  addIfFailing("errors-in-console", "Technical", "Browser errors were detected", "PageSpeed found messages in the browser console that may indicate a broken interaction or third-party script problem.", "Check the browser console and fix the affected script before it impacts visitors.", 1)

  addIfFailing("document-title", "SEO", "The page title needs attention", "Search engines need a clear, unique title to understand the page topic.", "Write a concise, keyword-focused page title that matches the visitor's intent.", 1)
  addIfFailing("meta-description", "SEO", "The meta description is missing or weak", "A useful description can improve how the page is presented in search results.", "Add a specific 140–160 character description with the page value and a natural keyword.", 1)
  addIfFailing("link-text", "SEO", "Some links are not descriptive", "Generic link labels make navigation less clear for people and search engines.", "Replace labels such as “click here” or “learn more” with text that names the destination.", 1)
  addIfFailing("image-alt", "SEO", "Some images need alt text", "Missing image descriptions reduce accessibility and image-search context.", "Add short, accurate alt text to meaningful images; leave decorative images empty.", 1)
  addIfFailing("heading-order", "SEO", "Heading structure needs review", "Headings should describe a clear content hierarchy.", "Use one relevant H1 and organise supporting sections with logical H2 and H3 headings.", 1)

  return findings.slice(0, 6)
}

function buildPageSpeedMetrics(audits: LighthouseAudits | undefined): AuditMetric[] {
  const metrics: Array<[string, string]> = [
    ["first-contentful-paint", "First content"],
    ["largest-contentful-paint", "Largest content"],
    ["total-blocking-time", "Response delay"],
    ["cumulative-layout-shift", "Layout shift"],
    ["speed-index", "Visual speed"],
  ]

  return metrics.flatMap(([id, label]) => {
    const audit = audits?.[id]
    return audit?.displayValue ? [{ label, value: audit.displayValue, score: audit.score }] : []
  })
}

function buildPageSpeedChecks(audits: LighthouseAudits | undefined): AuditCheck[] {
  const checks: Array<[string, string, string]> = [
    ["is-on-https", "Secure connection", "The page should be served over HTTPS."],
    ["is-crawlable", "Search crawl access", "Search engines should be allowed to crawl this page."],
    ["robots-txt", "Robots instructions", "Robots.txt should not block important page resources."],
    ["canonical", "Preferred page URL", "A canonical URL helps search engines identify the preferred version."],
    ["font-size", "Mobile text size", "Text should be comfortable to read on a small screen."],
    ["tap-targets", "Mobile tap targets", "Buttons and links should be easy to tap on a phone."],
    ["content-width", "Mobile content width", "Page content should fit a small screen without horizontal scrolling."],
  ]

  return checks.flatMap(([id, label, detail]) => {
    const score = audits?.[id]?.score
    return score === undefined || score === null ? [] : [{ label, detail, status: score >= 0.9 ? "pass" as const : "attention" as const }]
  })
}

function buildContentChecks(checks: ReturnType<typeof auditHtml>["checks"]): AuditCheck[] {
  const socialReady = checks.hasOpenGraphTitle && checks.hasOpenGraphDescription && checks.hasOpenGraphImage
  return [
    { label: "Mobile viewport", status: checks.hasViewport ? "pass" : "attention", detail: "Add a responsive viewport meta tag so the page can size correctly on phones." },
    { label: "Social sharing preview", status: socialReady ? "pass" : "attention", detail: "Add Open Graph title, description, and image so links look professional when shared." },
    { label: "Favicon", status: checks.hasFavicon ? "pass" : "attention", detail: "Add a favicon so the site is recognisable in browser tabs and saved bookmarks." },
    { label: "Structured data", status: checks.hasStructuredData ? "pass" : "attention", detail: "Add relevant schema markup to help search engines understand the business and page content." },
    { label: "Page content depth", status: checks.wordCount >= 250 ? "pass" : "attention", detail: `Only about ${checks.wordCount} visible words were found. Add useful, original page copy that answers visitor questions.` },
  ]
}

function buildConversionChecks(checks: ReturnType<typeof auditHtml>["checks"]): AuditCheck[] {
  return [
    { label: "Clear main offer", status: checks.hasHeading && checks.wordCount >= 80 ? "pass" : "attention", detail: "Add a clear main heading and supporting copy that explains who the offer is for and why it matters." },
    { label: "Calls to action", status: checks.callToActionCount >= 2 ? "pass" : "attention", detail: "Add clear, repeated next steps such as booking, contacting, requesting a quote, or buying." },
    { label: "Contact path", status: checks.hasContactPath ? "pass" : "attention", detail: "Make a direct contact path easy to find with a contact page, phone number, email, or messaging link." },
    { label: "Booking path", status: checks.hasBookingPath ? "pass" : "attention", detail: "If calls or consultations drive business, add a direct booking action for ready visitors." },
    { label: "Trust signals", status: checks.trustSignalCount >= 2 ? "pass" : "attention", detail: "Add visible proof such as testimonials, reviews, results, client logos, or case studies near decision points." },
  ]
}

function buildFallbackFindings(checks: ReturnType<typeof auditHtml>["checks"]): AuditFinding[] {
  const missing: Array<[keyof typeof checks, string, string, string]> = [
    ["hasTitle", "The page title is missing", "Search engines and browser tabs need a clear page title.", "Add a unique, benefit-led title that describes the page topic."],
    ["hasDescription", "The meta description is missing", "Search results may not show a compelling summary of this page.", "Add a concise description that explains the offer and encourages the right visitor to click."],
    ["hasHeading", "The main page heading is missing", "Visitors and search engines need a clear primary topic for the page.", "Add one descriptive H1 that matches the page purpose and target search intent."],
    ["hasCanonical", "The canonical URL is missing", "Search engines may struggle to identify the preferred version of this page.", "Add a self-referencing canonical URL to reduce duplicate-content ambiguity."],
    ["hasLanguage", "The page language is not declared", "Screen readers and search engines use this setting to interpret the page correctly.", "Add the correct lang attribute to the HTML element."],
    ["hasViewport", "Mobile viewport settings are missing", "The page may not scale correctly on phones.", "Add a responsive viewport meta tag and test the layout on a small screen."],
  ]

  const seoFindings = missing.filter(([check]) => !checks[check]).map(([, title, detail, action]) => ({ category: "SEO" as const, priority: "high" as const, title, detail, action }))

  return [
    {
      category: "Technical" as const,
      priority: "medium" as const,
      title: "Detailed PageSpeed data is temporarily unavailable",
      detail: "The site is reachable, but Google did not return the full mobile performance diagnostic for this check.",
      action: "Run the audit again shortly for the complete performance breakdown. The availability and SEO checks below are still valid.",
    },
    ...seoFindings,
  ].slice(0, 6)
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
    const { seo, title, checks } = auditHtml(html.slice(0, 750_000))

    return { url: current.href, status: response.status, loadTime, seo, title, findings: buildFallbackFindings(checks), checks: buildContentChecks(checks), conversion: buildConversionChecks(checks) }
  }

  throw new Error("The website redirected too many times or returned an unsupported response.")
}

export async function POST(request: Request) {
  const { url, competitorUrl } = await request.json().catch(() => ({}))
  let target: URL
  let competitor: URL | null = null

  try {
    target = new URL(url)
    if (!/^https?:$/.test(target.protocol) || !(await isPublicHost(target.hostname))) throw new Error()
  } catch {
    return NextResponse.json({ error: "Enter a valid public website URL." }, { status: 400 })
  }

  if (typeof competitorUrl === "string" && competitorUrl.trim()) {
    try {
      competitor = new URL(competitorUrl)
      if (!/^https?:$/.test(competitor.protocol) || !(await isPublicHost(competitor.hostname))) throw new Error()
    } catch {
      return NextResponse.json({ error: "Enter a valid public competitor URL, or leave it blank." }, { status: 400 })
    }
  }

  const directAudit = runFallbackAudit(target).catch(() => null)

  const key = process.env.PAGESPEED_API_KEY
  const competitorPageSpeed = competitor && key ? runPageSpeed(competitor, key, 1, 25_000).catch(() => null) : null
  if (key) {
    const pageSpeed = await runPageSpeed(target, key)
    const lighthouse = pageSpeed?.lighthouseResult
    const categories = lighthouse?.categories

    if (categories?.performance?.score !== undefined && categories.seo?.score !== undefined) {
      const audits = lighthouse?.audits
      const direct = await directAudit
      const competitorResult = await competitorPageSpeed
      const competitorCategories = competitorResult?.lighthouseResult?.categories
      return NextResponse.json({
        url: target.href,
        performance: Math.round(categories.performance.score * 100),
        seo: Math.round(categories.seo.score * 100),
        source: "pagespeed",
        findings: buildPageSpeedFindings(audits),
        metrics: buildPageSpeedMetrics(audits),
        checks: [...buildPageSpeedChecks(audits), ...(direct?.checks ?? [])],
        conversion: direct?.conversion ?? [],
        competitor: competitorCategories?.performance?.score !== undefined && competitorCategories.seo?.score !== undefined ? {
          url: competitor?.href,
          performance: Math.round(competitorCategories.performance.score * 100),
          seo: Math.round(competitorCategories.seo.score * 100),
        } : undefined,
      })
    }
  }

  try {
    const fallback = await directAudit
    if (!fallback) throw new Error("Direct audit unavailable")
    return NextResponse.json({
      ...fallback,
      source: "fallback",
      notice: "Google PageSpeed was temporarily unavailable, so this is a direct website availability and SEO check.",
    })
  } catch {
    return NextResponse.json({ error: "This website could not be reached for an audit. It may be private, protected, or temporarily unavailable." }, { status: 502 })
  }
}

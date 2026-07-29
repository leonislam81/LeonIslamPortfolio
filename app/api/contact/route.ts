import { NextResponse } from "next/server"
import { Resend } from "resend"

export const runtime = "nodejs"

const recipient = "info@leonislam.com"
const sender = "Leon Islam Website <info@leonislam.com>"

const projectChecklists: Record<string, { title: string; intro: string; items: string[] }> = {
  "Website management & updates": {
    title: "Website update checklist",
    intro: "A few details below will help me scope website updates accurately and get started faster.",
    items: [
      "List the pages, sections, or links that need to be updated.",
      "Share the final text, images, files, and brand assets you would like used.",
      "Note any deadlines, launches, promotions, or pages that need priority.",
      "Include your website URL and, when appropriate, the access method you use.",
      "Point out examples of the style, layout, or functionality you want to match.",
    ],
  },
  "E-commerce product listings": {
    title: "Product listing checklist",
    intro: "These details help create accurate, consistent product listings across your store.",
    items: [
      "Prepare product titles, SKUs, prices, stock quantities, and categories.",
      "Provide clear product images and any preferred image order.",
      "Share descriptions, specifications, variations, sizes, colours, and dimensions.",
      "Confirm shipping, tax, and product-status information if it needs updating.",
      "Send a sample product or listing style you want the new entries to follow.",
    ],
  },
  "Amazon product listing support": {
    title: "Amazon listing checklist",
    intro: "Gathering these items first helps make Amazon catalog work more accurate and efficient.",
    items: [
      "Share the ASIN, SKU, product title, and the marketplace you are targeting.",
      "Provide product images, key features, descriptions, and search terms where available.",
      "Include variation details such as size, colour, pack count, or parent-child relationships.",
      "Confirm whether this is a new listing, an existing listing update, or a catalogue fix.",
      "Highlight any policy notices, suppressed listings, or errors you want addressed.",
    ],
  },
  "Data entry & admin support": {
    title: "Data and admin support checklist",
    intro: "A clear starting brief helps organise recurring admin work and protect accuracy from day one.",
    items: [
      "Describe the task outcome you need and how often the work repeats.",
      "Share the source files, spreadsheets, websites, or systems involved.",
      "Explain the format you want for the completed work and any required fields.",
      "Mention validation rules, naming conventions, deadlines, and priority tasks.",
      "Provide one completed example or a simple reference that shows the expected result.",
    ],
  },
  "Something else": {
    title: "Project preparation checklist",
    intro: "A little context up front helps me understand your request and suggest the best next step.",
    items: [
      "Briefly describe the outcome you want to achieve.",
      "Share the relevant website, files, links, or tools involved.",
      "List the most important tasks in priority order.",
      "Let me know your timeline and any fixed deadline.",
      "Include an example, reference, or existing process if one is available.",
    ],
  },
}

type ContactPayload = {
  name?: unknown
  email?: unknown
  message?: unknown
  service?: unknown
  timeline?: unknown
  platform?: unknown
  websiteUrl?: unknown
  budget?: unknown
  turnstileToken?: unknown
  sendChecklist?: unknown
  honeypot?: unknown
  audit?: unknown
  businessGoal?: unknown
}

type AuditFinding = {
  category: "Performance" | "SEO" | "Technical"
  priority: "high" | "medium" | "low"
  title: string
  detail: string
  action: string
}

type AuditCheck = {
  label: string
  status: "pass" | "attention"
  detail: string
}

type AuditReport = {
  url: string
  source: "pagespeed" | "fallback"
  performance?: number
  seo: number
  status?: number
  loadTime?: number
  findings: AuditFinding[]
  checks: AuditCheck[]
  conversion: AuditCheck[]
}

const auditGoals = ["More leads", "More sales", "More bookings", "More search traffic"] as const
type AuditGoal = typeof auditGoals[number]

function isText(value: unknown): value is string {
  return typeof value === "string"
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'\"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character)
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function score(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100 ? Math.round(value) : undefined
}

function auditText(value: unknown, maximum = 280) {
  return isText(value) ? value.trim().slice(0, maximum) : ""
}

function parseAudit(value: unknown): AuditReport | null {
  if (!isRecord(value)) return null
  const url = auditText(value.url, 2_000)
  const source = value.source === "pagespeed" || value.source === "fallback" ? value.source : null
  const seo = score(value.seo)

  try {
    const parsed = new URL(url)
    if (!source || seo === undefined || !/^https?:$/.test(parsed.protocol)) return null
  } catch {
    return null
  }

  const findings = Array.isArray(value.findings) ? value.findings.slice(0, 6).flatMap((item): AuditFinding[] => {
    if (!isRecord(item) || !(item.category === "Performance" || item.category === "SEO" || item.category === "Technical") || !(item.priority === "high" || item.priority === "medium" || item.priority === "low")) return []
    const title = auditText(item.title, 120)
    const detail = auditText(item.detail)
    const action = auditText(item.action)
    return title && detail && action ? [{ category: item.category, priority: item.priority, title, detail, action }] : []
  }) : []

  const checks = Array.isArray(value.checks) ? value.checks.slice(0, 12).flatMap((item): AuditCheck[] => {
    if (!isRecord(item) || !(item.status === "pass" || item.status === "attention")) return []
    const label = auditText(item.label, 80)
    const detail = auditText(item.detail, 180)
    return label && detail ? [{ label, detail, status: item.status }] : []
  }) : []

  const conversion = Array.isArray(value.conversion) ? value.conversion.slice(0, 6).flatMap((item): AuditCheck[] => {
    if (!isRecord(item) || !(item.status === "pass" || item.status === "attention")) return []
    const label = auditText(item.label, 80)
    const detail = auditText(item.detail, 180)
    return label && detail ? [{ label, detail, status: item.status }] : []
  }) : []

  return { url, source, seo, performance: score(value.performance), status: score(value.status), loadTime: score(value.loadTime), findings, checks, conversion }
}

async function verifyTurnstile(token: string, request: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token || token.length > 2048) return false

  const remoteIp = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  const body = new FormData()
  body.append("secret", secret)
  body.append("response", token)
  if (remoteIp) body.append("remoteip", remoteIp)

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    })
    const result = await response.json() as { success?: boolean; action?: string }
    return response.ok && result.success === true && result.action === "contact"
  } catch (error) {
    console.error("Turnstile verification error", error)
    return false
  }
}

function createChecklistEmail(name: string, service: string) {
  const checklist = projectChecklists[service] ?? projectChecklists["Something else"]
  const items = checklist.items.map((item) => `<li style="margin: 0 0 12px;">${escapeHtml(item)}</li>`).join("")

  return `
    <div style="margin:0 auto;max-width:640px;padding:32px 20px;font-family:Arial,sans-serif;color:#10233f;line-height:1.6;">
      <p style="margin:0 0 16px;color:#0f6b8f;font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:12px;">Leon Islam</p>
      <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">${escapeHtml(checklist.title)}</h1>
      <p>Hi ${escapeHtml(name)},</p>
      <p>Thanks for your enquiry about <strong>${escapeHtml(service)}</strong>. ${escapeHtml(checklist.intro)}</p>
      <div style="margin:24px 0;padding:24px;border:1px solid #cfe0ed;border-radius:16px;background:#f7fbff;">
        <ol style="margin:0;padding-left:20px;">${items}</ol>
      </div>
      <p>You do not need to have everything ready. Send what you have, and I&apos;ll help you identify the most useful next step.</p>
      <p style="margin-top:24px;">Best regards,<br /><strong>Leon Islam</strong><br /><a style="color:#0f6b8f;" href="mailto:info@leonislam.com">info@leonislam.com</a></p>
    </div>
  `
}

function createConfirmationEmail(name: string, service: string, timeline: string) {
  return `
    <div style="margin:0 auto;max-width:640px;padding:32px 20px;font-family:Arial,sans-serif;color:#10233f;line-height:1.6;">
      <p style="margin:0 0 16px;color:#0f6b8f;font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:12px;">Leon Islam</p>
      <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Your enquiry is received</h1>
      <p>Hi ${escapeHtml(name)},</p>
      <p>Thanks for getting in touch about <strong>${escapeHtml(service)}</strong>. Your request has been received and will be reviewed carefully.</p>
      <div style="margin:24px 0;padding:20px 24px;border:1px solid #cfe0ed;border-radius:16px;background:#f7fbff;">
        <p style="margin:0 0 8px;"><strong>Support needed:</strong> ${escapeHtml(service)}</p>
        <p style="margin:0;"><strong>Preferred timeline:</strong> ${escapeHtml(timeline)}</p>
      </div>
      <p>You can expect a practical next step within <strong>2&ndash;4 business hours</strong>. If your request is time-sensitive, reply to this email with the deadline and any relevant details.</p>
      <p style="margin-top:24px;">Best regards,<br /><strong>Leon Islam</strong><br /><a style="color:#0f6b8f;" href="https://leonislam.com">leonislam.com</a></p>
    </div>
  `
}

function createAuditReportEmail(name: string, audit: AuditReport, businessGoal: AuditGoal | null) {
  const goalAdvice: Record<AuditGoal, string> = {
    "More leads": "Prioritise a clear service promise, a visible contact action, and trust signals near the first call to action.",
    "More sales": "Prioritise fast product pages, clear benefits, useful proof, and a low-friction route from product discovery to checkout.",
    "More bookings": "Prioritise a clear booking value, availability expectations, and a single prominent booking action on mobile.",
    "More search traffic": "Prioritise one search intent per important page, helpful original content, descriptive headings, and strong internal links.",
  }
  const scoreCards = audit.source === "pagespeed"
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;border-collapse:separate;border-spacing:12px 0;"><tr><td style="width:50%;padding:20px;border:1px solid #cfe0ed;border-radius:14px;background:#f7fbff;"><p style="margin:0;color:#52657c;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">Mobile performance</p><p style="margin:8px 0 0;font-size:32px;font-weight:700;color:#10233f;">${audit.performance ?? "—"}<span style="font-size:14px;">/100</span></p></td><td style="width:50%;padding:20px;border:1px solid #cfe0ed;border-radius:14px;background:#f7fbff;"><p style="margin:0;color:#52657c;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">SEO essentials</p><p style="margin:8px 0 0;font-size:32px;font-weight:700;color:#10233f;">${audit.seo}<span style="font-size:14px;">/100</span></p></td></tr></table>`
    : `<div style="margin:24px 0;padding:20px;border:1px solid #cfe0ed;border-radius:14px;background:#f7fbff;"><p style="margin:0 0 8px;font-weight:700;">Website availability and SEO snapshot</p><p style="margin:0;">The public website responded with HTTP ${audit.status ?? "—"}. SEO essentials score: <strong>${audit.seo}/100</strong>.</p></div>`

  const findings = audit.findings.length
    ? audit.findings.map((finding) => `<div style="margin:0 0 14px;padding:18px;border:1px solid #dbe6ef;border-radius:12px;"><p style="margin:0 0 6px;color:#0f6b8f;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;">${escapeHtml(finding.category)} · ${escapeHtml(finding.priority)} priority</p><p style="margin:0 0 7px;font-weight:700;">${escapeHtml(finding.title)}</p><p style="margin:0 0 8px;color:#40536a;">${escapeHtml(finding.detail)}</p><p style="margin:0;color:#10233f;"><strong>Recommended fix:</strong> ${escapeHtml(finding.action)}</p></div>`).join("")
    : `<div style="padding:18px;border:1px solid #b7e4c7;border-radius:12px;background:#f2fff6;"><strong>No major automated issues were flagged.</strong> A manual review can still reveal content, trust, and conversion improvements.</div>`

  const healthChecks = audit.checks.length ? `<h2 style="margin:30px 0 12px;font-size:20px;">Website health checks</h2><ul style="margin:0;padding-left:20px;color:#40536a;">${audit.checks.map((check) => `<li style="margin-bottom:8px;"><strong>${escapeHtml(check.label)}:</strong> ${check.status === "pass" ? "Looks good in this check." : escapeHtml(check.detail)}</li>`).join("")}</ul>` : ""
  const conversionChecks = audit.conversion.length ? `<h2 style="margin:30px 0 12px;font-size:20px;">Conversion snapshot</h2><ul style="margin:0;padding-left:20px;color:#40536a;">${audit.conversion.map((check) => `<li style="margin-bottom:8px;"><strong>${escapeHtml(check.label)}:</strong> ${check.status === "pass" ? "Signal detected on the page." : escapeHtml(check.detail)}</li>`).join("")}</ul>` : ""

  return `
    <div style="margin:0 auto;max-width:640px;padding:32px 20px;font-family:Arial,sans-serif;color:#10233f;line-height:1.6;">
      <p style="margin:0 0 16px;color:#0f6b8f;font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:12px;">Leon Islam · Free website audit</p>
      <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Your website improvement report</h1>
      <p>Hi ${escapeHtml(name)},</p>
      <p>Here is the snapshot for <a style="color:#0f6b8f;word-break:break-all;" href="${escapeHtml(audit.url)}">${escapeHtml(audit.url)}</a>. It is based on a public mobile performance and SEO check.</p>
      ${scoreCards}
      <h2 style="margin:30px 0 12px;font-size:20px;">Where the audit found opportunities</h2>
      ${findings}
      ${healthChecks}
      ${conversionChecks}
      <h2 style="margin:30px 0 12px;font-size:20px;">Design and conversion ideas to review</h2>
      <ul style="margin:0;padding-left:20px;color:#40536a;"><li style="margin-bottom:8px;">Make the main offer and the next action obvious in the first screen, especially on mobile.</li><li style="margin-bottom:8px;">Use proof near key calls to action: reviews, results, client logos, guarantees, or concise case studies.</li><li style="margin-bottom:8px;">Give each important service page one clear search intent, a focused heading, useful supporting copy, and a relevant call to action.</li></ul>
      ${businessGoal ? `<div style="margin:24px 0;padding:18px;border:1px solid #b8d9ed;border-radius:12px;background:#f2faff;"><p style="margin:0 0 7px;font-weight:700;">Your goal: ${escapeHtml(businessGoal)}</p><p style="margin:0;color:#40536a;">${escapeHtml(goalAdvice[businessGoal])}</p></div>` : ""}
      <div style="margin:28px 0;padding:20px 24px;border-radius:14px;background:#10233f;color:#ffffff;"><p style="margin:0 0 8px;font-weight:700;font-size:18px;">Want a focused action plan?</p><p style="margin:0;color:#dbeafe;">Reply with your main business goal — more leads, sales, bookings, or search traffic — and I&apos;ll suggest the highest-value first improvements.</p></div>
      <p style="font-size:13px;color:#60738a;">This is an automated public-page snapshot. It highlights likely issues, but it does not test every page, login area, form flow, or browser/device combination.</p>
      <p style="margin-top:24px;">Best regards,<br /><strong>Leon Islam</strong><br /><a style="color:#0f6b8f;" href="https://leonislam.com">leonislam.com</a></p>
    </div>
  `
}

type LeadRecord = {
  name: string
  email: string
  service: string
  timeline: string
  platform: string
  websiteUrl: string
  budget: string
  message: string
  businessGoal: string
}

async function appendLeadToGoogleSheet(lead: LeadRecord) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET

  if (!webhookUrl || !webhookSecret) return false

  try {
    const url = new URL(webhookUrl)
    if (url.protocol !== "https:") {
      console.error("Google Sheets webhook must use HTTPS")
      return false
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: webhookSecret,
        lead: {
          receivedAt: new Date().toISOString(),
          ...lead,
          source: "Website quote form",
          status: "New",
        },
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Google Sheets webhook error", response.status)
      return false
    }

    return true
  } catch (error) {
    console.error("Google Sheets webhook request failed", error)
    return false
  }
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email service is not configured." }, { status: 503 })
  }

  let payload: ContactPayload

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const name = isText(payload.name) ? payload.name.trim() : ""
  const email = isText(payload.email) ? payload.email.trim() : ""
  const message = isText(payload.message) ? payload.message.trim() : ""
  const service = isText(payload.service) ? payload.service.trim() : ""
  const timeline = isText(payload.timeline) ? payload.timeline.trim() : "Not specified"
  const platform = isText(payload.platform) ? payload.platform.trim() : "Not specified"
  const websiteUrl = isText(payload.websiteUrl) ? payload.websiteUrl.trim() : "Not provided"
  const budget = isText(payload.budget) ? payload.budget.trim() : "Not specified"
  const turnstileToken = isText(payload.turnstileToken) ? payload.turnstileToken.trim() : ""
  const sendChecklist = payload.sendChecklist === true
  const audit = parseAudit(payload.audit)
  const businessGoal = auditGoals.includes(payload.businessGoal as AuditGoal) ? payload.businessGoal as AuditGoal : null

  // Bots fill the hidden field. Return success to avoid helping them tune attacks.
  if (isText(payload.honeypot) && payload.honeypot.trim()) {
    return NextResponse.json({ ok: true })
  }

  if (!name || !isValidEmail(email) || message.length < 10 || !service) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 })
  }

  if (!(await verifyTurnstile(turnstileToken, request))) {
    return NextResponse.json({ error: "Please complete the security check and try again." }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />")

  const { error: enquiryError } = await resend.emails.send({
    from: sender,
    to: [recipient],
    replyTo: email,
    subject: audit ? `New free website audit lead: ${audit.url}` : `New website enquiry: ${service}`,
    html: `
      <h1>New website enquiry</h1>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Service:</strong> ${escapeHtml(service)}</p>
      <p><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>
      <p><strong>Platform or tool:</strong> ${escapeHtml(platform)}</p>
      <p><strong>Website, store, or file link:</strong> ${escapeHtml(websiteUrl)}</p>
      <p><strong>Estimated budget:</strong> ${escapeHtml(budget)}</p>
      <p><strong>Project checklist requested:</strong> ${sendChecklist ? "Yes" : "No"}</p>
      ${audit ? `<p><strong>Audit source:</strong> ${escapeHtml(audit.source)}</p><p><strong>Performance:</strong> ${audit.performance ?? "Not available"}/100</p><p><strong>SEO:</strong> ${audit.seo}/100</p><p><strong>Priority findings:</strong> ${audit.findings.length}</p>` : ""}
      ${businessGoal ? `<p><strong>Business goal:</strong> ${escapeHtml(businessGoal)}</p>` : ""}
      <hr />
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
  })

  if (enquiryError) {
    console.error("Resend contact form error", enquiryError)
    return NextResponse.json({ error: "Unable to send your message." }, { status: 502 })
  }

  const leadTracked = await appendLeadToGoogleSheet({
    name,
    email,
    service,
    timeline,
    platform,
    websiteUrl,
    budget,
    message,
    businessGoal: businessGoal ?? "Not specified",
  })

  let confirmationSent = false
  const { error: confirmationError } = await resend.emails.send({
    from: sender,
    to: [email],
    replyTo: recipient,
    subject: audit ? `Your website audit: ${audit.findings.length ? `${audit.findings.length} priority improvements` : "your results"}` : "Your enquiry has been received",
    html: audit ? createAuditReportEmail(name, audit, businessGoal) : createConfirmationEmail(name, service, timeline),
  })

  if (confirmationError) {
    console.error("Resend enquiry confirmation error", confirmationError)
    return NextResponse.json({ error: "We received your request, but could not deliver the report email. Please check the address and try again." }, { status: 502 })
  }

  confirmationSent = true

  let checklistSent = false

  if (sendChecklist) {
    const { error: checklistError } = await resend.emails.send({
      from: sender,
      to: [email],
      replyTo: recipient,
      subject: `Your ${projectChecklists[service]?.title ?? "project preparation checklist"}`,
      html: createChecklistEmail(name, service),
    })

    if (checklistError) {
      console.error("Resend project checklist error", checklistError)
    } else {
      checklistSent = true
    }
  }

  return NextResponse.json({ ok: true, checklistSent, confirmationSent, leadTracked })
}

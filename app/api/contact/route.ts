import { NextResponse } from "next/server"
import { Resend } from "resend"

export const runtime = "nodejs"

const recipient = "leonislam810@gmail.com"
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
  sendChecklist?: unknown
  honeypot?: unknown
}

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
  const sendChecklist = payload.sendChecklist === true

  // Bots fill the hidden field. Return success to avoid helping them tune attacks.
  if (isText(payload.honeypot) && payload.honeypot.trim()) {
    return NextResponse.json({ ok: true })
  }

  if (!name || !isValidEmail(email) || message.length < 10 || !service) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />")

  const { error: enquiryError } = await resend.emails.send({
    from: sender,
    to: [recipient],
    replyTo: email,
    subject: `New website enquiry: ${service}`,
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
      <hr />
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
  })

  if (enquiryError) {
    console.error("Resend contact form error", enquiryError)
    return NextResponse.json({ error: "Unable to send your message." }, { status: 502 })
  }

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
      return NextResponse.json({ error: "Your message was sent, but the checklist could not be delivered." }, { status: 502 })
    }
  }

  return NextResponse.json({ ok: true, checklistSent: sendChecklist })
}

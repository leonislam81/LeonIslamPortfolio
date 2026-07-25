import { NextResponse } from "next/server"
import { Resend } from "resend"

export const runtime = "nodejs"

const recipient = "leonislam810@gmail.com"
const sender = "Leon Islam Website <info@leonislam.com>"

type ContactPayload = {
  name?: unknown
  email?: unknown
  message?: unknown
  service?: unknown
  timeline?: unknown
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

  const { error } = await resend.emails.send({
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
      <p><strong>Project checklist requested:</strong> ${sendChecklist ? "Yes" : "No"}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
  })

  if (error) {
    console.error("Resend contact form error", error)
    return NextResponse.json({ error: "Unable to send your message." }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}

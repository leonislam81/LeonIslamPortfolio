"use client"

import { useState } from "react"
import { Copy, Mail, Send } from "lucide-react"
import { LeadEmailScheduler } from "@/components/lead-email-scheduler"
import { LeadOrganization } from "@/components/lead-organization"

type Template = "follow-up" | "re-audit"
const copy = {
  "follow-up": { title: "Audit follow-up", subject: "A quick follow-up on your website audit", body: "I wanted to follow up on the website audit I sent. If you share your main goal—more leads, sales, bookings, or search traffic—I can suggest the best first improvement." },
  "re-audit": { title: "Re-audit reminder", subject: "Ready for a fresh audit of your website?", body: "You asked to revisit your website audit. If you have made updates, reply when you are ready and I will send an updated snapshot with the next highest-impact opportunities." },
} as const

export function LeadEmailTemplates({ leadId, websiteUrl, email }: { leadId: string; websiteUrl: string; email: string }) {
  const [template, setTemplate] = useState<Template>("follow-up")
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const active = copy[template]
  const copyText = async () => { await navigator.clipboard.writeText(`Subject: ${active.subject}\n\nHi,\n\n${active.body}\n\nBest regards,\nLeon Islam`); setState("idle") }
  const send = async () => { setState("sending"); const response = await fetch("/api/dashboard/send-follow-up", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId, template }) }); setState(response.ok ? "sent" : "error") }
  return <><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start gap-3"><Mail className="mt-0.5 size-5 text-sky-700" /><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Follow-up templates</p><h2 className="mt-2 text-xl font-bold">Ready-to-send email</h2><p className="mt-2 text-sm leading-6 text-slate-600">Send to {email} or copy the text to personalise it first.</p></div></div><div className="mt-5 flex gap-2"><button type="button" onClick={() => { setTemplate("follow-up"); setState("idle") }} className={`rounded-lg px-3 py-2 text-sm font-semibold ${template === "follow-up" ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-700"}`}>Follow-up</button><button type="button" onClick={() => { setTemplate("re-audit"); setState("idle") }} className={`rounded-lg px-3 py-2 text-sm font-semibold ${template === "re-audit" ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-700"}`}>Re-audit</button></div><div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><p className="font-bold text-slate-950">{active.subject}</p><p className="mt-3">Hi,</p><p className="mt-2">{active.body}</p><p className="mt-2 text-xs text-slate-500">The sent version automatically includes the audit link for {websiteUrl} and any private note saved for this lead.</p></div><div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={copyText} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><Copy className="size-4" />Copy text</button><button type="button" onClick={send} disabled={state === "sending"} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:opacity-60"><Send className="size-4" />{state === "sending" ? "Sending..." : "Send email"}</button>{state === "sent" && <p className="self-center text-sm font-medium text-emerald-700">Email sent.</p>}{state === "error" && <p className="self-center text-sm font-medium text-rose-700">Could not send. Please try again.</p>}</div></section><LeadOrganization leadId={leadId} /><LeadEmailScheduler leadId={leadId} /></>
}

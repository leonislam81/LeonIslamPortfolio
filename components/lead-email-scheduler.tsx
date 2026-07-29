"use client"

import { useState } from "react"
import { CalendarClock } from "lucide-react"

export function LeadEmailScheduler({ leadId }: { leadId: string }) {
  const [template, setTemplate] = useState<"follow-up" | "re-audit">("follow-up")
  const [scheduledFor, setScheduledFor] = useState("")
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const schedule = async () => { setState("saving"); const response = await fetch("/api/dashboard/schedule-follow-up", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId, template, scheduledFor }) }); setState(response.ok ? "saved" : "error") }
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex gap-3"><CalendarClock className="mt-0.5 size-5 text-sky-700" /><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Schedule email</p><h2 className="mt-2 text-xl font-bold">Send later</h2><p className="mt-2 text-sm leading-6 text-slate-600">The email will be sent by the daily scheduler after this date and time.</p></div></div><div className="mt-5 grid gap-3"><select value={template} onChange={(event) => { setTemplate(event.target.value as "follow-up" | "re-audit"); setState("idle") }} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium"><option value="follow-up">Audit follow-up</option><option value="re-audit">Re-audit reminder</option></select><input type="datetime-local" value={scheduledFor} onChange={(event) => { setScheduledFor(event.target.value); setState("idle") }} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm" /></div><div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={!scheduledFor || state === "saving"} onClick={schedule} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white disabled:opacity-60"><CalendarClock className="size-4" />{state === "saving" ? "Scheduling..." : "Schedule email"}</button>{state === "saved" && <p className="self-center text-sm font-medium text-emerald-700">Scheduled and added to the calendar.</p>}{state === "error" && <p className="self-center text-sm font-medium text-rose-700">Could not schedule. Run the scheduling SQL first.</p>}</div></section>
}

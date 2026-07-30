"use client"

import { Check, CircleX, Rocket } from "lucide-react"
import { useEffect, useState } from "react"

const storageKey = "leon-islam-dashboard-onboarding"
const steps = [
  { label: "Run your own website audit", href: "/free-audit" },
  { label: "Review the Leads Inbox", href: "/dashboard/leads" },
  { label: "Set your follow-up timing", href: "/dashboard/settings" },
  { label: "Open Site Management", href: "/dashboard/site-management" },
]

export function DashboardOnboarding() {
  const [completed, setCompleted] = useState<string[]>([])
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)
    if (saved === "dismissed") setDismissed(true)
    else if (saved) setCompleted(JSON.parse(saved))
  }, [])

  const complete = (label: string) => {
    const next = completed.includes(label) ? completed : [...completed, label]
    setCompleted(next)
    window.localStorage.setItem(storageKey, JSON.stringify(next))
  }

  if (dismissed) return null
  const progress = Math.round((completed.length / steps.length) * 100)

  return <section className="mt-7 overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4 p-6"><div className="flex gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-700 text-white"><Rocket className="size-5" /></span><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Getting started</p><h2 className="mt-1 text-xl font-bold">Set up your admin workspace</h2><p className="mt-2 text-sm leading-6 text-slate-600">Complete these useful first steps. Your progress is saved in this browser.</p></div></div><button type="button" onClick={() => { setDismissed(true); window.localStorage.setItem(storageKey, "dismissed") }} className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-900" aria-label="Dismiss getting started"><CircleX className="size-5" /></button></div><div className="border-t border-sky-100 px-6 py-5"><div className="flex items-center justify-between text-sm"><span className="font-semibold text-slate-700">{completed.length} of {steps.length} complete</span><span className="font-bold text-sky-700">{progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-sky-100"><span className="block h-full rounded-full bg-sky-600 transition-all" style={{ width: `${progress}%` }} /></div><div className="mt-5 grid gap-2 sm:grid-cols-2">{steps.map((step) => { const done = completed.includes(step.label); return <a key={step.label} href={step.href} onClick={() => complete(step.label)} className="flex items-center gap-3 rounded-xl border border-sky-100 bg-white p-3 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-sky-50"><span className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${done ? "border-sky-700 bg-sky-700 text-white" : "border-slate-300"}`}>{done && <Check className="size-3.5" />}</span>{step.label}</a> })}</div></div></section>
}

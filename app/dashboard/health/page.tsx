import { Activity, ArrowLeft, ExternalLink, HeartPulse, ShieldCheck } from "lucide-react"
import { redirect } from "next/navigation"
import { DashboardSignOutButton } from "@/components/dashboard-sign-out-button"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

const checks = [
  ["Availability", "Confirm the public website responds quickly and reliably."],
  ["Mobile performance", "Track the visitor experience on slower mobile connections."],
  ["SEO essentials", "Review title, description, headings, language, and canonical signals."],
  ["Conversion journey", "Check that visitors can understand the offer and take the next step."],
]

export default async function HealthPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard")
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")
  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8"><div className="mx-auto max-w-6xl"><header className="flex flex-wrap items-end justify-between gap-5 border-b border-slate-200 pb-7"><div><a href="/dashboard/upcoming" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"><ArrowLeft className="size-4" />Upcoming features</a><div className="mt-5 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><HeartPulse className="size-5" /></span><div><p className="text-sm font-bold uppercase tracking-[.16em] text-emerald-700">Site health monitor</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Health checks</h1></div></div><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">Run the existing audit from one place today. Scheduled monitoring and history are planned next.</p></div><DashboardSignOutButton /></header><section className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-2xl bg-slate-950 p-7 text-white shadow-sm"><Activity className="size-6 text-emerald-300" /><p className="mt-5 text-sm font-bold uppercase tracking-[.14em] text-emerald-300">Start a check</p><h2 className="mt-2 text-2xl font-bold">See what visitors experience.</h2><p className="mt-3 text-sm leading-6 text-slate-300">Run a fresh mobile-first audit for any public URL and save the report to Leads Inbox when you need a detailed follow-up.</p><a href="/free-audit" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950">Run free audit <ExternalLink className="size-4" /></a></div><div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><ShieldCheck className="size-6 text-sky-700" /><h2 className="mt-4 text-xl font-bold">What will be monitored</h2><div className="mt-5 space-y-4">{checks.map(([title, description]) => <div key={title} className="flex gap-3"><span className="mt-1 size-2 shrink-0 rounded-full bg-emerald-500" /><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-sm leading-5 text-slate-600">{description}</p></div></div>)}</div></div></section></div></main>
}

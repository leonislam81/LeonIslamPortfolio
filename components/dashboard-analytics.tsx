"use client"

import { BarChart3, TrendingUp } from "lucide-react"
import type { DashboardLead } from "@/components/dashboard-lead-list"

export function DashboardAnalytics({ leads }: { leads: DashboardLead[] }) {
  const won = leads.filter((lead) => lead.status === "Won").length
  const conversion = leads.length ? Math.round((won / leads.length) * 100) : 0
  const current = new Date().getMonth()
  const thisMonth = leads.filter((lead) => new Date(lead.created_at).getMonth() === current)
  const average = (key: "performance" | "seo") => { const values = thisMonth.map((lead) => lead[key]).filter((value): value is number => typeof value === "number"); return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : "—" }
  const views = [["all", "All leads"], ["high", "High priority"], ["follow-up", "Needs follow-up"], ["won", "Won leads"]]
  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center gap-3"><BarChart3 className="size-5 text-sky-700" /><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Dashboard analytics</p><h2 className="mt-1 text-xl font-bold">Lead and score trends</h2></div></div><div className="mt-5 flex flex-wrap gap-2">{views.map(([key, label]) => <a key={key} href={key === "all" ? "/dashboard" : `/dashboard?view=${key}`} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800">{label}</a>)}</div><div className="mt-6 grid gap-4 sm:grid-cols-3"><article className="rounded-xl border border-slate-200 p-5"><p className="text-sm font-semibold text-slate-600">This month&apos;s audits</p><p className="mt-2 text-3xl font-bold">{thisMonth.length}</p></article><article className="rounded-xl bg-slate-950 p-5 text-white"><TrendingUp className="size-5 text-sky-300" /><p className="mt-3 text-sm font-semibold text-sky-100">Lead conversion</p><p className="mt-1 text-3xl font-bold">{conversion}%</p></article><article className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"><p className="text-sm font-semibold text-emerald-900">Current averages</p><p className="mt-2 text-lg font-bold text-emerald-950">Mobile {average("performance")} · SEO {average("seo")}</p></article></div></section>
}

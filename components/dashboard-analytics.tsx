"use client"

import { BarChart3, CheckCircle2, TrendingUp } from "lucide-react"
import type { DashboardLead } from "@/components/dashboard-lead-list"

type MonthMetric = { key: string; label: string; leads: number; performance: number | null; seo: number | null }

function monthKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` }
function average(values: Array<number | null>) { const items = values.filter((value): value is number => typeof value === "number"); return items.length ? Math.round(items.reduce((total, value) => total + value, 0) / items.length) : null }

export function DashboardAnalytics({ leads }: { leads: DashboardLead[] }) {
  const now = new Date()
  const months: MonthMetric[] = Array.from({ length: 6 }, (_, index) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    const key = monthKey(month)
    const matching = leads.filter((lead) => monthKey(new Date(lead.created_at)) === key)
    return { key, label: month.toLocaleDateString("en-US", { month: "short" }), leads: matching.length, performance: average(matching.map((lead) => lead.performance)), seo: average(matching.map((lead) => lead.seo)) }
  })
  const maximum = Math.max(...months.map((month) => month.leads), 1)
  const won = leads.filter((lead) => lead.status === "Won").length
  const active = leads.filter((lead) => ["New", "Report sent", "Contacted", "In progress"].includes(lead.status) || lead.status.startsWith("Report sent")).length
  const conversion = leads.length ? Math.round((won / leads.length) * 100) : 0
  const current = months.at(-1)

  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center gap-2"><BarChart3 className="size-5 text-sky-700" /><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Dashboard analytics</p><h2 className="mt-1 text-xl font-bold">Lead and score trends</h2></div><p className="ml-auto text-xs text-slate-500">Last six months</p></div><div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-xl border border-slate-200 p-5"><div className="flex items-center justify-between"><h3 className="font-bold">Audit volume</h3><span className="text-sm text-slate-500">{current?.leads ?? 0} this month</span></div><div className="mt-6 flex h-36 items-end gap-3">{months.map((month) => <div key={month.key} className="flex h-full min-w-0 flex-1 flex-col justify-end"><div className="flex min-h-7 items-end justify-center text-xs font-bold text-sky-800">{month.leads || ""}</div><div className="min-h-1 rounded-t-md bg-sky-600 transition-all" style={{ height: `${Math.max((month.leads / maximum) * 100, month.leads ? 8 : 2)}%` }} /><p className="mt-2 text-center text-xs text-slate-500">{month.label}</p></div>)}</div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><article className="rounded-xl bg-slate-950 p-5 text-white"><TrendingUp className="size-5 text-sky-300" /><p className="mt-4 text-sm font-semibold text-sky-100">Lead conversion</p><p className="mt-1 text-3xl font-bold">{conversion}%</p><p className="mt-2 text-sm text-slate-300">{won} won · {active} active</p></article><article className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"><CheckCircle2 className="size-5 text-emerald-700" /><p className="mt-4 text-sm font-semibold text-emerald-900">Current averages</p><p className="mt-1 text-lg font-bold text-emerald-950">Mobile {current?.performance ?? "—"} · SEO {current?.seo ?? "—"}</p><p className="mt-2 text-sm text-emerald-800">Based on audits received this month.</p></article></div></div><div className="mt-6 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-[.1em] text-slate-500"><tr><th className="pb-3 font-semibold">Month</th><th className="pb-3 font-semibold">Audits</th><th className="pb-3 font-semibold">Avg. mobile</th><th className="pb-3 font-semibold">Avg. SEO</th></tr></thead><tbody>{months.map((month) => <tr key={month.key} className="border-b border-slate-100"><td className="py-3 font-semibold">{month.label}</td><td className="py-3">{month.leads}</td><td className="py-3">{month.performance ?? "—"}</td><td className="py-3">{month.seo ?? "—"}</td></tr>)}</tbody></table></div></section>
}

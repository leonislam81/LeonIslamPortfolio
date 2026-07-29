import { BarChart3, Target, TrendingUp } from "lucide-react"
import type { DashboardLead } from "@/components/dashboard-lead-list"

function withinDays(date: string, start: Date, end: Date) {
  const value = new Date(date)
  return value >= start && value < end
}

export function DashboardMonthlyReport({ leads }: { leads: DashboardLead[] }) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastThirty = new Date(today)
  lastThirty.setDate(today.getDate() - 30)
  const previousThirty = new Date(lastThirty)
  previousThirty.setDate(lastThirty.getDate() - 30)
  const currentLeads = leads.filter((lead) => withinDays(lead.created_at, lastThirty, today)).length
  const previousLeads = leads.filter((lead) => withinDays(lead.created_at, previousThirty, lastThirty)).length
  const change = previousLeads ? Math.round(((currentLeads - previousLeads) / previousLeads) * 100) : currentLeads ? 100 : 0
  const won = leads.filter((lead) => lead.status === "Won")
  const conversion = leads.length ? Math.round((won.length / leads.length) * 100) : 0
  const pipeline = [
    ["New", leads.filter((lead) => lead.status === "New").length, "bg-amber-400"],
    ["Contacted", leads.filter((lead) => lead.status === "Contacted").length, "bg-sky-500"],
    ["Won", won.length, "bg-emerald-500"],
    ["Other", leads.filter((lead) => !["New", "Contacted", "Won"].includes(lead.status)).length, "bg-slate-400"],
  ] as const
  const total = Math.max(leads.length, 1)
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    const next = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    return { label: date.toLocaleDateString(undefined, { month: "short" }), count: leads.filter((lead) => withinDays(lead.created_at, date, next)).length }
  })
  const peak = Math.max(...months.map((month) => month.count), 1)

  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><BarChart3 className="size-5" /></span><div><p className="text-sm font-bold uppercase tracking-[.14em] text-violet-700">Business reporting</p><h2 className="mt-1 text-xl font-bold">Monthly progress snapshot</h2></div></div><p className="text-sm text-slate-500">Based on your saved audit leads.</p></div><div className="mt-6 grid gap-4 lg:grid-cols-[.9fr_1.1fr]"><div className="grid gap-4 sm:grid-cols-2"><article className="rounded-xl bg-slate-950 p-5 text-white"><TrendingUp className="size-5 text-sky-300" /><p className="mt-3 text-sm font-semibold text-sky-100">Leads in last 30 days</p><p className="mt-1 text-3xl font-bold">{currentLeads}</p><p className="mt-2 text-xs text-slate-300">{change >= 0 ? "+" : ""}{change}% compared with the previous 30 days</p></article><article className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"><Target className="size-5 text-emerald-700" /><p className="mt-3 text-sm font-semibold text-emerald-900">Lead conversion</p><p className="mt-1 text-3xl font-bold text-emerald-950">{conversion}%</p><p className="mt-2 text-xs text-emerald-800">{won.length} won lead{won.length === 1 ? "" : "s"} from {leads.length} total</p></article></div><div className="rounded-xl border border-slate-200 p-5"><p className="text-sm font-bold">Pipeline breakdown</p><div className="mt-4 space-y-3">{pipeline.map(([label, count, color]) => <div key={label}><div className="flex items-center justify-between text-sm"><span className="font-medium text-slate-700">{label}</span><span className="font-bold">{count}</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100"><span className={`block h-full rounded-full ${color}`} style={{ width: `${Math.round((count / total) * 100)}%` }} /></div></div>)}</div></div></div><div className="mt-6 rounded-xl border border-slate-200 p-5"><div className="flex items-center justify-between"><p className="text-sm font-bold">Six-month lead trend</p><p className="text-xs text-slate-500">New audit submissions</p></div><div className="mt-5 flex h-32 items-end gap-3">{months.map((month) => <div key={month.label} className="flex h-full min-w-0 flex-1 flex-col justify-end"><span className="mb-2 text-center text-xs font-bold text-slate-600">{month.count}</span><span className="block min-h-1 rounded-t-md bg-sky-600 transition-all" style={{ height: `${Math.max(4, Math.round((month.count / peak) * 100))}%` }} /><span className="mt-2 text-center text-xs font-medium text-slate-500">{month.label}</span></div>)}</div></div></section>
}

import { BellRing, CalendarClock, CircleAlert, FolderKanban, UsersRound } from "lucide-react"
import type { DashboardLead } from "@/components/dashboard-lead-list"

type Project = { id: string; title: string; due_date: string | null; status: string }

function keyForDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function DashboardNotificationCenter({ leads, projects }: { leads: DashboardLead[]; projects: Project[] }) {
  const todayDate = new Date()
  const today = keyForDate(todayDate)
  const weekDate = new Date(todayDate)
  weekDate.setDate(todayDate.getDate() + 7)
  const week = keyForDate(weekDate)
  const overdueLeads = leads.filter((lead) => (lead.follow_up_at && lead.follow_up_at < today) || (lead.re_audit_at && lead.re_audit_at < today))
  const dueLeads = leads.filter((lead) => (lead.follow_up_at && lead.follow_up_at >= today && lead.follow_up_at <= week) || (lead.re_audit_at && lead.re_audit_at >= today && lead.re_audit_at <= week))
  const highPriority = leads.filter((lead) => lead.priority === "high" && !["Won", "Not a fit"].includes(lead.status))
  const activeProjects = projects.filter((project) => project.status !== "Completed")
  const overdueProjects = activeProjects.filter((project) => project.due_date && project.due_date < today)
  const dueProjects = activeProjects.filter((project) => project.due_date && project.due_date >= today && project.due_date <= week)
  const items = [
    { count: overdueLeads.length, label: "Overdue lead follow-ups", description: "These conversations need attention now.", href: "/dashboard?view=follow-up", icon: CircleAlert, tone: "border-rose-200 bg-rose-50 text-rose-900" },
    { count: dueLeads.length, label: "Lead actions due this week", description: "Follow-ups or re-audits scheduled in the next seven days.", href: "/dashboard?view=follow-up", icon: CalendarClock, tone: "border-amber-200 bg-amber-50 text-amber-950" },
    { count: highPriority.length, label: "High-priority leads", description: "Prioritised opportunities that are still open.", href: "/dashboard?view=high", icon: UsersRound, tone: "border-sky-200 bg-sky-50 text-sky-950" },
    { count: overdueProjects.length + dueProjects.length, label: "Project deadlines", description: `${overdueProjects.length} overdue and ${dueProjects.length} due this week.`, href: "/dashboard/projects", icon: FolderKanban, tone: "border-violet-200 bg-violet-50 text-violet-950" },
  ].filter((item) => item.count > 0)

  return <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-end justify-between gap-3"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-slate-950 text-white"><BellRing className="size-5" /></span><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Attention center</p><h2 className="mt-1 text-xl font-bold">What needs your attention</h2></div></div><span className={`rounded-full px-3 py-1.5 text-sm font-bold ${items.length ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800"}`}>{items.length ? `${items.length} active alerts` : "All caught up"}</span></div>{items.length ? <div className="mt-5 grid gap-3 md:grid-cols-2">{items.map((item) => { const Icon = item.icon; return <a key={item.label} href={item.href} className={`group rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-sm ${item.tone}`}><div className="flex items-start gap-3"><Icon className="mt-0.5 size-5 shrink-0" /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="font-bold">{item.label}</p><span className="rounded-full bg-white/70 px-2.5 py-1 text-sm font-bold">{item.count}</span></div><p className="mt-1 text-sm leading-5 opacity-80">{item.description}</p><span className="mt-3 inline-block text-sm font-bold underline-offset-2 group-hover:underline">Review now →</span></div></div></a> })}</div> : <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-900">No overdue follow-ups, urgent leads, or upcoming project deadlines were found. Your current workload is under control.</div>}</section>
}

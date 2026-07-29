import { CalendarClock, CheckCircle2, CircleDollarSign, FolderKanban, Sparkles, UsersRound } from "lucide-react"

const views = [
  { href: "/dashboard?view=follow-up", label: "Follow-up queue", description: "Leads due now or soon", icon: CalendarClock, tone: "bg-amber-100 text-amber-800" },
  { href: "/dashboard?view=high", label: "High-priority leads", description: "Focus opportunities first", icon: Sparkles, tone: "bg-rose-100 text-rose-800" },
  { href: "/dashboard?view=won", label: "Won leads", description: "Review conversion outcomes", icon: CircleDollarSign, tone: "bg-emerald-100 text-emerald-800" },
  { href: "/dashboard/leads", label: "All lead records", description: "Search every enquiry", icon: UsersRound, tone: "bg-sky-100 text-sky-800" },
  { href: "/dashboard/projects", label: "Active projects", description: "Track delivery and tasks", icon: FolderKanban, tone: "bg-violet-100 text-violet-800" },
  { href: "/dashboard/site-management", label: "Site operations", description: "Website maintenance work", icon: CheckCircle2, tone: "bg-cyan-100 text-cyan-800" },
]

export function DashboardSavedViews() {
  return <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Saved views</p><h2 className="mt-1 text-xl font-bold">Your most-used work queues</h2></div><p className="text-sm text-slate-500">Shortcuts for daily operations.</p></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{views.map((view) => { const Icon = view.icon; return <a key={view.label} href={view.href} className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${view.tone}`}><Icon className="size-5" /></span><span className="min-w-0"><span className="block font-bold text-slate-950 group-hover:text-sky-800">{view.label}</span><span className="mt-1 block text-sm text-slate-600">{view.description}</span></span></a> })}</div></section>
}

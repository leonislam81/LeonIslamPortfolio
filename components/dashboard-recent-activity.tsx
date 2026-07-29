import { ClipboardCheck, FolderKanban, Mail, NotebookPen } from "lucide-react"

type LeadActivity = { id: string; lead_id: string; activity_type: "status_changed" | "notes_saved" | "email_sent"; detail: string; created_at: string }
type Project = { id: string; title: string; client_name: string; created_at: string }

const styles = {
  status_changed: { icon: ClipboardCheck, label: "Lead status updated", tone: "bg-sky-100 text-sky-700" },
  notes_saved: { icon: NotebookPen, label: "Lead workspace updated", tone: "bg-violet-100 text-violet-700" },
  email_sent: { icon: Mail, label: "Follow-up email sent", tone: "bg-emerald-100 text-emerald-700" },
}

export function DashboardRecentActivity({ activities, projects }: { activities: LeadActivity[]; projects: Project[] }) {
  const entries = [
    ...activities.map((activity) => ({ id: `lead-${activity.id}`, kind: "lead" as const, date: activity.created_at, title: styles[activity.activity_type].label, detail: activity.detail, href: `/dashboard/leads/${activity.lead_id}`, activityType: activity.activity_type })),
    ...projects.map((project) => ({ id: `project-${project.id}`, kind: "project" as const, date: project.created_at, title: "Project created", detail: `${project.title} · ${project.client_name}`, href: `/dashboard/projects/${project.id}` })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)

  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Recent activity</p><h2 className="mt-1 text-xl font-bold">What changed recently</h2></div><p className="text-sm text-slate-500">Latest lead and project work.</p></div>{entries.length ? <ol className="mt-5 divide-y divide-slate-100">{entries.map((entry) => { const config = entry.kind === "project" ? { icon: FolderKanban, tone: "bg-amber-100 text-amber-700" } : styles[entry.activityType]; const Icon = config.icon; return <li key={entry.id}><a href={entry.href} className="flex gap-3 py-4 transition first:pt-0 last:pb-0 hover:bg-sky-50"><span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${config.tone}`}><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-950">{entry.title}</span><span className="mt-1 block line-clamp-2 text-sm leading-5 text-slate-600">{entry.detail}</span><span className="mt-1.5 block text-xs text-slate-400">{new Date(entry.date).toLocaleString()}</span></span></a></li> })}</ol> : <p className="mt-5 rounded-xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">Activity will appear here as you update leads, send follow-ups, and create projects.</p>}</section>
}

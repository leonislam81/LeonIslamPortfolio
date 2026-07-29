import { ClipboardCheck, Mail, NotebookPen } from "lucide-react"

type Activity = { id: string; activity_type: "status_changed" | "notes_saved" | "email_sent"; detail: string; created_at: string }

const activityStyle = {
  status_changed: { icon: ClipboardCheck, label: "Status updated", color: "text-sky-700 bg-sky-100" },
  notes_saved: { icon: NotebookPen, label: "Workspace updated", color: "text-violet-700 bg-violet-100" },
  email_sent: { icon: Mail, label: "Email sent", color: "text-emerald-700 bg-emerald-100" },
}

export function LeadActivityHistory({ activities }: { activities: Activity[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Activity history</p><h2 className="mt-2 text-xl font-bold">Lead timeline</h2></div>{activities.length > 0 && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{activities.length} events</span>}</div>
      {activities.length ? <ol className="mt-5 space-y-0">{activities.map((activity, index) => { const style = activityStyle[activity.activity_type]; const Icon = style.icon; return <li key={activity.id} className="relative flex gap-3 pb-5 last:pb-0">{index < activities.length - 1 && <span className="absolute left-[17px] top-9 h-[calc(100%-18px)] w-px bg-slate-200" />}<span className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ${style.color}`}><Icon className="size-4" /></span><div className="min-w-0"><p className="text-sm font-semibold">{style.label}</p><p className="mt-1 text-sm leading-6 text-slate-600">{activity.detail}</p><p className="mt-1 text-xs text-slate-400">{new Date(activity.created_at).toLocaleString()}</p></div></li> })}</ol> : <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">Activity will appear here after you update the lead, save workspace notes, or send an email.</p>}
    </section>
  )
}

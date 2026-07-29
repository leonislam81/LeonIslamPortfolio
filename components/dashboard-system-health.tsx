import { CheckCircle2, CircleAlert, Database, Mail, ScanSearch, TimerReset } from "lucide-react"

type Health = { ready: boolean; label: string; description: string; icon: typeof Database }

export function DashboardSystemHealth({ databaseReady, auditReady, emailReady, scheduleReady }: { databaseReady: boolean; auditReady: boolean; emailReady: boolean; scheduleReady: boolean }) {
  const checks: Health[] = [
    { ready: databaseReady, label: "Database", description: databaseReady ? "Lead, project, and dashboard data are available." : "Could not load dashboard records." , icon: Database },
    { ready: auditReady, label: "Audit service", description: auditReady ? "Google PageSpeed audit key is configured." : "Add the PageSpeed API key in your deployment settings.", icon: ScanSearch },
    { ready: emailReady, label: "Email delivery", description: emailReady ? "Report and follow-up email delivery is configured." : "Add the email provider key in your deployment settings.", icon: Mail },
    { ready: scheduleReady, label: "Follow-up schedule", description: scheduleReady ? "Scheduled follow-up processing is protected and ready." : "Add the cron secret for scheduled email processing.", icon: TimerReset },
  ]
  const readyCount = checks.filter((check) => check.ready).length
  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">System health</p><h2 className="mt-1 text-xl font-bold">Your admin tools at a glance</h2></div><span className={`rounded-full px-3 py-1.5 text-sm font-bold ${readyCount === checks.length ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>{readyCount}/{checks.length} services ready</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{checks.map((check) => { const Icon = check.icon; return <article key={check.label} className={`rounded-xl border p-4 ${check.ready ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50"}`}><div className="flex items-center justify-between gap-3"><span className={`flex size-9 items-center justify-center rounded-xl ${check.ready ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}><Icon className="size-4" /></span>{check.ready ? <CheckCircle2 className="size-5 text-emerald-600" /> : <CircleAlert className="size-5 text-amber-600" />}</div><p className="mt-4 font-bold">{check.label}</p><p className="mt-1 text-sm leading-5 text-slate-600">{check.description}</p></article> })}</div><p className="mt-5 text-xs text-slate-500">This checks configuration and dashboard access only. It does not expose or display private API keys.</p></section>
}

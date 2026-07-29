import { ArrowRight, CalendarDays, CheckCircle2, ClipboardList, Gauge, Users } from "lucide-react"
import { redirect } from "next/navigation"
import { DashboardSignOutButton } from "@/components/dashboard-sign-out-button"
import { LeadStatusSelect } from "@/components/lead-status-select"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

type AuditLead = {
  id: string
  website_url: string
  email: string
  status: string
  performance: number | null
  seo: number | null
  created_at: string
}

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) return <DashboardSetup />

  const supabase = await createSupabaseServerClient()
  if (!supabase) return <DashboardSetup />

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")

  const { data, error } = await supabase
    .from("audit_leads")
    .select("id, website_url, email, status, performance, seo, created_at")
    .order("created_at", { ascending: false })
    .limit(30)

  const leads = (data ?? []) as AuditLead[]
  const average = (key: "performance" | "seo") => {
    const values = leads.map((lead) => lead[key]).filter((value): value is number => typeof value === "number")
    return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null
  }

  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8">
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.16em] text-sky-700">Leon Islam admin</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Audit and lead dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Signed in as {user.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <DashboardSignOutButton />
          <a href="/free-audit" className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800">Open free audit <ArrowRight className="size-4" /></a>
        </div>
      </header>

      {error ? <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">The database connection is active, but the dashboard tables are not ready yet. Run the supplied Supabase schema, then refresh this page.</p> : <>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {[[Users, "Audit leads", leads.length], [Gauge, "Average mobile score", average("performance") === null ? "—" : `${average("performance")}/100`], [ClipboardList, "Average SEO score", average("seo") === null ? "—" : `${average("seo")}/100`]].map(([Icon, label, value]) => {
            const MetricIcon = Icon as typeof Users
            return <article key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><MetricIcon className="size-5 text-sky-700" /><p className="mt-4 text-sm font-semibold text-slate-600">{label as string}</p><p className="mt-2 text-3xl font-bold">{value as string | number}</p></article>
          })}
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-5"><CalendarDays className="size-5 text-sky-700" /><h2 className="font-bold">Recent audit leads</h2><p className="ml-auto text-xs text-slate-500">Update each lead status directly from this list.</p></div>
          {leads.length ? <div className="divide-y divide-slate-100">{leads.map((lead) => <div key={lead.id} className="grid gap-3 p-5 sm:grid-cols-[1.5fr_1fr_auto] sm:items-center"><div><p className="font-semibold">{lead.website_url}</p><p className="mt-1 text-sm text-slate-500">{lead.email} · {new Date(lead.created_at).toLocaleDateString()}</p></div><p className="text-sm text-slate-600">Performance {lead.performance ?? "—"} · SEO {lead.seo ?? "—"}</p><LeadStatusSelect leadId={lead.id} initialStatus={lead.status} /></div>)}</div> : <div className="p-8 text-sm leading-6 text-slate-600">No audit leads have been saved yet. Submit a report request from the free-audit page to see it here.</div>}
        </section>
      </>}
    </div>
  </main>
}

function DashboardSetup() {
  return <main className="min-h-screen bg-slate-50 px-5 py-16 text-slate-950 sm:px-8"><div className="mx-auto max-w-2xl rounded-3xl border border-sky-200 bg-white p-8 shadow-xl shadow-slate-900/5"><CheckCircle2 className="size-8 text-sky-700" /><p className="mt-5 text-sm font-bold uppercase tracking-[.16em] text-sky-700">Dashboard foundation ready</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Connect Supabase to activate your private dashboard.</h1><p className="mt-4 leading-7 text-slate-600">The login page, dashboard, and database schema are now in the project. Add the two public Supabase values to Vercel and run the schema in Supabase to activate them.</p><a href="/dashboard/login" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Open sign-in <ArrowRight className="size-4" /></a></div></main>
}

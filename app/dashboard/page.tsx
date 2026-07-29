import { ArrowRight, CheckCircle2 } from "lucide-react"
import { redirect } from "next/navigation"
import { DashboardExportButton } from "@/components/dashboard-export-button"
import { DashboardGlobalSearch } from "@/components/dashboard-global-search"
import { type DashboardLead } from "@/components/dashboard-lead-list"
import { DashboardOverviewContent } from "@/components/dashboard-overview-content"
import { DashboardOverviewPreferences } from "@/components/dashboard-overview-preferences"
import { DashboardSignOutButton } from "@/components/dashboard-sign-out-button"
import { defaultDashboardSections } from "@/lib/dashboard-overview"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) return <DashboardSetup />
  const supabase = await createSupabaseServerClient()
  if (!supabase) return <DashboardSetup />
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")

  const { data, error } = await supabase.from("audit_leads").select("id, website_url, email, status, priority, tags, deal_value, performance, seo, business_goal, created_at, follow_up_at, re_audit_at").order("created_at", { ascending: false }).limit(250)
  const leads = (data ?? []) as DashboardLead[]

  const [projectsResult, activityResult, preferenceResult] = await Promise.allSettled([
    supabase.from("projects").select("id, title, client_name, due_date, status, created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("audit_lead_activities").select("id, lead_id, activity_type, detail, created_at").order("created_at", { ascending: false }).limit(20),
    supabase.from("dashboard_settings").select("overview_sections").eq("owner_id", user.id).maybeSingle(),
  ])

  const projects = projectsResult.status === "fulfilled" ? projectsResult.value.data ?? [] : []
  const activities = activityResult.status === "fulfilled" ? activityResult.value.data ?? [] : []
  const storedSections = preferenceResult.status === "fulfilled" ? preferenceResult.value.data?.overview_sections : null
  const overviewSections = Array.isArray(storedSections) ? storedSections.filter((section): section is string => typeof section === "string") : defaultDashboardSections

  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8"><div className="mx-auto max-w-6xl"><header className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-sky-700">Leon Islam admin</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Admin overview</h1><p className="mt-2 text-sm text-slate-600">Your live business workspace. Signed in as {user.email}</p></div><div className="flex flex-wrap gap-3"><DashboardGlobalSearch /><DashboardOverviewPreferences initial={overviewSections} /><a href="/dashboard/settings" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">Settings</a><DashboardSignOutButton /><DashboardExportButton leads={leads} /><a href="/free-audit" className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800">Open free audit <ArrowRight className="size-4" /></a></div></header>{error ? <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">The database connection is active, but the dashboard tables are not ready yet. Run the supplied Supabase schema, then refresh this page.</p> : <DashboardOverviewContent leads={leads} projects={projects} activities={activities as Array<{ id: string; lead_id: string; activity_type: "status_changed" | "notes_saved" | "email_sent"; detail: string; created_at: string }>} sections={overviewSections} systemHealth={{ databaseReady: true, auditReady: Boolean(process.env.PAGESPEED_API_KEY), emailReady: Boolean(process.env.RESEND_API_KEY), scheduleReady: Boolean(process.env.CRON_SECRET) }} />}</div></main>
}

function DashboardSetup() {
  return <main className="min-h-screen bg-slate-50 px-5 py-16 text-slate-950 sm:px-8"><div className="mx-auto max-w-2xl rounded-3xl border border-sky-200 bg-white p-8 shadow-xl shadow-slate-900/5"><CheckCircle2 className="size-8 text-sky-700" /><p className="mt-5 text-sm font-bold uppercase tracking-[.16em] text-sky-700">Dashboard foundation ready</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Connect Supabase to activate your private dashboard.</h1><p className="mt-4 leading-7 text-slate-600">The login page, dashboard, and database schema are now in the project. Add the two public Supabase values to Vercel and run the schema in Supabase to activate them.</p><a href="/dashboard/login" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Open sign-in <ArrowRight className="size-4" /></a></div></main>
}

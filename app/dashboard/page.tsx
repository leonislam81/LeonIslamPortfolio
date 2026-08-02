import { ArrowRight, CalendarCheck2, CheckCircle2, Eye, Gauge, Users, UsersRound } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { DashboardAnalytics } from "@/components/dashboard-analytics"
import { DashboardCalendar } from "@/components/dashboard-calendar"
import { DashboardLeadList, type DashboardLead } from "@/components/dashboard-lead-list"
import { DashboardOnboarding } from "@/components/dashboard-onboarding"
import { DashboardSignOutButton } from "@/components/dashboard-sign-out-button"
import { DashboardVisitorAnalytics } from "@/components/dashboard-visitor-analytics"
import { DashboardWorkspaceHub } from "@/components/dashboard-workspace-hub"
import { getDashboardMembership } from "@/lib/dashboard-access"
import { getSiteAnalyticsSummary } from "@/lib/site-analytics"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) return <DashboardSetup />
  const supabase = await createSupabaseServerClient()
  if (!supabase) return <DashboardSetup />
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")
  const membership = await getDashboardMembership()
  const ownerId = membership?.workspaceOwnerId ?? user.id
  const [{ data, error }, { count: bookingCount }] = await Promise.all([
    supabase.from("audit_leads").select("id, website_url, email, status, priority, tags, deal_value, performance, seo, business_goal, created_at, follow_up_at, re_audit_at").order("created_at", { ascending: false }).limit(250),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("owner_id", ownerId).eq("status", "Confirmed"),
  ])
  const leads = (data ?? []) as DashboardLead[]
  const visitorSummary = await getSiteAnalyticsSummary()

  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8"><div className="mx-auto max-w-6xl"><header className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-sky-700">Leon Islam admin</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Business overview</h1><p className="mt-2 text-sm text-slate-600">Your visitors, enquiries, bookings, and active work in one place.</p></div><div className="flex flex-wrap gap-3"><a href="/dashboard/bookings" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"><CalendarCheck2 className="size-4" />Bookings</a><a href="/dashboard/settings" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Settings</a><DashboardSignOutButton /></div></header>{error ? <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">The database connection is active, but the dashboard tables are not ready yet. Run the supplied Supabase schema, then refresh this page.</p> : <><DashboardOnboarding /><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Metric icon={Users} label="Audit leads" value={leads.length} href="/dashboard/leads" /><Metric icon={CalendarCheck2} label="Confirmed bookings" value={bookingCount ?? 0} href="/dashboard/bookings" /><Metric icon={Eye} label="30-day visits" value={visitorSummary.visits} /><Metric icon={UsersRound} label="Unique visitors" value={visitorSummary.uniqueVisitors} /></div><DashboardVisitorAnalytics summary={visitorSummary} /><DashboardWorkspaceHub /><DashboardAnalytics leads={leads} /><DashboardCalendar leads={leads} /><DashboardLeadList leads={leads} /></>}</div></main>
}

function Metric({ icon: Icon, label, value, href }: { icon: LucideIcon; label: string; value: number; href?: string }) { const content = <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Icon className="size-5 text-sky-700" /><p className="mt-4 text-sm font-semibold text-slate-600">{label}</p><p className="mt-2 text-3xl font-bold">{value.toLocaleString()}</p></article>; return href ? <a href={href} className="block transition hover:-translate-y-0.5">{content}</a> : content }

function DashboardSetup() { return <main className="min-h-screen bg-slate-50 px-5 py-16 text-slate-950 sm:px-8"><div className="mx-auto max-w-2xl rounded-3xl border border-sky-200 bg-white p-8 shadow-xl shadow-slate-900/5"><CheckCircle2 className="size-8 text-sky-700" /><p className="mt-5 text-sm font-bold uppercase tracking-[.16em] text-sky-700">Dashboard foundation ready</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Connect Supabase to activate your private dashboard.</h1><p className="mt-4 leading-7 text-slate-600">The login page, dashboard, and database schema are now in the project. Add the two public Supabase values to Vercel and run the schema in Supabase to activate them.</p><a href="/dashboard/login" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Open sign-in <ArrowRight className="size-4" /></a></div></main> }

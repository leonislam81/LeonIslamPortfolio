import { Activity, ArrowLeft, History } from "lucide-react"
import { redirect } from "next/navigation"
import { DashboardSignOutButton } from "@/components/dashboard-sign-out-button"
import { getDashboardMembership } from "@/lib/dashboard-access"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

export default async function DashboardActivityPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard")
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")
  const membership = await getDashboardMembership()
  const { data } = await supabase.from("dashboard_activity_log").select("id,actor_email,action,entity_type,details,created_at").eq("workspace_owner_id", membership?.workspaceOwnerId ?? user.id).order("created_at", { ascending: false }).limit(100)
  const entries = data ?? []
  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8"><div className="mx-auto max-w-5xl"><header className="flex flex-wrap items-end justify-between gap-5 border-b border-slate-200 pb-7"><div><a href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700"><ArrowLeft className="size-4" />Overview</a><div className="mt-5 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><History className="size-5" /></span><div><p className="text-sm font-bold uppercase tracking-[.16em] text-violet-700">Workspace history</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Activity log</h1></div></div><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">A record of important user-access and campaign actions across this dashboard workspace.</p></div><DashboardSignOutButton /></header><section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-slate-200 p-5"><Activity className="size-5 text-violet-700" /><div><h2 className="font-bold">Recent activity</h2><p className="mt-1 text-sm text-slate-500">The latest 100 recorded actions.</p></div></div>{entries.length ? <div className="divide-y divide-slate-100">{entries.map((entry) => <article key={entry.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start"><span className="mt-1 hidden size-2 shrink-0 rounded-full bg-violet-500 sm:block" /><div className="min-w-0 flex-1"><p className="font-semibold">{entry.action}</p><p className="mt-1 text-sm text-slate-500">{entry.entity_type}{entry.actor_email ? ` · by ${entry.actor_email}` : ""}</p></div><time className="text-xs text-slate-400">{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.created_at))}</time></article>)}</div> : <div className="p-12 text-center"><History className="mx-auto size-8 text-slate-300" /><p className="mt-3 text-sm text-slate-500">No activity has been recorded yet.</p></div>}</section></div></main>
}

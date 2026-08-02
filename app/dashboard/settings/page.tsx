import { ArrowLeft, Clock3, Settings2 } from "lucide-react"
import { redirect } from "next/navigation"
import { DashboardSignOutButton } from "@/components/dashboard-sign-out-button"
import { DashboardWorkflowSettingsForm } from "@/components/dashboard-workflow-settings-form"
import { defaultDashboardWorkflowSettings, normaliseDashboardWorkflowSettings } from "@/lib/dashboard-workflow"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { getDashboardMembership } from "@/lib/dashboard-access"

export default async function DashboardSettingsPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard")
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")
  const membership = await getDashboardMembership()
  const { data } = await supabase.from("dashboard_settings").select("first_follow_up_days, re_audit_days").eq("owner_id", membership?.workspaceOwnerId ?? user.id).maybeSingle()
  const settings = data ? normaliseDashboardWorkflowSettings({ firstFollowUpDays: data.first_follow_up_days, reAuditDays: data.re_audit_days }) : defaultDashboardWorkflowSettings
  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8"><div className="mx-auto max-w-2xl"><header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-7"><div><a href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"><ArrowLeft className="size-4" />Back to dashboard</a><p className="mt-5 text-sm font-bold uppercase tracking-[.16em] text-sky-700">Dashboard settings</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Lead workflow timing</h1></div><DashboardSignOutButton /></header><div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white"><Settings2 className="size-6 text-sky-300" /><h2 className="mt-4 text-xl font-bold">Make the follow-up process yours.</h2><p className="mt-2 leading-7 text-slate-300">These values set the default dates stored when a new audit report is requested. Existing leads keep their current schedule.</p></div><DashboardWorkflowSettingsForm initial={settings} /><div className="mt-6 flex gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-5"><Clock3 className="mt-0.5 size-5 shrink-0 text-sky-700" /><p className="text-sm leading-6 text-sky-950">Current defaults: first follow-up after <strong>{settings.firstFollowUpDays} days</strong>, and a requested re-audit after <strong>{settings.reAuditDays} days</strong>.</p></div></div></main>
}

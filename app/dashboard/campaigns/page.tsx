import { ArrowLeft, Mail, Megaphone } from "lucide-react"
import { redirect } from "next/navigation"
import { DashboardSignOutButton } from "@/components/dashboard-sign-out-button"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { CampaignComposer } from "@/components/campaign-composer"

export default async function CampaignsPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard")
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")
  const { data } = await supabase.from("audit_leads").select("email").eq("marketing_consent", true).limit(500)
  const emails = Array.from(new Set((data ?? []).map((row) => row.email).filter(Boolean)))
  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8"><div className="mx-auto max-w-4xl"><header className="flex flex-wrap items-end justify-between gap-5 border-b border-slate-200 pb-7"><div><a href="/dashboard/marketing" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700"><ArrowLeft className="size-4" />Marketing audience</a><div className="mt-5 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Megaphone className="size-5" /></span><div><p className="text-sm font-bold uppercase tracking-[.16em] text-amber-700">Email campaigns</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Draft a campaign</h1></div></div><p className="mt-4 text-sm leading-6 text-slate-600">Only explicit marketing opt-ins are included. Review the message before sending.</p></div><DashboardSignOutButton /></header><section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><Mail className="size-5 text-sky-700" /><div><h2 className="font-bold">Permission-based recipients</h2><p className="mt-1 text-sm text-slate-500">{emails.length} opted-in contact{emails.length === 1 ? "" : "s"}</p></div></div><CampaignComposer emails={emails} /></section></div></main>
}

import { ArrowLeft, Inbox } from "lucide-react"
import { redirect } from "next/navigation"
import { DashboardSignOutButton } from "@/components/dashboard-sign-out-button"
import { LeadInbox } from "@/components/lead-inbox"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

export default async function LeadsInboxPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard")
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")
  const { data } = await supabase.from("audit_leads").select("id, lead_name, email, website_url, message, status, priority, lead_type, lead_source, marketing_consent, created_at").order("created_at", { ascending: false }).limit(250)
  const leads = (data ?? []) as Array<{ id: string; lead_name: string | null; email: string; website_url: string; message: string | null; status: string; priority: "high" | "normal" | "low"; lead_type: string | null; lead_source: string | null; marketing_consent: boolean; created_at: string }>
  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8"><div className="mx-auto max-w-6xl"><header className="flex flex-wrap items-end justify-between gap-5 border-b border-slate-200 pb-7"><div><a href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"><ArrowLeft className="size-4" />Overview</a><div className="mt-5 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><Inbox className="size-5" /></span><div><p className="text-sm font-bold uppercase tracking-[.16em] text-sky-700">Lead management</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Leads Inbox</h1></div></div><p className="mt-4 text-sm leading-6 text-slate-600">Review every submitted lead, read the original message, and open the complete follow-up workspace.</p></div><DashboardSignOutButton /></header><div className="mt-8"><LeadInbox leads={leads} /></div></div></main>
}

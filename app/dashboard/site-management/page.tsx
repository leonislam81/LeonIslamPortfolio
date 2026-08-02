import { Activity, ArrowLeft, FilePenLine, Globe2, LayoutTemplate, Settings2 } from "lucide-react"
import { redirect } from "next/navigation"
import { DashboardSignOutButton } from "@/components/dashboard-sign-out-button"
import { SiteOperationsChecklist } from "@/components/site-operations-checklist"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { getDashboardMembership } from "@/lib/dashboard-access"

const sitePages = [
  { title: "Home page", href: "/", description: "Your main service and contact landing page." },
  { title: "Free audit", href: "/free-audit", description: "Lead-generation audit experience and report flow." },
  { title: "Services", href: "/services", description: "Service overview and individual offer pages." },
  { title: "Contact", href: "/contact", description: "General project enquiry form." },
]

export default async function SiteManagementPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard")
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")
  const membership = await getDashboardMembership()
  const { data: operations } = await supabase.from("site_operations").select("task_key").eq("owner_id", membership?.workspaceOwnerId ?? user.id).eq("completed", true)
  const initialCompleted = (operations ?? []).map((operation) => operation.task_key)

  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8"><div className="mx-auto max-w-6xl"><header className="flex flex-wrap items-end justify-between gap-5 border-b border-slate-200 pb-7"><div><a href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"><ArrowLeft className="size-4" />Overview</a><p className="mt-5 text-sm font-bold uppercase tracking-[.16em] text-sky-700">Admin workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Site management</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Manage your public pages, run quality checks, and keep the work that supports conversion visible.</p></div><DashboardSignOutButton /></header><div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><LayoutTemplate className="size-5 text-sky-700" /><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Public pages</p><h2 className="mt-1 text-xl font-bold">Open the pages you manage</h2></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{sitePages.map((page) => <a key={page.title} href={page.href} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 p-5 transition hover:border-sky-300 hover:bg-sky-50"><Globe2 className="size-5 text-sky-700" /><h3 className="mt-4 font-bold">{page.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{page.description}</p><span className="mt-4 inline-block text-sm font-semibold text-sky-700">Open page →</span></a>)}</div></section><div className="space-y-5"><section className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm"><Activity className="size-6 text-sky-300" /><p className="mt-5 text-sm font-bold uppercase tracking-[.14em] text-sky-200">Site health</p><h2 className="mt-2 text-xl font-bold">Check what visitors experience.</h2><p className="mt-3 text-sm leading-6 text-slate-300">Run the audit against your own domain to review mobile performance, SEO signals, and opportunities.</p><a href="/free-audit" target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950">Run a site audit →</a></section><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><FilePenLine className="size-5 text-sky-700" /><p className="mt-4 text-sm font-bold uppercase tracking-[.14em] text-sky-700">Content manager</p><h2 className="mt-2 text-xl font-bold">Ready for the next module.</h2><p className="mt-3 text-sm leading-6 text-slate-600">This area will expand into page editing, blog posts, service updates, and media management.</p><div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><Settings2 className="mb-2 size-4 text-slate-500" />Planned controls will stay separate from audit leads.</div></section></div></div><div className="mt-5 max-w-3xl"><SiteOperationsChecklist initialCompleted={initialCompleted} /></div></div></main>
}

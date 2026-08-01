import { ArrowLeft, ExternalLink, FileText, Search } from "lucide-react"
import { redirect } from "next/navigation"
import { DashboardSignOutButton } from "@/components/dashboard-sign-out-button"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

const pages = [
  { title: "Home", href: "/", purpose: "Main positioning, services, proof, and primary enquiries.", seo: "Core landing page" },
  { title: "Services", href: "/services", purpose: "Service overview and routes into focused service pages.", seo: "Service hub" },
  { title: "Free audit", href: "/free-audit", purpose: "Website audit conversion page and report capture.", seo: "Lead generation" },
  { title: "Contact", href: "/contact", purpose: "Quote and support enquiry form.", seo: "Conversion page" },
  { title: "Start a project", href: "/start-project", purpose: "Structured project request and qualification.", seo: "Project intent" },
]

export default async function ContentManagerPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard")
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")
  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8"><div className="mx-auto max-w-6xl"><header className="flex flex-wrap items-end justify-between gap-5 border-b border-slate-200 pb-7"><div><a href="/dashboard/upcoming" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"><ArrowLeft className="size-4" />Upcoming features</a><div className="mt-5 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><FileText className="size-5" /></span><div><p className="text-sm font-bold uppercase tracking-[.16em] text-violet-700">Content manager</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Public pages</h1></div></div><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">Review the pages that drive enquiries and search visibility. Full inline editing is the next layer of this module.</p></div><DashboardSignOutButton /></header><section className="mt-8 grid gap-4 sm:grid-cols-2">{pages.map((page) => <article key={page.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold">{page.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{page.purpose}</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{page.seo}</span></div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><a href={page.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900">Open live page <ExternalLink className="size-4" /></a><a href={`/free-audit?url=${encodeURIComponent("https://leonislam.com" + page.href)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><Search className="size-4" />Audit</a></div></article>)}</section></div></main>
}

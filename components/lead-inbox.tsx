"use client"

import { ArrowDownToLine, ArrowUpRight, CircleAlert, Inbox, Mail, Search, SlidersHorizontal } from "lucide-react"
import { useMemo, useState } from "react"

type InboxLead = {
  id: string
  lead_name: string | null
  email: string
  website_url: string
  message: string | null
  status: string
  priority: "high" | "normal" | "low"
  created_at: string
  lead_type: string | null
  lead_source: string | null
  marketing_consent: boolean
}

const priorityColor = {
  high: "bg-rose-100 text-rose-800 ring-rose-200",
  normal: "bg-sky-100 text-sky-800 ring-sky-200",
  low: "bg-slate-100 text-slate-700 ring-slate-200",
}

function statusColor(status: string) {
  if (status === "Won") return "bg-emerald-100 text-emerald-800"
  if (status === "Not a fit") return "bg-slate-100 text-slate-600"
  if (status === "Contacted") return "bg-violet-100 text-violet-800"
  if (status === "New") return "bg-amber-100 text-amber-800"
  return "bg-sky-100 text-sky-800"
}

export function LeadInbox({ leads }: { leads: InboxLead[] }) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [priority, setPriority] = useState("all")
  const [sort, setSort] = useState("newest")
  const [type, setType] = useState("all")
  const [marketing, setMarketing] = useState("all")
  const statuses = Array.from(new Set(leads.map((lead) => lead.status))).sort()
  const types = Array.from(new Set(leads.map((lead) => lead.lead_type || "General enquiry"))).sort()
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return leads
      .filter((lead) => {
        const text = `${lead.lead_name ?? ""} ${lead.email} ${lead.website_url} ${lead.message ?? ""}`.toLowerCase()
        return (!query || text.includes(query)) && (status === "all" || lead.status === status) && (priority === "all" || lead.priority === priority) && (type === "all" || (lead.lead_type || "General enquiry") === type) && (marketing === "all" || (marketing === "opted-in" ? lead.marketing_consent : !lead.marketing_consent))
      })
      .sort((first, second) => {
        if (sort === "priority") return (first.priority === "high" ? 0 : first.priority === "normal" ? 1 : 2) - (second.priority === "high" ? 0 : second.priority === "normal" ? 1 : 2)
        return new Date(second.created_at).getTime() - new Date(first.created_at).getTime()
      })
  }, [leads, marketing, priority, search, sort, status, type])
  const newLeads = leads.filter((lead) => lead.status === "New").length
  const highPriority = leads.filter((lead) => lead.priority === "high" && lead.status !== "Won").length
  const marketingOptIns = leads.filter((lead) => lead.marketing_consent).length
  const exportLeads = () => {
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`
    const rows = visible.map((lead) => [lead.lead_name || "", lead.email, lead.website_url, lead.lead_type || "General enquiry", lead.lead_source || "Contact form", lead.marketing_consent ? "Yes" : "No", lead.status, lead.priority, lead.created_at].map(escape).join(","))
    const csv = ["Name,Email,Website,Lead type,Lead source,Marketing opt-in,Status,Priority,Received", ...rows].join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><Inbox className="size-5" /></span>
        <div><h2 className="font-bold">All submitted leads</h2><p className="mt-0.5 text-sm text-slate-500">Search, prioritise, and open the full lead workspace.</p></div>
        <div className="ml-auto flex items-center gap-3"><p className="text-xs font-medium text-slate-500">{visible.length} of {leads.length} shown</p><button type="button" onClick={exportLeads} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-sky-300 hover:text-sky-800"><ArrowDownToLine className="size-3.5" />Export shown</button></div>
      </div>

      <div className="grid gap-3 border-b border-slate-100 bg-slate-50/70 p-5 sm:grid-cols-3">
        <Summary label="New enquiries" value={newLeads} tone="text-amber-700" />
        <Summary label="High priority" value={highPriority} tone="text-rose-700" />
        <Summary label="Total leads" value={leads.length} tone="text-sky-700" />
        <Summary label="Marketing opt-ins" value={marketingOptIns} tone="text-emerald-700" />
      </div>

      <div className="grid gap-3 border-b border-slate-100 p-5 lg:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, website, or message" className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium"><option value="all">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <select value={priority} onChange={(event) => setPriority(event.target.value)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium"><option value="all">All priorities</option><option value="high">High priority</option><option value="normal">Normal priority</option><option value="low">Low priority</option></select>
        <select value={type} onChange={(event) => setType(event.target.value)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium"><option value="all">All lead types</option>{types.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <select value={marketing} onChange={(event) => setMarketing(event.target.value)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium"><option value="all">Marketing: all</option><option value="opted-in">Opted in</option><option value="not-opted-in">No opt-in</option></select>
        <label className="relative"><SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-11 rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-medium"><option value="newest">Newest first</option><option value="priority">Priority first</option></select></label>
      </div>

      {visible.length ? <div className="divide-y divide-slate-100">{visible.map((lead) => <article key={lead.id} className="group p-5 transition hover:bg-sky-50/70"><div className="flex flex-col gap-4 sm:flex-row sm:items-start"><a href={`/dashboard/leads/${lead.id}`} className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-bold text-slate-950 group-hover:text-sky-800">{lead.lead_name || "Website audit visitor"}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${priorityColor[lead.priority]}`}>{lead.priority}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(lead.status)}`}>{lead.status}</span></div><p className="mt-1 text-sm text-slate-600">{lead.email} <span className="px-1 text-slate-300">•</span> {lead.website_url}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{lead.message || "Requested the detailed website audit report and follow-up advice."}</p><p className="mt-3 text-xs text-slate-400">Received {new Date(lead.created_at).toLocaleString()}</p></a><div className="flex shrink-0 items-center gap-2"><a href={`mailto:${lead.email}`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-800"><Mail className="size-4" />Email</a><a href={`/dashboard/leads/${lead.id}`} aria-label={`Open ${lead.lead_name || lead.website_url}`} className="inline-flex min-h-10 items-center rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800">Open <ArrowUpRight className="ml-1 size-4" /></a></div></div></article>)}</div> : <div className="p-10 text-center"><CircleAlert className="mx-auto size-6 text-slate-400" /><p className="mt-3 font-semibold">No submitted leads match these filters.</p><button type="button" onClick={() => { setSearch(""); setStatus("all"); setPriority("all") }} className="mt-3 text-sm font-semibold text-sky-700 hover:text-sky-900">Clear all filters</button></div>}
    </section>
  )
}

function Summary({ label, value, tone }: { label: string; value: number; tone: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white px-4 py-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className={`mt-1 text-2xl font-bold ${tone}`}>{value}</p></div>
}

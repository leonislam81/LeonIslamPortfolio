"use client"

import { FolderKanban, Search, UserRound, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type Result = { id: string; title: string; detail: string; href: string; type: "Lead" | "Project" }

export function DashboardGlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Result[]>([])
  const [loaded, setLoaded] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open || loaded) return
    const load = async () => {
      const supabase = createSupabaseBrowserClient()
      if (!supabase) return
      const [{ data: leadData }, { data: projectData }] = await Promise.all([
        supabase.from("audit_leads").select("id, lead_name, website_url, email").order("created_at", { ascending: false }).limit(250),
        supabase.from("projects").select("id, client_name, title").order("created_at", { ascending: false }).limit(100),
      ])
      setResults([
        ...(leadData ?? []).map((lead) => ({ id: lead.id, title: lead.lead_name || lead.website_url, detail: `${lead.website_url} · ${lead.email}`, href: `/dashboard/leads/${lead.id}`, type: "Lead" as const })),
        ...(projectData ?? []).map((project) => ({ id: project.id, title: project.title, detail: project.client_name, href: `/dashboard/projects/${project.id}`, type: "Project" as const })),
      ])
      setLoaded(true)
    }
    void load()
  }, [loaded, open])

  useEffect(() => { if (open) window.setTimeout(() => input.current?.focus(), 50) }, [open])
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false) }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close) }, [])

  const visible = useMemo(() => {
    const value = query.trim().toLowerCase()
    return value ? results.filter((result) => `${result.title} ${result.detail} ${result.type}`.toLowerCase().includes(value)).slice(0, 10) : results.slice(0, 8)
  }, [query, results])

  return <><button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"><Search className="size-4" />Search<span className="hidden rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 sm:inline">ESC</span></button>{open && <div className="fixed inset-0 z-50 bg-slate-950/50 p-5" onMouseDown={() => setOpen(false)}><div className="mx-auto mt-[12vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-center gap-3 border-b border-slate-200 p-4"><Search className="size-5 text-sky-700" /><input ref={input} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads, websites, emails, and projects…" className="min-w-0 flex-1 text-base outline-none" /><button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close search"><X className="size-5" /></button></div><div className="max-h-[55vh] overflow-y-auto p-2">{!loaded ? <p className="p-5 text-sm text-slate-500">Loading workspace records…</p> : visible.length ? visible.map((result) => { const Icon = result.type === "Lead" ? UserRound : FolderKanban; return <a key={`${result.type}-${result.id}`} href={result.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-sky-50"><span className={`flex size-9 items-center justify-center rounded-lg ${result.type === "Lead" ? "bg-sky-100 text-sky-700" : "bg-violet-100 text-violet-700"}`}><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-slate-950">{result.title}</span><span className="mt-0.5 block truncate text-sm text-slate-500">{result.detail}</span></span><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-500">{result.type}</span></a> }) : <p className="p-5 text-sm text-slate-500">No leads or projects match “{query}”.</p>}</div><p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Searches your saved leads and projects. Press Escape to close.</p></div></div>}</>
}

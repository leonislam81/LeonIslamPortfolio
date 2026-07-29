"use client"

import type { FormEvent } from "react"
import { ClipboardList, FilePenLine, FolderKanban, Plus, ScanSearch, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

const actions = [
  { href: "/dashboard/leads", label: "Open leads", description: "Review incoming enquiries", icon: ClipboardList, tone: "bg-sky-50 text-sky-800" },
  { href: "/free-audit", label: "Run free audit", description: "Check a website now", icon: ScanSearch, tone: "bg-violet-50 text-violet-800" },
  { href: "/dashboard/site-management", label: "Manage site", description: "Open website operations", icon: FilePenLine, tone: "bg-emerald-50 text-emerald-800" },
]

export function DashboardQuickActions() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<"idle" | "saving" | "error">("idle")
  const router = useRouter()

  const createProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState("saving")
    const form = new FormData(event.currentTarget)
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return setState("error")
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setState("error")
    const { data, error } = await supabase.from("projects").insert({ owner_id: user.id, client_name: String(form.get("client_name")).trim(), title: String(form.get("title")).trim(), status: "Planned", due_date: String(form.get("due_date")) || null, value: 0 }).select("id").single()
    if (error || !data) return setState("error")
    router.push(`/dashboard/projects/${data.id}`)
  }

  return <><section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Quick actions</p><h2 className="mt-1 text-xl font-bold">Start work without searching</h2></div><button type="button" onClick={() => { setOpen(true); setState("idle") }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"><Plus className="size-4" />New project</button></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{actions.map((action) => { const Icon = action.icon; return <a key={action.href} href={action.href} className="group rounded-xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"><span className={`flex size-10 items-center justify-center rounded-xl ${action.tone}`}><Icon className="size-5" /></span><p className="mt-4 font-bold">{action.label}</p><p className="mt-1 text-sm text-slate-600">{action.description}</p><span className="mt-3 inline-block text-sm font-semibold text-sky-700 group-hover:underline">Open →</span></a> })}</div></section>{open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Quick create</p><h2 className="mt-1 text-xl font-bold">Create a new project</h2></div><button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X className="size-5" /></button></div><form onSubmit={createProject} className="mt-6 space-y-4"><label className="block text-sm font-semibold">Client name<input name="client_name" required autoFocus className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></label><label className="block text-sm font-semibold">Project title<input name="title" required className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></label><label className="block text-sm font-semibold">Target date <span className="font-normal text-slate-500">(optional)</span><input name="due_date" type="date" className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></label>{state === "error" && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">Could not create the project. Confirm the Projects database migration has been run, then try again.</p>}<div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button disabled={state === "saving"} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white disabled:opacity-60"><FolderKanban className="size-4" />{state === "saving" ? "Creating..." : "Create project"}</button></div></form></div></div>}</>
}

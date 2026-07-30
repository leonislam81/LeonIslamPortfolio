"use client"

import type { FormEvent } from "react"
import { CalendarClock, Plus, Search, SlidersHorizontal, Workflow } from "lucide-react"
import { useMemo, useState } from "react"
import { ProjectProgressLink } from "@/components/project-progress-link"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type Project = { id: string; client_name: string; title: string; status: string; due_date: string | null; value: number; notes: string | null }
const statusStyle: Record<string, string> = { Planned: "bg-slate-100 text-slate-700", "In progress": "bg-sky-100 text-sky-800", Waiting: "bg-amber-100 text-amber-800", Completed: "bg-emerald-100 text-emerald-800" }
const statuses = ["Planned", "In progress", "Waiting", "Completed"]
const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

export function ProjectBoard({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [state, setState] = useState<"idle" | "saving" | "error">("idle")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [sort, setSort] = useState("deadline")
  const today = dayKey(new Date())
  const week = new Date()
  week.setDate(week.getDate() + 7)
  const weekKey = dayKey(week)

  const visible = useMemo(() => projects.filter((project) => {
    const text = `${project.client_name} ${project.title} ${project.notes ?? ""}`.toLowerCase()
    const matchesSearch = !search.trim() || text.includes(search.trim().toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const active = project.status !== "Completed"
    const matchesDate = dateFilter === "all" || dateFilter === "overdue" && active && Boolean(project.due_date && project.due_date < today) || dateFilter === "soon" && active && Boolean(project.due_date && project.due_date >= today && project.due_date <= weekKey) || dateFilter === "no-date" && !project.due_date
    return matchesSearch && matchesStatus && matchesDate
  }).sort((a, b) => sort === "value" ? Number(b.value || 0) - Number(a.value || 0) : (a.due_date || "9999-12-31").localeCompare(b.due_date || "9999-12-31")), [dateFilter, projects, search, sort, statusFilter, today, weekKey])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState("saving")
    const form = new FormData(event.currentTarget)
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return setState("error")
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setState("error")
    const { data, error } = await supabase.from("projects").insert({ owner_id: user.id, client_name: String(form.get("client_name")), title: String(form.get("title")), status: String(form.get("status")), due_date: String(form.get("due_date")) || null, value: Number(form.get("value") || 0), notes: String(form.get("notes")) || null }).select("id, client_name, title, status, due_date, value, notes").single()
    if (error || !data) return setState("error")
    setProjects((current) => [data, ...current])
    setShowForm(false)
    setState("idle")
    event.currentTarget.reset()
  }

  return <div className="mt-8 space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-600">Create projects for confirmed work, then manage tasks and progress from each project workspace.</p><button type="button" onClick={() => setShowForm((value) => !value)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white"><Plus className="size-4" />New project</button></div>{showForm && <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:grid-cols-2"><input name="client_name" required placeholder="Client name" className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm" /><input name="title" required placeholder="Project title" className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm" /><select name="status" className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm">{statuses.map((status) => <option key={status}>{status}</option>)}</select><input name="due_date" type="date" className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm" /><input name="value" type="number" min="0" step="0.01" placeholder="Project value" className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm" /><textarea name="notes" placeholder="Project notes" className="min-h-11 rounded-xl border border-slate-200 p-3 text-sm" /><div className="sm:col-span-2 flex gap-3"><button disabled={state === "saving"} className="rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white">{state === "saving" ? "Saving..." : "Create project"}</button>{state === "error" && <p className="self-center text-sm font-medium text-rose-700">Could not create the project.</p>}</div></form>}<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-5"><SlidersHorizontal className="size-5 text-sky-700" /><h2 className="font-bold">Project board</h2><p className="ml-auto text-xs text-slate-500">{visible.length} of {projects.length} projects shown</p></div><div className="grid gap-3 border-b border-slate-100 p-5 lg:grid-cols-[1fr_auto_auto_auto]"><label className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search client or project" className="min-h-11 w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3 text-sm" /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium"><option value="all">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select><select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium"><option value="all">All deadlines</option><option value="overdue">Overdue</option><option value="soon">Due in 7 days</option><option value="no-date">No deadline</option></select><select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium"><option value="deadline">Deadline first</option><option value="value">Highest value</option></select></div><div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">{visible.map((project) => { const overdue = project.status !== "Completed" && Boolean(project.due_date && project.due_date < today); return <article key={project.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${overdue ? "border-rose-200" : "border-slate-200"}`}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-500">{project.client_name}</p><h3 className="mt-1 text-lg font-bold">{project.title}</h3></div><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle[project.status] ?? statusStyle.Planned}`}>{project.status}</span></div>{project.notes && <p className="mt-4 text-sm leading-6 text-slate-600">{project.notes}</p>}<div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm"><span className={`inline-flex items-center gap-1 ${overdue ? "font-bold text-rose-700" : "text-slate-500"}`}>{project.due_date && <CalendarClock className="size-4" />}{project.due_date ? `${overdue ? "Overdue" : "Due"} ${new Date(`${project.due_date}T00:00:00`).toLocaleDateString()}` : "No due date"}</span><span className="font-bold">{project.value || 0}</span></div><ProjectProgressLink projectId={project.id} /></article>})}{!visible.length && <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-600">No projects match these filters.</div>}</div></section>{!projects.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><Workflow className="mx-auto size-7 text-sky-700" /><h2 className="mt-4 text-lg font-bold">No projects yet</h2><p className="mt-2 text-sm text-slate-600">Create your first confirmed client project from here.</p></div>}</div>
}

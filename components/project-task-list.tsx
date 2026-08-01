"use client"

import type { FormEvent } from "react"
import { CalendarClock, CheckCircle2, Pencil, Plus, Save, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type Task = { id: string; title: string; completed: boolean; due_date: string | null }

export function ProjectTaskList({ projectId, initialTasks }: { projectId: string; initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [editingDate, setEditingDate] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      const supabase = createSupabaseBrowserClient()
      if (!supabase) return
      const { data } = await supabase.from("project_tasks").select("id,title,completed,due_date").eq("project_id", projectId).order("created_at")
      if (data) setTasks(data)
    }
    void load()
  }, [projectId])

  const add = async (event: FormEvent) => {
    event.preventDefault()
    const supabase = createSupabaseBrowserClient()
    if (!supabase || !title.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setError("Your session has expired. Please sign in again.")
    const { data, error: saveError } = await supabase.from("project_tasks").insert({ project_id: projectId, owner_id: user.id, title: title.trim(), due_date: dueDate || null }).select("id,title,completed,due_date").single()
    if (saveError || !data) return setError("Could not add this task.")
    setTasks((current) => [...current, data])
    setTitle("")
    setDueDate("")
    setError("")
  }

  const toggle = async (task: Task) => {
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return
    const completed = !task.completed
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed } : item))
    const { error: saveError } = await supabase.from("project_tasks").update({ completed }).eq("id", task.id)
    if (saveError) setError("Could not update the task.")
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditingTitle(task.title)
    setEditingDate(task.due_date ?? "")
    setError("")
  }

  const saveEdit = async (taskId: string) => {
    if (!editingTitle.trim()) return setError("A task needs a title.")
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return setError("Could not connect to the database.")
    const { error: saveError } = await supabase.from("project_tasks").update({ title: editingTitle.trim(), due_date: editingDate || null }).eq("id", taskId)
    if (saveError) return setError("Could not save the task changes.")
    setTasks((current) => current.map((task) => task.id === taskId ? { ...task, title: editingTitle.trim(), due_date: editingDate || null } : task))
    setEditingId(null)
    setError("")
  }

  const remove = async (task: Task) => {
    if (!window.confirm(`Delete the task “${task.title}”?`)) return
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return setError("Could not connect to the database.")
    const { error: deleteError } = await supabase.from("project_tasks").delete().eq("id", task.id)
    if (deleteError) return setError("Could not delete the task.")
    setTasks((current) => current.filter((item) => item.id !== task.id))
  }

  const complete = tasks.filter((task) => task.completed).length
  const percent = tasks.length ? Math.round((complete / tasks.length) * 100) : 0
  const ordered = [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed) || (a.due_date || "9999").localeCompare(b.due_date || "9999"))

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><CheckCircle2 className="size-5 text-sky-700" /><h2 className="text-xl font-bold">Project tasks</h2></div><span className="text-sm font-semibold text-slate-500">{complete}/{tasks.length} done</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-sky-600 transition-all" style={{ width: `${percent}%` }} /></div><form onSubmit={add} className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto_auto]"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add a task" className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm" /><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm" /><button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white"><Plus className="size-4" />Add</button></form><div className="mt-5 space-y-2">{ordered.map((task) => editingId === task.id ? <div key={task.id} className="rounded-xl border border-sky-200 bg-sky-50 p-3"><div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]"><input value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} className="min-h-10 rounded-lg border border-slate-200 px-3 text-sm" autoFocus /><input type="date" value={editingDate} onChange={(event) => setEditingDate(event.target.value)} className="min-h-10 rounded-lg border border-slate-200 px-3 text-sm" /><div className="flex gap-2"><button type="button" onClick={() => void saveEdit(task.id)} className="inline-flex items-center gap-1 rounded-lg bg-sky-700 px-3 text-xs font-bold text-white"><Save className="size-3.5" />Save</button><button type="button" onClick={() => setEditingId(null)} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600" aria-label="Cancel editing"><X className="size-4" /></button></div></div></div> : <div key={task.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm"><input type="checkbox" checked={task.completed} onChange={() => void toggle(task)} className="size-4 accent-sky-700" /><span className={`min-w-0 flex-1 ${task.completed ? "text-slate-400 line-through" : "font-medium"}`}>{task.title}</span>{task.due_date && <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500"><CalendarClock className="size-3.5" />{new Date(`${task.due_date}T00:00:00`).toLocaleDateString()}</span>}<button type="button" onClick={() => startEdit(task)} className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-sky-700" aria-label={`Edit ${task.title}`}><Pencil className="size-4" /></button><button type="button" onClick={() => void remove(task)} className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-rose-700" aria-label={`Delete ${task.title}`}><Trash2 className="size-4" /></button></div>)}{!tasks.length && <p className="text-sm text-slate-500">No tasks yet.</p>}</div>{error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}</section>
}

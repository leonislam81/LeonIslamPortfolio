import { ArrowLeft, CalendarClock, CircleDollarSign, FolderKanban } from "lucide-react"
import { notFound, redirect } from "next/navigation"
import { ProjectTaskList } from "@/components/project-task-list"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

const statusStyle: Record<string, string> = { Planned: "bg-slate-100 text-slate-700", "In progress": "bg-sky-100 text-sky-800", Waiting: "bg-amber-100 text-amber-800", Completed: "bg-emerald-100 text-emerald-800" }

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) redirect("/dashboard")
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")
  const { id } = await params
  const { data: project } = await supabase.from("projects").select("id,client_name,title,status,due_date,value,notes").eq("id", id).single()
  if (!project) notFound()
  const overdue = project.status !== "Completed" && project.due_date && project.due_date < new Date().toISOString().slice(0, 10)

  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8"><div className="mx-auto max-w-4xl"><a href="/dashboard/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"><ArrowLeft className="size-4" />Projects</a><header className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><FolderKanban className="size-5" /></span><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">{project.client_name}</p><h1 className="mt-1 text-3xl font-bold tracking-tight">{project.title}</h1><span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${statusStyle[project.status] ?? statusStyle.Planned}`}>{project.status}</span></div></div><div className="grid grid-cols-2 gap-3 text-sm sm:min-w-56"><div className={`rounded-xl border p-3 ${overdue ? "border-rose-200 bg-rose-50 text-rose-900" : "border-slate-200 bg-slate-50 text-slate-700"}`}><CalendarClock className="size-4" /><p className="mt-2 text-xs font-semibold uppercase tracking-wide opacity-70">Deadline</p><p className="mt-1 font-bold">{project.due_date ? `${overdue ? "Overdue · " : ""}${new Date(`${project.due_date}T00:00:00`).toLocaleDateString()}` : "Not set"}</p></div><div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700"><CircleDollarSign className="size-4" /><p className="mt-2 text-xs font-semibold uppercase tracking-wide opacity-70">Value</p><p className="mt-1 font-bold">{Number(project.value || 0).toLocaleString()}</p></div></div></div>{project.notes && <p className="mt-5 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-600">{project.notes}</p>}</header><div className="mt-8"><ProjectTaskList projectId={project.id} initialTasks={[]} /></div></div></main>
}

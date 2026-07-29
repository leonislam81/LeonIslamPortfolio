import { CalendarClock, CircleAlert, CircleCheckBig, FolderKanban } from "lucide-react"

type Project = { status: string; due_date: string | null; value: number }

function dayKey() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function futureDayKey(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function ProjectHealthSummary({ projects }: { projects: Project[] }) {
  const today = dayKey()
  const active = projects.filter((project) => !["Completed", "Cancelled"].includes(project.status))
  const overdue = active.filter((project) => project.due_date && project.due_date < today)
  const dueSoon = active.filter((project) => project.due_date && project.due_date >= today && project.due_date <= futureDayKey(7))
  const totalValue = active.reduce((sum, project) => sum + Number(project.value || 0), 0)
  const cards = [
    [FolderKanban, "Active projects", active.length, "text-sky-700 bg-sky-50"],
    [CircleAlert, "Overdue", overdue.length, "text-rose-700 bg-rose-50"],
    [CalendarClock, "Due soon", dueSoon.length, "text-amber-700 bg-amber-50"],
    [CircleCheckBig, "Active value", totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 }), "text-emerald-700 bg-emerald-50"],
  ] as const

  return <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([Icon, label, value, tone]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className={`flex size-9 items-center justify-center rounded-xl ${tone}`}><Icon className="size-4" /></span><p className="mt-4 text-sm font-semibold text-slate-600">{label}</p><p className="mt-1 text-3xl font-bold">{value}</p></article>)}</section>
}

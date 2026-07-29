import { ArrowRight, ClipboardList, FilePenLine, FolderKanban, Settings2 } from "lucide-react"

const modules = [
  {
    href: "/dashboard/leads",
    title: "Leads inbox",
    description: "Review enquiries, follow-ups, and report delivery.",
    icon: ClipboardList,
    tone: "bg-sky-50 text-sky-800 ring-sky-200",
  },
  {
    href: "/dashboard/projects",
    title: "Projects",
    description: "Track client work, due dates, value, and next actions.",
    icon: FolderKanban,
    tone: "bg-violet-50 text-violet-800 ring-violet-200",
  },
  {
    href: "/dashboard/site-management",
    title: "Site management",
    description: "Manage your website work and public-site priorities.",
    icon: FilePenLine,
    tone: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  },
  {
    href: "/dashboard/settings",
    title: "Workflow settings",
    description: "Fine-tune follow-up timing and dashboard workflows.",
    icon: Settings2,
    tone: "bg-amber-50 text-amber-800 ring-amber-200",
  },
]

export function DashboardWorkspaceHub() {
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Workspace</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Manage every part of your business</h2>
        </div>
        <p className="text-sm text-slate-500">Choose a module to continue.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <a key={module.href} href={module.href} className="group rounded-xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
              <span className={`flex size-10 items-center justify-center rounded-xl ring-1 ${module.tone}`}><Icon className="size-5" /></span>
              <h3 className="mt-4 font-bold">{module.title}</h3>
              <p className="mt-1 min-h-10 text-sm leading-5 text-slate-600">{module.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-700">Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
            </a>
          )
        })}
      </div>
    </section>
  )
}

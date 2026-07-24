"use client"

import { ArrowUpRight, Blocks, CheckCircle2, Code2, Database, Gauge, Layers3, Sparkles, Wrench } from "lucide-react"

const primarySkills = [
  { title: "WordPress", label: "CMS specialist", description: "Custom themes, content operations, care plans and dependable fixes.", icon: Blocks, accent: "from-cyan-400 to-blue-500" },
  { title: "Shopify", label: "E-commerce growth", description: "Store setup, conversion-focused pages and theme customization.", icon: Layers3, accent: "from-emerald-400 to-teal-500" },
  { title: "Wix", label: "Modern launches", description: "Responsive websites with polished interactions and a clear user journey.", icon: Sparkles, accent: "from-violet-400 to-fuchsia-500" },
]

const operations = [
  { title: "Data migration", detail: "Clean, accurate transfers at scale", icon: Database },
  { title: "Website care", detail: "Updates, monitoring and ongoing support", icon: Wrench },
  { title: "Bug fixing", detail: "Clear diagnosis and stable solutions", icon: Code2 },
  { title: "Performance", detail: "Faster pages and better Core Web Vitals", icon: Gauge },
]

export function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden bg-slate-950 py-20 text-white md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.22),transparent_30rem),radial-gradient(circle_at_90%_75%,rgba(139,92,246,0.2),transparent_28rem)]" />
      <div className="container relative mx-auto px-4">
        <div className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-cyan-200"><Sparkles className="h-4 w-4" /> Expertise, built for results</div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">More than a skill set.<br /><span className="text-cyan-300">A reliable delivery system.</span></h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-slate-300 lg:text-right">From a one-off fix to full website management, every capability is designed to make your website easier to run and more effective for your business.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="grid gap-5 lg:col-span-8 md:grid-cols-3">
            {primarySkills.map((skill) => {
              const Icon = skill.icon
              return (
                <article key={skill.title} className="group relative min-h-72 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.1]">
                  <div className={`absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br ${skill.accent} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40`} />
                  <div className="relative flex h-full flex-col justify-between"><div><div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${skill.accent} text-white shadow-lg`}><Icon className="h-6 w-6" /></div><p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">{skill.label}</p><h3 className="mt-2 text-2xl font-bold">{skill.title}</h3></div><p className="text-sm leading-relaxed text-slate-300">{skill.description}</p></div>
                </article>
              )
            })}
          </div>

          <aside className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400 to-blue-600 p-7 text-slate-950 shadow-2xl shadow-cyan-500/20 lg:col-span-4">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[20px] border-white/20" />
            <div className="relative"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-950/70">Work standard</p><p className="mt-4 text-5xl font-black tracking-tighter">98%</p><p className="mt-1 text-lg font-bold">client satisfaction</p><p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-950/75">Clear communication, practical execution, and careful quality checks from start to finish.</p><div className="mt-8 border-t border-slate-950/15 pt-5 text-sm font-semibold"><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> 100+ projects delivered</span></div></div>
          </aside>

          <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-4">
            {operations.map((operation) => {
              const Icon = operation.icon
              return <div key={operation.title} className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-white/[0.07]"><div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-200"><Icon className="h-4 w-4" /></div><div><h3 className="font-semibold text-white">{operation.title}</h3><p className="mt-1 text-xs leading-relaxed text-slate-400">{operation.detail}</p></div><ArrowUpRight className="ml-auto h-4 w-4 text-slate-500" /></div>
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

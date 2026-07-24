"use client"

import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Blocks, CheckCircle2, Code2, Database, Gauge, Layers3, Sparkles, Wrench } from "lucide-react"

const skills = [
  { name: "WordPress", level: 95, category: "CMS", detail: "Custom themes, care plans & fast fixes", icon: Blocks },
  { name: "Shopify", level: 90, category: "E-commerce", detail: "Store setup, conversion & theme work", icon: Layers3 },
  { name: "Wix", level: 85, category: "Website Builder", detail: "Responsive design and polished launches", icon: Sparkles },
  { name: "WordPress Data Entry", level: 98, category: "Data Management", detail: "Accurate, scalable content operations", icon: Database },
  { name: "Copy-Paste & Migration", level: 95, category: "Data Management", detail: "Clean transfer, structure and QA", icon: ArrowUpRight },
  { name: "Website Management", level: 92, category: "Maintenance", detail: "Updates, monitoring and ongoing care", icon: Wrench },
  { name: "Bug Fixing", level: 88, category: "Development", detail: "Clear diagnosis and dependable solutions", icon: Code2 },
  { name: "Performance Optimization", level: 85, category: "Development", detail: "Better speed, UX and Core Web Vitals", icon: Gauge },
]

const expertise = ["CMS & e-commerce", "Performance focused", "Mobile-first delivery", "Reliable long-term support"]

export function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-portfolio-primary/10 blur-3xl" />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-portfolio-primary/10 px-3 py-1 text-sm font-medium text-portfolio-primary"><Sparkles className="h-4 w-4" /> Skills snapshot</div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">Skills & Expertise</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">A focused toolkit for building, improving, and managing websites that look polished and work reliably.</p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="rounded-[2rem] border border-portfolio-primary/20 bg-gradient-to-br from-portfolio-primary to-portfolio-accent p-7 text-portfolio-primary-foreground shadow-xl shadow-portfolio-primary/20 sm:p-9">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">How I work</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight">Practical skills. Measurable outcomes.</h3>
            <p className="mt-4 leading-relaxed text-white/80">Every project combines design detail, technical care, and a clear focus on the goal your website needs to achieve.</p>
            <div className="mt-8 space-y-3">{expertise.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium"><CheckCircle2 className="h-4 w-4 shrink-0" />{item}</div>)}</div>
            <div className="mt-9 grid grid-cols-3 gap-2 border-t border-white/15 pt-6 text-center"><div><p className="text-2xl font-bold">5+</p><p className="mt-1 text-[11px] text-white/70">Years</p></div><div><p className="text-2xl font-bold">100+</p><p className="mt-1 text-[11px] text-white/70">Projects</p></div><div><p className="text-2xl font-bold">98%</p><p className="mt-1 text-[11px] text-white/70">Satisfied</p></div></div>
          </aside>

          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((skill) => {
              const Icon = skill.icon
              return (
                <article key={skill.name} className="group rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-portfolio-primary/30 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-portfolio-primary/10 text-portfolio-primary transition-transform duration-300 group-hover:scale-110"><Icon className="h-5 w-5" /></div><span className="text-2xl font-bold tracking-tight text-portfolio-primary">{skill.level}<span className="text-sm">%</span></span></div>
                  <div className="mt-5"><h3 className="font-bold text-foreground">{skill.name}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{skill.detail}</p></div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-to-r from-portfolio-primary to-portfolio-accent transition-[width] duration-700" style={{ width: `${skill.level}%` }} /></div>
                  <Badge variant="secondary" className="mt-4 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">{skill.category}</Badge>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

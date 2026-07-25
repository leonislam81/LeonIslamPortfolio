"use client"

import { ArrowUpRight, Blocks, CheckCircle2, Database, FileSpreadsheet, Layers3, PackageCheck, Sparkles, Store, Wrench } from "lucide-react"

const primarySkills = [
  { title: "Website operations", label: "WordPress · Shopify · Wix", description: "Website updates, content management, design changes, maintenance, and day-to-day support.", icon: Blocks, accent: "from-indigo-500 to-blue-500" },
  { title: "E-commerce catalogs", label: "Product listing support", description: "Accurate product data, images, descriptions, attributes, categories, and variations.", icon: Store, accent: "from-teal-500 to-cyan-500" },
  { title: "Amazon support", label: "Catalog & seller tasks", description: "Amazon product entry, listing updates, variations, research, spreadsheets, and admin work.", icon: PackageCheck, accent: "from-violet-500 to-indigo-500" },
]

const operations = [
  { title: "Website data entry", detail: "Pages, posts, products, images, and formatting", icon: Database },
  { title: "Admin assistance", detail: "Reliable online support for recurring business tasks", icon: Wrench },
  { title: "Spreadsheets & cleanup", detail: "Excel, Google Sheets, PDF conversion, and clean data", icon: FileSpreadsheet },
  { title: "Research & lists", detail: "Web research, product research, list building, and collection", icon: Layers3 },
]

export function Skills() {
  return <section id="skills" className="relative overflow-hidden bg-slate-50 py-20 text-foreground dark:bg-slate-950 sm:py-28">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(99,102,241,.12),transparent_30rem),radial-gradient(circle_at_90%_75%,rgba(20,184,166,.10),transparent_28rem)] dark:bg-[radial-gradient(circle_at_12%_20%,rgba(99,102,241,.20),transparent_30rem),radial-gradient(circle_at_90%_75%,rgba(20,184,166,.14),transparent_28rem)]" />
    <div className="container relative mx-auto px-4">
      <div className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-portfolio-primary/10 px-3 py-1 text-sm font-medium text-portfolio-primary"><Sparkles className="h-4 w-4" />Core capabilities</div><h2 className="text-4xl font-bold tracking-tight sm:text-5xl">The practical support<br /><span className="text-portfolio-primary">behind a smooth online business.</span></h2></div>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground lg:text-right">Website management, e-commerce catalog work, Amazon support, and accurate admin tasks—organized in one place.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="grid gap-5 md:grid-cols-3 lg:col-span-8">{primarySkills.map(skill => { const Icon = skill.icon; return <article key={skill.title} className="group relative min-h-72 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-portfolio-primary/30 hover:shadow-xl"><div className={`absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br ${skill.accent} opacity-10 blur-2xl transition-opacity group-hover:opacity-25`} /><div className="relative flex h-full flex-col justify-between"><div><div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${skill.accent} text-white shadow-lg`}><Icon className="h-6 w-6" /></div><p className="mt-7 text-xs font-semibold uppercase tracking-[.16em] text-portfolio-primary">{skill.label}</p><h3 className="mt-2 text-2xl font-bold">{skill.title}</h3></div><p className="text-sm leading-relaxed text-muted-foreground">{skill.description}</p></div></article> })}</div>
        <aside className="relative overflow-hidden rounded-3xl border border-portfolio-primary/20 bg-gradient-to-br from-portfolio-primary to-portfolio-accent p-7 text-portfolio-primary-foreground shadow-xl shadow-portfolio-primary/20 lg:col-span-4"><div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[20px] border-white/20" /><div className="relative"><p className="text-sm font-semibold uppercase tracking-[.16em] opacity-75">Work standard</p><p className="mt-4 text-3xl font-bold tracking-tight">Accurate, organized, and dependable.</p><p className="mt-5 max-w-xs text-sm leading-relaxed opacity-80">Every task is handled with careful attention to details, formatting, and clear communication.</p><div className="mt-8 border-t border-white/20 pt-5 text-sm font-semibold"><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Quality checks before delivery</span></div></div></aside>
        <div className="grid gap-3 rounded-3xl border border-border bg-card/70 p-4 shadow-sm sm:grid-cols-2 lg:col-span-12 lg:grid-cols-4">{operations.map(operation => { const Icon = operation.icon; return <div key={operation.title} className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-portfolio-primary/5"><div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-portfolio-primary/10 text-portfolio-primary"><Icon className="h-4 w-4" /></div><div><h3 className="font-semibold text-foreground">{operation.title}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{operation.detail}</p></div><ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" /></div> })}</div>
      </div>
    </div>
  </section>
}

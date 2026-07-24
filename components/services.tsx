"use client"

import { ArrowRight, CheckCircle2, Compass as Wordpress, Database, Gauge, Palette, RefreshCw, Settings, ShoppingCart, Sparkles, Wrench, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const serviceTracks = [
  {
    title: "Build",
    description: "Launch a website or store that looks polished, loads quickly, and is ready for real customers.",
    icon: Sparkles,
    tint: "from-indigo-500 to-blue-500",
    services: [
      { icon: Wordpress, title: "WordPress websites", detail: "Custom themes, landing pages, and dependable setup." },
      { icon: ShoppingCart, title: "Shopify stores", detail: "Theme customization, products, payments, and apps." },
      { icon: Palette, title: "Wix design", detail: "Responsive pages with a clear, conversion-focused journey." },
    ],
  },
  {
    title: "Improve",
    description: "Turn an underperforming website into a faster, clearer, and more reliable business tool.",
    icon: Zap,
    tint: "from-teal-500 to-cyan-500",
    services: [
      { icon: Wrench, title: "Bug fixes", detail: "Diagnose layout, script, and cross-browser problems." },
      { icon: Gauge, title: "Performance & SEO", detail: "Faster pages, stronger Core Web Vitals, better foundations." },
      { icon: RefreshCw, title: "Platform migration", detail: "Move safely while protecting data, SEO, and structure." },
    ],
  },
  {
    title: "Maintain",
    description: "Keep the work off your plate with practical ongoing help that keeps your site healthy.",
    icon: Settings,
    tint: "from-violet-500 to-fuchsia-500",
    services: [
      { icon: Database, title: "Content operations", detail: "Accurate products, pages, posts, and data updates." },
      { icon: Settings, title: "Website care", detail: "Backups, monitoring, security, and routine updates." },
      { icon: Zap, title: "Integrations & automation", detail: "Connect your tools and remove repetitive work." },
    ],
  },
]

const process = ["Tell me what needs to change", "Receive a focused plan and timeline", "Review progress without the technical stress"]

export function Services() {
  const moveToContact = () => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })

  return <section id="services" className="relative overflow-hidden bg-white py-20 text-foreground dark:bg-slate-950 sm:py-28">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(99,102,241,.10),transparent_28rem),radial-gradient(circle_at_92%_45%,rgba(20,184,166,.10),transparent_30rem)] dark:bg-[radial-gradient(circle_at_8%_10%,rgba(99,102,241,.18),transparent_28rem),radial-gradient(circle_at_92%_45%,rgba(20,184,166,.14),transparent_30rem)]" />
    <div className="container relative mx-auto px-4">
      <div className="grid gap-10 border-b border-border pb-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
        <div><div className="inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-portfolio-primary/10 px-3 py-1 text-sm font-medium text-portfolio-primary"><Sparkles className="h-4 w-4" />How I can help</div><h2 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">The right support for every stage of your website.</h2></div>
        <div><p className="text-base leading-7 text-muted-foreground sm:text-lg">Whether you are launching, improving, or maintaining a website, choose the level of support that gives you the clearest next step.</p><Button onClick={moveToContact} className="mt-6 rounded-xl bg-portfolio-primary text-portfolio-primary-foreground shadow-lg shadow-portfolio-primary/20 hover:bg-portfolio-primary/90">Discuss your website <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {serviceTracks.map(track => { const TrackIcon = track.icon; return <article key={track.title} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-portfolio-primary/30 hover:shadow-xl"><div className={`h-1.5 bg-gradient-to-r ${track.tint}`} /><div className="p-6 sm:p-7"><div className="flex items-center gap-3"><div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${track.tint} text-white shadow-md`}><TrackIcon className="h-5 w-5" /></div><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-portfolio-primary">Website support</p><h3 className="text-2xl font-bold">{track.title}</h3></div></div><p className="mt-5 min-h-[72px] text-sm leading-6 text-muted-foreground">{track.description}</p><div className="mt-6 space-y-1 border-t border-border pt-4">{track.services.map(service => { const Icon = service.icon; return <div key={service.title} className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-portfolio-primary/5"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-portfolio-primary" /><div><h4 className="text-sm font-semibold text-foreground">{service.title}</h4><p className="mt-1 text-xs leading-5 text-muted-foreground">{service.detail}</p></div></div> })}</div></div></article> })}
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-muted/50 p-6 sm:p-8"><div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-portfolio-primary text-portfolio-primary-foreground"><CheckCircle2 className="h-6 w-6" /></div><div><p className="font-semibold text-foreground">A clear process, from first message to final hand-off.</p><div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">{process.map((step, index) => <div key={step} className="flex items-center gap-2"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-card text-xs font-bold text-portfolio-primary shadow-sm">{index + 1}</span>{step}</div>)}</div></div></div></div>
    </div>
  </section>
}

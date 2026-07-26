"use client"

import { ArrowDownRight, ArrowRight, CalendarCheck2, CalendarDays, CheckCircle2, Clock3, Code2, Gauge, Globe2, Sparkles, Zap } from "lucide-react"
import { BookingLink } from "@/components/booking-link"
import { Button } from "@/components/ui/button"

const proofPoints = ["Accurate data handling", "Clear communication", "Reliable delivery"]
const platforms = ["WordPress", "Shopify", "Wix", "Amazon", "Google Sheets", "Excel"]

export function Hero() {
  const scrollTo = (section: string) => document.querySelector(section)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })

  return <section className="relative isolate overflow-hidden bg-background pb-20 pt-12 sm:pb-28 sm:pt-20 lg:min-h-[720px] lg:py-20">
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,.16),transparent_26rem),radial-gradient(circle_at_88%_55%,rgba(20,184,166,.13),transparent_29rem)] dark:bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,.24),transparent_26rem),radial-gradient(circle_at_88%_55%,rgba(20,184,166,.17),transparent_29rem)]" />
    <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-px w-full max-w-6xl -translate-x-1/2 bg-gradient-to-r from-transparent via-portfolio-primary/25 to-transparent" />
    <div className="container mx-auto px-4">
      <div className="grid items-center gap-12 lg:grid-cols-[1.03fr_.97fr] lg:gap-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-card/80 px-3 py-1.5 text-sm font-medium text-portfolio-primary shadow-sm backdrop-blur"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-portfolio-primary text-portfolio-primary-foreground"><Sparkles className="h-3 w-3" /></span>Website, e-commerce & admin support</div>
          <p className="mt-7 text-sm font-semibold uppercase tracking-[.2em] text-muted-foreground">Hi, I’m Leon Islam</p>
          <h1 className="mt-4 text-5xl font-bold tracking-[-.055em] text-foreground sm:text-6xl lg:text-7xl">Practical online support that keeps your <span className="bg-gradient-to-r from-portfolio-primary to-portfolio-accent bg-clip-text text-transparent">business moving.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">From website updates and e-commerce product listings to Amazon catalog work and accurate admin support, I handle the details that keep your online operations organized.</p>
          <div className="mt-8"><div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button size="lg" onClick={() => scrollTo("#contact")} className="h-12 w-full shrink-0 whitespace-nowrap rounded-xl bg-portfolio-primary px-6 text-base text-portfolio-primary-foreground shadow-lg shadow-portfolio-primary/25 hover:bg-portfolio-primary/90 sm:w-auto">Start a project <ArrowRight className="ml-2 h-4 w-4" /></Button><BookingLink placement="hero" className="inline-flex h-12 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-border bg-card/70 px-6 text-base font-medium text-foreground shadow-sm transition hover:bg-muted sm:w-auto">Book a free call <CalendarDays className="ml-2 h-4 w-4" /></BookingLink><Button size="lg" variant="outline" onClick={() => scrollTo("#projects")} className="h-12 w-full shrink-0 whitespace-nowrap rounded-xl border-border bg-card/70 px-6 text-base text-foreground shadow-sm hover:bg-muted sm:w-auto">See selected work <ArrowDownRight className="ml-2 h-4 w-4" /></Button></div><p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><CalendarCheck2 className="h-4 w-4 shrink-0 text-portfolio-accent" />Free calls: Monday–Saturday, 9 AM–8 PM (Bangladesh time).</p><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">In 20 minutes, discuss your goal, timeline, and platform—then leave with a clear practical next step.</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground"><span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-portfolio-accent" />No-obligation call</span><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-portfolio-primary" />2–4 hour business-day reply</span><span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-portfolio-accent" />Secure enquiry form</span></div></div>
          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3">{proofPoints.map(point => <span key={point} className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-portfolio-accent" />{point}</span>)}</div>
          <div className="mt-8 border-t border-border/70 pt-5">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">Platforms and tools</p>
            <div className="mt-3 flex flex-wrap gap-2">{platforms.map((platform) => <span key={platform} className="rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">{platform}</span>)}</div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-portfolio-primary/20 via-transparent to-portfolio-accent/20 blur-2xl" />
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-portfolio-primary/10">
            <div className="flex items-center justify-between border-b border-border bg-muted/45 px-5 py-4"><div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div><div className="rounded-full bg-card px-3 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-muted-foreground">Project snapshot</div></div>
            <div className="p-5 sm:p-7"><div className="rounded-2xl bg-gradient-to-br from-portfolio-primary to-portfolio-accent p-6 text-portfolio-primary-foreground sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.18em] opacity-75">Your digital presence</p><p className="mt-3 text-2xl font-bold tracking-tight">Built around clarity, speed, and confidence.</p></div><Globe2 className="h-8 w-8 shrink-0 opacity-80" /></div><div className="mt-7 grid grid-cols-3 gap-2"><div className="rounded-xl bg-white/15 p-3"><p className="text-lg font-bold">Fast</p><p className="mt-1 text-[10px] uppercase tracking-wide opacity-75">experience</p></div><div className="rounded-xl bg-white/15 p-3"><p className="text-lg font-bold">Clear</p><p className="mt-1 text-[10px] uppercase tracking-wide opacity-75">journey</p></div><div className="rounded-xl bg-white/15 p-3"><p className="text-lg font-bold">Ready</p><p className="mt-1 text-[10px] uppercase tracking-wide opacity-75">to grow</p></div></div></div>
              <div className="mt-5 grid gap-4 sm:grid-cols-[1.15fr_.85fr]"><div className="rounded-2xl border border-border bg-muted/35 p-5"><div className="flex items-center gap-2 text-sm font-semibold"><Code2 className="h-4 w-4 text-portfolio-primary" />A practical partner</div><p className="mt-3 text-sm leading-6 text-muted-foreground">One reliable point of contact for website work, product data, and day-to-day online tasks.</p></div><div className="rounded-2xl border border-border bg-card p-5"><Gauge className="h-5 w-5 text-portfolio-accent" /><p className="mt-3 text-2xl font-bold text-foreground">4</p><p className="text-xs text-muted-foreground">core support areas</p></div></div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-2 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg sm:-left-7"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-portfolio-accent/15 text-portfolio-accent"><Zap className="h-4 w-4" /></span><div><p className="text-xs font-semibold text-foreground">Reliable support</p><p className="text-[11px] text-muted-foreground">before and after launch</p></div></div>
        </div>
      </div>
    </div>
  </section>
}

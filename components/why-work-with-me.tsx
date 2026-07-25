"use client"

import { ArrowUpRight, CheckCircle2, HeartHandshake, MessageCircleMore, ShieldCheck, Sparkles, TimerReset } from "lucide-react"

const principles = [
  { icon: MessageCircleMore, title: "No confusing hand-offs", text: "You always know what is being worked on, why it matters, and what comes next." },
  { icon: TimerReset, title: "Momentum without the noise", text: "Focused priorities and dependable replies keep the work moving at a comfortable pace." },
  { icon: ShieldCheck, title: "Care that lasts beyond launch", text: "Updates, fixes, and improvements have one consistent home when you need them." },
]

export function WhyWorkWithMe() {
  return <section id="why-me" className="relative overflow-hidden bg-background py-20 sm:py-28">
    <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 rounded-full bg-portfolio-primary/10 blur-3xl" />
    <div className="container relative mx-auto px-4">
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start"><div className="inline-flex items-center gap-2 text-sm font-semibold text-portfolio-primary"><Sparkles className="h-4 w-4" />Why clients choose to stay</div><h2 className="mt-5 text-4xl font-bold tracking-[-.045em] text-foreground sm:text-5xl">A calmer, clearer way to get your website work done.</h2><p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">You do not need another complicated process. You need a capable partner who makes progress feel simple.</p><div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-portfolio-accent/15 text-portfolio-accent"><HeartHandshake className="h-5 w-5" /></span><span className="text-sm font-medium text-foreground">Practical support, without the agency overhead.</span></div></div>
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl shadow-portfolio-primary/5"><div className="border-b border-border bg-gradient-to-r from-portfolio-primary to-portfolio-accent p-7 text-portfolio-primary-foreground sm:p-9"><p className="text-xs font-semibold uppercase tracking-[.2em] opacity-75">The working style</p><p className="mt-4 max-w-xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Clear communication. Thoughtful work. A website you can rely on.</p><div className="mt-7 flex flex-wrap gap-3 text-sm"><span className="rounded-full bg-white/15 px-3 py-1.5">Build with purpose</span><span className="rounded-full bg-white/15 px-3 py-1.5">Improve with focus</span><span className="rounded-full bg-white/15 px-3 py-1.5">Maintain with confidence</span></div></div><div className="divide-y divide-border px-6 sm:px-9">{principles.map((principle, index) => { const Icon = principle.icon; return <article key={principle.title} className="grid gap-4 py-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:py-7"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-portfolio-primary/10 text-portfolio-primary"><Icon className="h-5 w-5" /></span><div><h3 className="text-lg font-semibold text-foreground">{principle.title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{principle.text}</p></div><span className="hidden text-sm font-bold text-portfolio-primary/30 sm:block">0{index + 1}</span></article> })}</div><div className="m-5 flex flex-col gap-4 rounded-2xl bg-muted/60 p-5 sm:m-7 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-sm font-medium text-foreground"><CheckCircle2 className="h-4 w-4 text-portfolio-accent" />One point of contact for the next step.</div><a href="#contact" className="inline-flex items-center gap-1 text-sm font-semibold text-portfolio-primary transition hover:gap-2">Let’s talk <ArrowUpRight className="h-4 w-4" /></a></div></div>
      </div>
    </div>
  </section>
}

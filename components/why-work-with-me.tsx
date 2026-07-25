"use client"

import { CheckCircle2, Clock3, HeartHandshake, MessageCircleMore, ShieldCheck, Sparkles } from "lucide-react"

const reasons = [
  { icon: MessageCircleMore, number: "01", title: "Clear from day one", description: "A focused plan, useful updates, and advice you can understand—without technical confusion." },
  { icon: Clock3, number: "02", title: "Respect for your time", description: "Focused priorities, reliable communication, and a response within 2–4 business hours." },
  { icon: ShieldCheck, number: "03", title: "Built to stay dependable", description: "Mobile usability, performance, security, and maintainability are considered from the start." },
]

const outcomes = ["Professional and easy to use", "One place for fixes and growth", "A clear hand-off and full control"]

export function WhyWorkWithMe() {
  return <section id="why-me" className="relative overflow-hidden bg-muted/35 py-20 dark:bg-slate-900/50 sm:py-24">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-portfolio-primary/20 to-transparent" />
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-3xl text-center"><div className="inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-portfolio-primary/10 px-3 py-1 text-sm font-medium text-portfolio-primary"><Sparkles className="h-4 w-4" />A better working relationship</div><h2 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">A website partner who keeps things clear and moving.</h2><p className="mt-5 text-lg leading-8 text-muted-foreground">Practical web expertise, reliable communication, and support that continues after the launch.</p></div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">{reasons.map(reason => { const Icon = reason.icon; return <article key={reason.title} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-portfolio-primary/30 hover:shadow-xl sm:p-7"><span className="absolute right-6 top-5 text-sm font-bold text-portfolio-primary/25">{reason.number}</span><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-portfolio-primary/10 text-portfolio-primary transition-transform duration-300 group-hover:scale-110"><Icon className="h-5 w-5" /></span><h3 className="mt-6 text-xl font-semibold text-foreground">{reason.title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{reason.description}</p></article> })}</div>

      <div className="mt-5 grid gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center sm:p-8"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-portfolio-accent/15 text-portfolio-accent"><HeartHandshake className="h-6 w-6" /></span><div><p className="text-lg font-semibold text-foreground">A partner for the work after launch, too.</p><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Need a new page, a quick fix, a product update, or advice on the next step? You have one reliable place to go.</p></div></div><div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">{outcomes.map(outcome => <div key={outcome} className="flex items-start gap-2 text-sm font-medium leading-5 text-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-portfolio-accent" />{outcome}</div>)}</div></div>
    </div>
  </section>
}

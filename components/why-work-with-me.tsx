"use client"

import { CheckCircle2, Clock3, HeartHandshake, MessageCircleMore, ShieldCheck, Sparkles } from "lucide-react"

const reasons = [
  { icon: MessageCircleMore, title: "Clear from day one", description: "You get practical advice, a focused plan, and updates you can understand—without technical confusion." },
  { icon: Clock3, title: "Respect for your time", description: "I keep projects moving with focused priorities, reliable communication, and a response within 2–4 business hours." },
  { icon: ShieldCheck, title: "Built to stay dependable", description: "Every website is approached with mobile usability, performance, security, and maintainability in mind." },
]

const outcomes = ["A website that feels professional and easy to use", "One reliable point of contact for fixes, updates, and growth", "A clear hand-off so you stay in control of your website"]

export function WhyWorkWithMe() {
  return <section id="why-me" className="bg-muted/35 py-20 dark:bg-slate-900/50 sm:py-24">
    <div className="container mx-auto px-4">
      <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div><div className="inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-portfolio-primary/10 px-3 py-1 text-sm font-medium text-portfolio-primary"><Sparkles className="h-4 w-4" />A better working relationship</div><h2 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Your website should feel like a strength, not another task to manage.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">I combine practical web skills with dependable support, so you can focus on the business while your website keeps moving forward.</p><div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-portfolio-accent/15 text-portfolio-accent"><HeartHandshake className="h-5 w-5" /></span><div><p className="font-semibold text-foreground">A partner for the work after launch, too.</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Need a new page, a quick fix, a product update, or advice on the next step? You have a clear place to go.</p></div></div></div></div>
        <div className="grid gap-4"><div className="grid gap-4 sm:grid-cols-3">{reasons.map(reason => { const Icon = reason.icon; return <article key={reason.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-portfolio-primary/30 hover:shadow-lg"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-portfolio-primary/10 text-portfolio-primary"><Icon className="h-5 w-5" /></span><h3 className="mt-5 font-semibold text-foreground">{reason.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{reason.description}</p></article> })}</div><div className="rounded-3xl bg-gradient-to-br from-portfolio-primary to-portfolio-accent p-7 text-portfolio-primary-foreground shadow-xl shadow-portfolio-primary/20"><p className="text-sm font-semibold uppercase tracking-[.16em] opacity-75">What you can expect</p><div className="mt-5 grid gap-4 sm:grid-cols-3">{outcomes.map(outcome => <div key={outcome} className="flex gap-2 text-sm leading-6"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{outcome}</div>)}</div></div></div>
      </div>
    </div>
  </section>
}

import Link from 'next/link'
import { ArrowRight, ClipboardList, Clock3, ReceiptText } from 'lucide-react'

const steps = [
  { icon: ClipboardList, title: 'Share the task', text: 'Send the goal, the platform or tools involved, and any useful links or files.' },
  { icon: ReceiptText, title: 'Receive a clear scope', text: 'The work is reviewed so the effort, priorities, and most practical format are clear.' },
  { icon: Clock3, title: 'Choose the right support', text: 'Use a one-time task, a focused project, or ongoing support when work repeats.' },
]

export function PricingGuide() {
  return (
    <section id="pricing" className="border-t border-border bg-muted/25 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[.16em] text-portfolio-primary">How pricing works</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">A quote that fits the work, not a one-size-fits-all package.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">Quotes are based on the task scope, number of items or pages, required turnaround, and the level of ongoing support you need.</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-7">
              <div className="flex items-center justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-portfolio-primary/10 text-portfolio-primary"><Icon className="h-5 w-5" /></span><span className="text-sm font-bold text-portfolio-primary/40">0{index + 1}</span></div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-5 rounded-[2rem] border border-portfolio-primary/20 bg-portfolio-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div><h3 className="text-xl font-bold tracking-tight text-foreground">No surprises before work begins.</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">You&apos;ll receive a practical recommendation and a clear next step before committing to the work.</p></div>
          <Link href="/start-project" className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-portfolio-primary px-5 py-3 text-sm font-semibold text-portfolio-primary-foreground shadow-lg shadow-portfolio-primary/20 transition hover:bg-portfolio-primary/90 sm:w-auto">Request a tailored quote <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  )
}

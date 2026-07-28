import type { Metadata } from 'next'
import { CalendarCheck2, CheckCircle2, Clock3, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { PageFooter } from '@/components/page-footer'
import { SiteHeader } from '@/components/site-header'
import { CalBookingEmbed } from '@/components/cal-booking-embed'

export const metadata: Metadata = {
  title: 'Book a Free Project Call',
  description: 'Book a free 20-minute project discovery call with Leon Islam for website, e-commerce, Amazon, data entry, or admin support.',
  alternates: { canonical: '/book-call' },
}

export default function BookCallPage() {
  return <>
    <SiteHeader />
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-muted/25 py-14 sm:py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[.16em] text-portfolio-primary"><CalendarCheck2 className="h-3.5 w-3.5" /> Free discovery call</span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">Let’s make the next step clear.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Book a free 20-minute call to discuss your task, priorities, and the most useful way to move forward.</p>
          <div className="mx-auto mt-7 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
            {[[Clock3, '20 minutes', 'A focused discovery call'], [CheckCircle2, 'No obligation', 'A practical next step'], [MessageSquare, 'Come prepared', 'Bring links or questions']].map(([Icon, title, text]) => { const ItemIcon = Icon as typeof Clock3; return <div key={title as string} className="rounded-2xl border border-border bg-card p-4"><ItemIcon className="h-5 w-5 text-portfolio-primary" /><p className="mt-3 text-sm font-semibold">{title as string}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{text as string}</p></div> })}
          </div>
        </div>
      </section>
      <section className="container mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <CalBookingEmbed />
        <p className="mt-6 text-center text-sm text-muted-foreground">Prefer to write first? <Link href="/start-project" className="font-semibold text-portfolio-primary hover:underline">Start a project request</Link>.</p>
      </section>
    </main>
    <PageFooter />
  </>
}

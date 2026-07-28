import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock3, Globe2, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { PageFooter } from '@/components/page-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'About Leon Islam',
  description: 'Learn about Leon Islam, a Bangladesh-based website, e-commerce, Amazon, data entry, and admin support specialist working with clients worldwide.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Leon Islam',
    description: 'Practical website, e-commerce, Amazon, and admin support for businesses worldwide.',
    url: 'https://leonislam.com/about',
  },
}

const principles = [
  { icon: CheckCircle2, title: 'Clear, careful work', text: 'Tasks are handled with attention to the details that keep website content, product data, and online records accurate.' },
  { icon: Clock3, title: 'Responsive communication', text: 'You receive clear updates and practical questions when something needs confirmation before work moves forward.' },
  { icon: ShieldCheck, title: 'Reliable support', text: 'Whether you have one focused task or recurring work, the goal is to make your online operations easier to manage.' },
]

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border bg-muted/35 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,.16),transparent_28rem),radial-gradient(circle_at_88%_72%,rgba(20,184,166,.12),transparent_30rem)]" />
        <div className="container relative mx-auto px-4">
          <Link href="/" className="text-sm font-medium text-portfolio-primary hover:underline">Back to home</Link>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[.16em] text-portfolio-primary shadow-sm"><Sparkles className="h-3.5 w-3.5" /> About Leon Islam</span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">Practical support for the work that keeps your business moving.</h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">I&apos;m Leon Islam, a Bangladesh-based online support specialist helping businesses manage website updates, e-commerce product data, Amazon catalog work, and recurring admin tasks.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/#contact" className="inline-flex items-center gap-2 rounded-xl bg-portfolio-primary px-5 py-3 text-sm font-semibold text-portfolio-primary-foreground shadow-lg shadow-portfolio-primary/20 hover:bg-portfolio-primary/90">Discuss your task <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/services" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:border-portfolio-primary/30 hover:text-portfolio-primary">Explore services</Link>
              </div>
            </div>
            <aside className="rounded-[2rem] border border-portfolio-primary/20 bg-card p-7 shadow-xl shadow-portfolio-primary/5 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-portfolio-primary/10 text-portfolio-primary"><Globe2 className="h-6 w-6" /></div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[.16em] text-portfolio-primary">Working globally</p>
              <p className="mt-3 text-2xl font-bold tracking-tight">Based in Bangladesh. Supporting businesses worldwide.</p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">Remote-friendly communication, organized handovers, and flexible support for the online work that needs careful attention.</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-portfolio-primary">How I work</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Simple processes. Useful progress.</h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">The focus is on taking repetitive, detail-heavy tasks off your plate, keeping the work organized, and making it easy for you to see what has been completed.</p>
            <a href="mailto:info@leonislam.com" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-portfolio-primary hover:underline"><Mail className="h-4 w-4" /> info@leonislam.com</a>
          </div>
          <div className="grid gap-4">
            {principles.map(({ icon: Icon, title, text }) => (
              <article key={title} className="flex gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-portfolio-primary/10 text-portfolio-primary"><Icon className="h-5 w-5" /></span>
                <div><h3 className="text-lg font-semibold text-foreground">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/25 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[.16em] text-portfolio-primary">Support areas</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Website, catalog, and admin tasks handled with care.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">From a single update to an ongoing workflow, you can request help with website management, e-commerce listings, Amazon product data, research, data entry, and online admin work.</p>
          <Link href="/services" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-portfolio-primary px-5 py-3 text-sm font-semibold text-portfolio-primary-foreground shadow-lg shadow-portfolio-primary/20 hover:bg-portfolio-primary/90">See all services <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
      </main>
      <PageFooter />
    </>
  )
}

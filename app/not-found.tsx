import Link from 'next/link'
import { ArrowRight, Compass, Home, MessageSquare } from 'lucide-react'
import { PageFooter } from '@/components/page-footer'
import { SiteHeader } from '@/components/site-header'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="relative flex min-h-[70vh] items-center overflow-hidden bg-background py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_22%,rgba(99,102,241,.16),transparent_27rem),radial-gradient(circle_at_88%_75%,rgba(20,184,166,.12),transparent_30rem)]" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-portfolio-primary/10 text-portfolio-primary"><Compass className="h-8 w-8" /></span>
            <p className="mt-7 text-sm font-semibold uppercase tracking-[.2em] text-portfolio-primary">Error 404</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">This page has moved on.</h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted-foreground">The link may be outdated or the page may no longer exist. You can still find the support you need below.</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-portfolio-primary px-5 py-3 text-sm font-semibold text-portfolio-primary-foreground shadow-lg shadow-portfolio-primary/20 hover:bg-portfolio-primary/90"><Home className="h-4 w-4" /> Go to home</Link>
              <Link href="/services" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:border-portfolio-primary/30 hover:text-portfolio-primary">Explore services <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-portfolio-primary hover:underline"><MessageSquare className="h-4 w-4" /> Need help with a task? Request a quote</Link>
          </div>
        </div>
      </main>
      <PageFooter />
    </>
  )
}

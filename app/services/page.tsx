import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ClipboardList, Sparkles } from 'lucide-react'
import { servicePages } from '@/lib/service-pages'
import { PageFooter } from '@/components/page-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore website management, e-commerce product listing, Amazon catalog, data entry, and virtual admin support services from Leon Islam.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | Leon Islam',
    description: 'Website, e-commerce, Amazon, data entry, and virtual admin support for organized online operations.',
    url: 'https://leonislam.com/services',
  },
}

export default function ServicesOverviewPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Leon Islam Services',
    itemListElement: servicePages.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.title,
      url: `https://leonislam.com/services/${service.slug}`,
    })),
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border bg-muted/35 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(99,102,241,.16),transparent_29rem),radial-gradient(circle_at_90%_70%,rgba(20,184,166,.13),transparent_30rem)]" />
        <div className="container relative mx-auto px-4">
          <Link href="/" className="text-sm font-medium text-portfolio-primary hover:underline">← Back to home</Link>
          <div className="mx-auto mt-10 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[.16em] text-portfolio-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" /> Services overview
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">Reliable support for the work behind your online business.</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">Choose a focused task or combine services for a practical workflow across your website, store, catalog, and daily admin work.</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-2">
          {servicePages.map((service, index) => (
            <article key={service.slug} className="group flex flex-col rounded-[2rem] border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-portfolio-primary/30 hover:shadow-xl sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-portfolio-primary/10 text-sm font-bold text-portfolio-primary">0{index + 1}</span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{service.eyebrow}</span>
              </div>
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">{service.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{service.intro}</p>
              <ul className="mt-6 space-y-3 border-t border-border pt-6">
                {service.services.slice(0, 3).map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-portfolio-accent" />{item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-portfolio-primary/30 hover:text-portfolio-primary">
                  Explore service <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={`/contact?service=${encodeURIComponent(service.contactService)}`} className="inline-flex items-center gap-2 rounded-xl bg-portfolio-primary px-4 py-2.5 text-sm font-semibold text-portfolio-primary-foreground shadow-sm transition hover:bg-portfolio-primary/90">
                  Request a quote
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/25 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-[2rem] border border-portfolio-primary/20 bg-portfolio-primary/5 p-7 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-portfolio-primary shadow-sm"><ClipboardList className="h-5 w-5" /></span>
                <h2 className="mt-5 text-2xl font-bold tracking-tight">Not sure which service fits?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Send a short description of your task, and you&apos;ll receive a practical recommendation for the best next step.</p>
              </div>
              <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-portfolio-primary px-5 py-3 text-sm font-semibold text-portfolio-primary-foreground shadow-lg shadow-portfolio-primary/20 hover:bg-portfolio-primary/90">
                Discuss your needs <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      </main>
      <PageFooter />
    </>
  )
}

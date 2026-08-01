import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ClipboardList, Gauge, Layers3, RefreshCw, Sparkles } from 'lucide-react'
import { servicePages } from '@/lib/service-pages'
import { PageFooter } from '@/components/page-footer'
import { PricingGuide } from '@/components/pricing-guide'
import { SiteHeader } from '@/components/site-header'
import { PublishedContentSections } from '@/components/published-content-sections'
import { getPublishedPage } from '@/lib/published-content'

export async function generateMetadata(): Promise<Metadata> {
  const publishedPage = await getPublishedPage('services')
  const title = publishedPage?.seo_title || publishedPage?.title || 'Services'
  const description = publishedPage?.seo_description || publishedPage?.excerpt || 'Explore website management, e-commerce product listing, Amazon catalog, data entry, and virtual admin support services from Leon Islam.'
  return {
    title,
    description,
    alternates: { canonical: '/services' },
    openGraph: { title, description, url: 'https://leonislam.com/services' },
  }
}

export default async function ServicesOverviewPage() {
  const publishedPage = await getPublishedPage('services')
  const sections = publishedPage?.body?.sections ?? []
  const heroSection = sections.find((section) => section.type === 'hero')
  const supportOptions = [
    {
      icon: ClipboardList,
      title: 'One-time task',
      description: 'Best for a defined update, a small catalog task, a website fix, or a focused data job.',
      examples: ['A clear list of tasks', 'A practical deadline', 'A completed-work summary'],
    },
    {
      icon: Layers3,
      title: 'Focused project',
      description: 'For a larger set of connected tasks that benefit from an organized plan and staged handover.',
      examples: ['Agreed priorities', 'Organized source files', 'Progress updates as work moves forward'],
    },
    {
      icon: RefreshCw,
      title: 'Ongoing support',
      description: 'For recurring website, catalog, research, or admin work that needs a reliable point of contact.',
      examples: ['A repeatable task list', 'Flexible support cadence', 'Clear reporting and next steps'],
    },
  ]

  const serviceComparison = [
    { service: 'Website management', bestFor: 'Keeping a website accurate, current, and easy to use', examples: 'Content updates, fixes, product uploads, routine checks', platforms: 'WordPress, Shopify, Wix' },
    { service: 'E-commerce listings', bestFor: 'Organizing a store catalog for customers to browse and buy', examples: 'Titles, descriptions, images, categories, variants', platforms: 'Shopify, WooCommerce, marketplaces' },
    { service: 'Amazon catalog support', bestFor: 'Preparing or updating product data for Amazon workflows', examples: 'Attributes, variations, bullets, catalog spreadsheets', platforms: 'Amazon Seller Central, spreadsheets' },
    { service: 'Data & admin support', bestFor: 'Handling accurate, repeatable online business tasks', examples: 'Research, cleanup, list building, CRM and reporting', platforms: 'Google Sheets, Excel, online tools' },
  ]

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
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">{heroSection?.heading || 'Reliable support for the work behind your online business.'}</h1>
            <p className="mt-6 whitespace-pre-line text-lg leading-8 text-muted-foreground sm:text-xl">{heroSection?.body || 'Choose a focused task or combine services for a practical workflow across your website, store, catalog, and daily admin work.'}</p>
          </div>
        </div>
      </section>

      <PublishedContentSections sections={sections} />

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

      <section className="border-t border-border bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-portfolio-primary">Quick comparison</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Find the support that matches your task.</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">Use this guide to identify the best starting point. Services can be combined when a project needs more than one type of support.</p>
          </div>
          <div className="mx-auto mt-12 hidden max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground"><tr><th className="px-6 py-4">Service</th><th className="px-6 py-4">Best for</th><th className="px-6 py-4">Typical tasks</th><th className="px-6 py-4">Platforms</th></tr></thead>
              <tbody className="divide-y divide-border">
                {serviceComparison.map((item) => <tr key={item.service} className="align-top"><th scope="row" className="px-6 py-5 font-semibold text-foreground">{item.service}</th><td className="px-6 py-5 leading-6 text-muted-foreground">{item.bestFor}</td><td className="px-6 py-5 leading-6 text-muted-foreground">{item.examples}</td><td className="px-6 py-5 leading-6 text-muted-foreground">{item.platforms}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="mx-auto mt-10 grid max-w-6xl gap-4 md:hidden">
            {serviceComparison.map((item) => <article key={item.service} className="rounded-3xl border border-border bg-card p-6 shadow-sm"><h3 className="text-lg font-semibold text-foreground">{item.service}</h3><dl className="mt-5 space-y-4 text-sm"><div><dt className="font-medium text-foreground">Best for</dt><dd className="mt-1 leading-6 text-muted-foreground">{item.bestFor}</dd></div><div><dt className="font-medium text-foreground">Typical tasks</dt><dd className="mt-1 leading-6 text-muted-foreground">{item.examples}</dd></div><div><dt className="font-medium text-foreground">Platforms</dt><dd className="mt-1 leading-6 text-muted-foreground">{item.platforms}</dd></div></dl></article>)}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/25 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-portfolio-primary">Flexible support</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Choose the level of support that fits the work.</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">Start with one task, plan a focused project, or keep a dependable partner available for recurring online work.</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-3">
            {supportOptions.map(({ icon: Icon, title, description, examples }) => (
              <article key={title} className="rounded-[2rem] border border-border bg-card p-7 shadow-sm sm:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-portfolio-primary/10 text-portfolio-primary"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-6 text-2xl font-bold tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                <ul className="mt-6 space-y-3 border-t border-border pt-6">
                  {examples.map((example) => <li key={example} className="flex gap-3 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-portfolio-accent" />{example}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PricingGuide />

      <section className="border-t border-border bg-muted/25 py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-[2rem] border border-portfolio-primary/20 bg-portfolio-primary/5 p-7 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-portfolio-primary shadow-sm"><ClipboardList className="h-5 w-5" /></span>
                <h2 className="mt-5 text-2xl font-bold tracking-tight">Not sure which service fits?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Send a short description of your task, and you&apos;ll receive a practical recommendation for the best next step.</p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link href="/free-audit" className="inline-flex items-center justify-center gap-2 rounded-xl border border-portfolio-primary/25 bg-card px-5 py-3 text-sm font-semibold text-portfolio-primary transition hover:bg-portfolio-primary/10">
                  Free website audit <Gauge className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-portfolio-primary px-5 py-3 text-sm font-semibold text-portfolio-primary-foreground shadow-lg shadow-portfolio-primary/20 hover:bg-portfolio-primary/90">
                  Discuss your needs <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
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

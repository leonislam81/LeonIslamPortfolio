import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, CalendarDays, CheckCircle2, HelpCircle, Mail, Sparkles } from 'lucide-react'
import { BookingLink } from '@/components/booking-link'
import { getServicePage, servicePages } from '@/lib/service-pages'
import { PageFooter } from '@/components/page-footer'
import { SiteHeader } from '@/components/site-header'

const siteUrl = 'https://leonislam.com'

export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = getServicePage(slug)
  if (!service) return {}

  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.description,
      url: `${siteUrl}/services/${service.slug}`,
    },
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getServicePage(slug)
  if (!service) notFound()

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  const serviceSchema = {
    '@type': 'Service',
    '@id': `${siteUrl}/services/${service.slug}#service`,
    name: service.title,
    description: service.description,
    url: `${siteUrl}/services/${service.slug}`,
    serviceType: service.title,
    provider: { '@id': 'https://leonislam.com/#person' },
    areaServed: 'Worldwide',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${siteUrl}/contact?service=${encodeURIComponent(service.contactService)}`,
      servicePhone: '+8801521783498',
      serviceSmsNumber: '+8801521783498',
    },
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [serviceSchema, faqSchema],
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border bg-muted/35 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,.13),transparent_30rem),radial-gradient(circle_at_85%_75%,rgba(20,184,166,.10),transparent_28rem)]" />
        <div className="container relative mx-auto px-4">
          <Link href="/" className="text-sm font-medium text-portfolio-primary hover:underline">â† Back to home</Link>
          <div className="mt-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-card px-3 py-1 text-sm font-medium text-portfolio-primary">
              <Sparkles className="h-4 w-4" />{service.eyebrow}
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">{service.title}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">{service.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Link href={`/contact?service=${encodeURIComponent(service.contactService)}`} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-portfolio-primary px-5 py-3 text-sm font-semibold text-portfolio-primary-foreground shadow-lg shadow-portfolio-primary/20 hover:bg-portfolio-primary/90 sm:w-auto">Discuss this service <ArrowRight className="h-4 w-4" /></Link><BookingLink placement="service" bookingDetails={service.title} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted sm:w-auto">Book a call about this <CalendarDays className="h-4 w-4" /></BookingLink></div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-portfolio-primary">What I can help with</p>
            <div className="mt-6 grid gap-3">
              {service.services.map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-border bg-card p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-portfolio-accent" />
                  <span className="text-sm leading-6 text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <aside className="h-fit rounded-3xl border border-portfolio-primary/20 bg-portfolio-primary/5 p-7">
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-portfolio-primary">What you can expect</p>
            <div className="mt-6 space-y-4">
              {service.outcomes.map((outcome) => (
                <div key={outcome} className="flex items-center gap-3 text-sm font-medium">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-card text-portfolio-primary shadow-sm">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  {outcome}
                </div>
              ))}
            </div>
            <a href="mailto:info@leonislam.com?subject=Service%20Inquiry" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-portfolio-primary hover:underline">
              <Mail className="h-4 w-4" />Email Leon directly
            </a>
          </aside>
        </div>
      </section>

      <section className="border-t border-border bg-muted/25 py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[.16em] text-portfolio-primary">
              <HelpCircle className="h-3.5 w-3.5" />Frequently asked questions
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Helpful details before you begin</h2>
          </div>
          <div className="mt-10 space-y-3">
            {service.faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-border bg-card p-5 shadow-sm">
                <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-foreground marker:hidden">
                  {faq.question}<span className="float-right text-xl font-normal text-portfolio-primary transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 border-t border-border pt-4 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </main>
      <PageFooter />
    </>
  )
}

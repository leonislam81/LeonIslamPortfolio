import type { Metadata } from 'next'
import { CalendarCheck2, CalendarDays, CheckCircle2, ClipboardList, FileText, Send } from 'lucide-react'
import { BookingLink } from '@/components/booking-link'
import { ProjectRequestWizard } from '@/components/project-request-wizard'
import { PageFooter } from '@/components/page-footer'
import { SiteHeader } from '@/components/site-header'
import { PublishedContentSections } from '@/components/published-content-sections'
import { getPublishedPage } from '@/lib/published-content'

export async function generateMetadata(): Promise<Metadata> {
  const publishedPage = await getPublishedPage('start-project')
  const title = publishedPage?.seo_title || publishedPage?.title || 'Start a Project'
  const description = publishedPage?.seo_description || publishedPage?.excerpt || 'Start a website, e-commerce, Amazon catalog, data entry, or admin support project with Leon Islam. Share the task details and receive a clear next step.'
  return {
    title,
    description,
    alternates: { canonical: '/start-project' },
    openGraph: { title, description, url: 'https://leonislam.com/start-project' },
  }
}

const steps = [
  { icon: ClipboardList, title: 'Choose the support you need', text: 'Select a service or choose “Something else” if your task combines a few areas.' },
  { icon: FileText, title: 'Share the useful details', text: 'Add the outcome, timeline, and any link or file that helps explain the work.' },
  { icon: Send, title: 'Receive a clear next step', text: 'Your request is reviewed and the best practical way to move forward is confirmed.' },
]

export default async function StartProjectPage() {
  const publishedPage = await getPublishedPage('start-project')
  const sections = publishedPage?.body?.sections ?? []
  const heroSection = sections.find((section) => section.type === 'hero')
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="bg-background text-foreground">
        <section className="border-b border-border bg-muted/25 py-14 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[.16em] text-portfolio-primary shadow-sm"><CheckCircle2 className="h-3.5 w-3.5" /> Start a project</span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">{heroSection?.heading || 'A simple way to get the right support in place.'}</h1>
              <p className="mt-5 whitespace-pre-line text-lg leading-8 text-muted-foreground sm:text-xl">{heroSection?.body || 'Whether you have one focused task or recurring online work, share the details below and get a clear next step.'}</p>
              <div className="mt-6"><BookingLink placement="start_project" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-portfolio-primary px-5 py-3 text-sm font-semibold text-portfolio-primary-foreground shadow-sm transition hover:bg-portfolio-primary/90 sm:w-auto"><CalendarDays className="h-4 w-4" /> Prefer to talk first? Book a free 20-minute call</BookingLink><p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground"><CalendarCheck2 className="h-4 w-4 shrink-0 text-portfolio-accent" />Monday–Saturday, 9 AM–8 PM Bangladesh time</p></div>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
              {steps.map(({ icon: Icon, title, text }, index) => <article key={title} className="rounded-3xl border border-border bg-card p-6 shadow-sm"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-portfolio-primary/10 text-sm font-bold text-portfolio-primary">0{index + 1}</span><Icon className="mt-5 h-5 w-5 text-portfolio-accent" /><h2 className="mt-4 text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}
            </div>
          </div>
        </section>
        <PublishedContentSections sections={sections} />
        <ProjectRequestWizard />
      </main>
      <PageFooter />
    </>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bot, CalendarDays, ChevronRight, Clock3, FileText, MessageCircle, X } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

type ServiceOption = {
  label: string
  contactService: string
}

const services: ServiceOption[] = [
  { label: 'Website management', contactService: 'Website management & updates' },
  { label: 'E-commerce listings', contactService: 'E-commerce product listings' },
  { label: 'Amazon catalog support', contactService: 'Amazon product listing support' },
  { label: 'Data & admin support', contactService: 'Data entry & admin support' },
  { label: 'I’m not sure yet', contactService: 'Something else' },
]

const quickAnswers = [
  { question: 'What can Leon help with?', answer: 'Website updates, e-commerce listings, Amazon catalog tasks, data entry, research, spreadsheets, and recurring admin support.' },
  { question: 'How does pricing work?', answer: 'Quotes are based on scope, number of items or pages, turnaround time, and whether the work is one-time or ongoing.' },
  { question: 'When will I get a reply?', answer: 'Business-day responses are usually within 2–4 hours. Free discovery calls are available Monday–Saturday.' },
]

export function ProjectAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null)
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)

  const openAssistant = () => {
    setIsOpen(true)
    trackEvent('project_assistant_open', { event_category: 'engagement' })
  }

  const chooseService = (service: ServiceOption) => {
    setSelectedService(service)
    setSelectedTimeline(null)
    setAnswer(null)
    trackEvent('project_assistant_service_selected', { event_category: 'engagement', service_interest: service.contactService })
  }

  const chooseTimeline = (timeline: string) => {
    setSelectedTimeline(timeline)
    trackEvent('project_assistant_timeline_selected', { event_category: 'engagement', timeline })
  }

  const showAnswer = (nextAnswer: string) => {
    setAnswer(nextAnswer)
    trackEvent('project_assistant_question_opened', { event_category: 'engagement' })
  }

  const bookingUrl = selectedService
    ? `https://cal.com/leobislam/project-discovery?project-details=${encodeURIComponent(selectedService.label)}${selectedTimeline ? `&timeline=${encodeURIComponent(selectedTimeline)}` : ''}`
    : 'https://cal.com/leobislam/project-discovery'
  const whatsappUrl = `https://wa.me/8801521783498?text=${encodeURIComponent(`Hi Leon! I need help with ${selectedService?.label ?? 'a project'}${selectedTimeline ? `, ideally ${selectedTimeline}` : ''}.`)}`
  const quoteUrl = selectedService ? `/contact?service=${encodeURIComponent(selectedService.contactService)}` : '/contact'

  return (
    <div className="fixed bottom-24 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section id="project-assistant-panel" aria-label="Project assistant" className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-slate-950/20">
          <header className="flex items-start justify-between gap-4 bg-gradient-to-r from-portfolio-primary to-portfolio-accent p-5 text-portfolio-primary-foreground">
            <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/15"><Bot className="h-5 w-5" /></span><div><h2 className="font-semibold">Project Assistant</h2><p className="mt-1 text-xs leading-5 text-white/80">Find the most useful next step in under a minute.</p></div></div>
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg p-1 text-white/80 transition hover:bg-white/15 hover:text-white" aria-label="Close project assistant"><X className="h-5 w-5" /></button>
          </header>
          <div className="max-h-[min(32rem,calc(100vh-11rem))] overflow-y-auto p-5">
            {!selectedService ? (
              <>
                <p className="text-sm font-medium text-foreground">What would you like help with?</p>
                <div className="mt-3 grid gap-2">
                  {services.map((service) => <button key={service.label} type="button" onClick={() => chooseService(service)} className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-left text-sm font-medium text-foreground transition hover:border-portfolio-primary/30 hover:bg-portfolio-primary/5"><span>{service.label}</span><ChevronRight className="h-4 w-4 text-portfolio-primary" /></button>)}
                </div>
                <div className="mt-5 border-t border-border pt-5"><p className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">Quick answers</p><div className="mt-2 space-y-1">{quickAnswers.map((item) => <button key={item.question} type="button" onClick={() => showAnswer(item.answer)} className="block w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-portfolio-primary transition hover:bg-portfolio-primary/5">{item.question}</button>)}</div>{answer && <p className="mt-3 rounded-xl bg-muted p-3 text-sm leading-6 text-muted-foreground">{answer}</p>}</div>
              </>
            ) : !selectedTimeline ? (
              <>
                <button type="button" onClick={() => setSelectedService(null)} className="text-sm font-medium text-portfolio-primary hover:underline">← Change service</button>
                <p className="mt-4 text-sm font-medium text-foreground">When would you like to start {selectedService.label.toLowerCase()}?</p>
                <div className="mt-3 grid gap-2">{['as soon as possible', 'within 1 week', 'within 2–4 weeks', 'planning ahead'].map((timeline) => <button key={timeline} type="button" onClick={() => chooseTimeline(timeline)} className="rounded-xl border border-border px-4 py-3 text-left text-sm font-medium text-foreground transition hover:border-portfolio-primary/30 hover:bg-portfolio-primary/5">{timeline.charAt(0).toUpperCase() + timeline.slice(1)}</button>)}</div>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-foreground">A good next step is ready.</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">For {selectedService.label.toLowerCase()} {selectedTimeline}, choose the way you&apos;d like to continue.</p>
                <div className="mt-5 grid gap-2"><a href={bookingUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent('project_assistant_booking_click', { event_category: 'engagement', service_interest: selectedService.contactService })} className="inline-flex items-center justify-center gap-2 rounded-xl bg-portfolio-primary px-4 py-3 text-sm font-semibold text-portfolio-primary-foreground transition hover:bg-portfolio-primary/90"><CalendarDays className="h-4 w-4" />Book a free call</a><a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent('project_assistant_whatsapp_click', { event_category: 'engagement', service_interest: selectedService.contactService })} className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500/10 dark:text-emerald-400"><MessageCircle className="h-4 w-4" />Chat on WhatsApp</a><Link href={quoteUrl} onClick={() => trackEvent('project_assistant_quote_click', { event_category: 'engagement', service_interest: selectedService.contactService })} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"><FileText className="h-4 w-4" />Request a quote</Link></div>
                <button type="button" onClick={() => { setSelectedService(null); setSelectedTimeline(null) }} className="mt-4 w-full text-sm font-medium text-muted-foreground hover:text-portfolio-primary">Start again</button>
              </>
            )}
          </div>
        </section>
      )}
      <button type="button" onClick={isOpen ? () => setIsOpen(false) : openAssistant} aria-expanded={isOpen} aria-controls="project-assistant-panel" aria-label={isOpen ? 'Close project assistant' : 'Open project assistant'} className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-portfolio-primary text-portfolio-primary-foreground shadow-lg shadow-portfolio-primary/30 transition hover:bg-portfolio-primary/90 sm:h-14 sm:w-auto sm:gap-2 sm:px-4 sm:text-sm sm:font-semibold"><Bot className="h-5 w-5" /><span className="hidden sm:inline">{isOpen ? 'Close assistant' : 'Need help?'}</span></button>
    </div>
  )
}

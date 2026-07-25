import type { Metadata } from 'next'
import type React from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react'
import { PageFooter } from '@/components/page-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Leon Islam collects, uses, and protects website visitor information.',
  alternates: { canonical: '/privacy' },
}

const updatedDate = 'July 25, 2026'

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen bg-slate-50 text-foreground dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-portfolio-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <header className="mt-10 rounded-[2rem] border border-portfolio-primary/20 bg-gradient-to-br from-portfolio-primary to-portfolio-accent px-6 py-10 text-portfolio-primary-foreground shadow-xl shadow-portfolio-primary/20 sm:px-10 sm:py-14">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[.18em] text-white/75">Privacy Policy</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Your information, explained clearly.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
            This page explains what information this website collects, why it is used, and the choices available to you.
          </p>
          <p className="mt-6 text-sm text-white/70">Last updated: {updatedDate}</p>
        </header>

        <article className="mt-8 space-y-6">
          <PolicyCard title="Information collected">
            <p>When you submit the contact form, you may provide your name, email address, requested service, timeline, message, and optional checklist preference.</p>
            <p>Google Analytics also collects aggregated usage information, such as pages viewed, device and browser information, and general interaction data. This helps improve the website and understand which services visitors find useful.</p>
          </PolicyCard>

          <PolicyCard title="How your information is used">
            <p>Contact-form details are used only to respond to your enquiry, prepare a quote, and communicate about requested services. Analytics data is used to measure and improve the website.</p>
            <p>Personal details from the contact form are not sent to Google Analytics. Please do not include sensitive personal, financial, or account information in your message.</p>
          </PolicyCard>

          <PolicyCard title="Services that process information">
            <p>The contact form is delivered through Resend, which sends submitted enquiries to Leon Islam&apos;s email address. Google Analytics is used to understand website traffic and interactions. These providers process information according to their own terms and privacy practices.</p>
          </PolicyCard>

          <PolicyCard title="Cookies and analytics controls">
            <p>Google Analytics may use cookies or similar technologies to measure visitor interactions. Analytics loads only after you choose to accept it in the site&apos;s cookie banner. You can reopen cookie settings from the floating settings button, or control and remove cookies through your browser settings.</p>
          </PolicyCard>

          <PolicyCard title="Data retention and security">
            <p>Enquiry information is kept only for as long as reasonably needed to respond to, manage, or follow up on your request. Reasonable safeguards are used to protect information, but no online transmission or storage method can be guaranteed completely secure.</p>
          </PolicyCard>

          <PolicyCard title="Your choices and contact">
            <p>You can ask about, correct, or request deletion of the personal information you have provided by contacting Leon Islam. This policy may be updated when the website or its services change.</p>
            <a href="mailto:leonislam810@gmail.com" className="mt-4 inline-flex items-center gap-2 font-semibold text-portfolio-primary hover:underline">
              <Mail className="h-4 w-4" /> leonislam810@gmail.com
            </a>
          </PolicyCard>
        </article>
      </div>
      </main>
      <PageFooter />
    </>
  )
}

function PolicyCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">{children}</div>
    </section>
  )
}

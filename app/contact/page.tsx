import type { Metadata } from 'next'
import { Contact } from '@/components/contact'
import { PageFooter } from '@/components/page-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Contact & Request a Quote',
  description: 'Request a quote for website management, e-commerce product listings, Amazon catalog support, data entry, and virtual admin support.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Leon Islam | Request a Quote',
    description: 'Tell Leon about your website, e-commerce, Amazon, data entry, or admin support task.',
    url: 'https://leonislam.com/contact',
  },
}

export default function ContactPage() {
  return <><SiteHeader /><main id="main-content"><Contact headingLevel="h1" /></main><PageFooter /></>
}

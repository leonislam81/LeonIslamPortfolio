import type { Metadata } from 'next'
import { Contact } from '@/components/contact'
import { PageFooter } from '@/components/page-footer'
import { SiteHeader } from '@/components/site-header'
import { PublishedContentSections } from '@/components/published-content-sections'
import { getPublishedPage } from '@/lib/published-content'

export async function generateMetadata(): Promise<Metadata> {
  const publishedPage = await getPublishedPage('contact')
  const title = publishedPage?.seo_title || publishedPage?.title || 'Contact & Request a Quote'
  const description = publishedPage?.seo_description || publishedPage?.excerpt || 'Request a quote for website management, e-commerce product listings, Amazon catalog support, data entry, and virtual admin support.'
  return {
    title,
    description,
    alternates: { canonical: '/contact' },
    openGraph: { title, description, url: 'https://leonislam.com/contact' },
  }
}

export default async function ContactPage() {
  const publishedPage = await getPublishedPage('contact')
  const sections = publishedPage?.body?.sections ?? []
  return <><SiteHeader /><main id="main-content"><PublishedContentSections sections={sections} /><Contact headingLevel="h1" /></main><PageFooter /></>
}

import type { Metadata } from "next"
import type { ReactNode } from "react"
import { PublishedContentSections } from "@/components/published-content-sections"
import { getPublishedPage } from "@/lib/published-content"

export async function generateMetadata(): Promise<Metadata> {
  const publishedPage = await getPublishedPage("free-audit")
  const title = publishedPage?.seo_title || publishedPage?.title || "Free Website Audit | Leon Islam"
  const description = publishedPage?.seo_description || publishedPage?.excerpt || "Find practical improvements for your website with a free website audit."
  return {
    title,
    description,
    alternates: { canonical: "/free-audit" },
    openGraph: { title, description, url: "https://leonislam.com/free-audit" },
  }
}

export default async function FreeAuditLayout({ children }: { children: ReactNode }) {
  const publishedPage = await getPublishedPage("free-audit")
  return <>
    <PublishedContentSections sections={publishedPage?.body?.sections ?? []} />
    {children}
  </>
}

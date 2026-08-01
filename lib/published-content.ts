import { createSupabaseServerClient } from "@/lib/supabase/server"

export type PublishedSection = {
  id: string
  type: "hero" | "rich_text" | "feature_list" | "cta"
  label: string
  heading: string
  body: string
  items: string[]
  buttonLabel: string
  buttonHref: string
}

export type PublishedPage = {
  title: string
  excerpt: string
  seo_title: string | null
  seo_description: string | null
  body: { sections?: PublishedSection[] }
}

export async function getPublishedPage(slug: string) {
  const supabase = await createSupabaseServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("content_pages")
    .select("title, excerpt, seo_title, seo_description, body")
    .eq("slug", slug)
    .eq("status", "Published")
    .maybeSingle()

  if (error || !data) return null
  return data as PublishedPage
}

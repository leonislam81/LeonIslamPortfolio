import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export type SiteAnalyticsSummary = {
  visits: number
  uniqueVisitors: number
  topPages: Array<{ path: string; visits: number }>
  daily: Array<{ label: string; visits: number }>
}

export async function getSiteAnalyticsSummary(): Promise<SiteAnalyticsSummary> {
  const empty = { visits: 0, uniqueVisitors: 0, topPages: [], daily: [] }
  const admin = createSupabaseAdminClient()
  if (!admin) return empty
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await admin.from("site_visits").select("visitor_key,path,created_at").gte("created_at", since).limit(10000)
  if (error || !data) return empty
  const pages = new Map<string, number>()
  const visitors = new Set<string>()
  const days = new Map<string, number>()
  for (const visit of data as Array<{ visitor_key: string; path: string; created_at: string }>) {
    visitors.add(visit.visitor_key)
    pages.set(visit.path, (pages.get(visit.path) ?? 0) + 1)
    const day = visit.created_at.slice(0, 10)
    days.set(day, (days.get(day) ?? 0) + 1)
  }
  const daily = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(Date.now() - (13 - index) * 24 * 60 * 60 * 1000)
    const key = date.toISOString().slice(0, 10)
    return { label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }), visits: days.get(key) ?? 0 }
  })
  return { visits: data.length, uniqueVisitors: visitors.size, topPages: Array.from(pages, ([path, visits]) => ({ path, visits })).sort((a, b) => b.visits - a.visits).slice(0, 5), daily }
}

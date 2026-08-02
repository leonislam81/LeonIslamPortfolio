import { redirect } from "next/navigation"
import { DashboardNotificationsPage } from "@/components/dashboard-notifications-page"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

export default async function DashboardNotificationsRoute() {
  if (!isSupabaseConfigured()) redirect("/dashboard")
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")
  return <DashboardNotificationsPage />
}

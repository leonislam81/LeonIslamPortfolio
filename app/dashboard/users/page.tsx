import { redirect } from "next/navigation"
import { DashboardUsersManager } from "@/components/dashboard-users-manager"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

export default async function DashboardUsersPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard")
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")
  return <DashboardUsersManager />
}

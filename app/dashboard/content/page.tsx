import { redirect } from "next/navigation"
import { DashboardContentEditor } from "@/components/dashboard-content-editor"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

export default async function ContentManagerPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard")
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")
  const { data } = await supabase.from("content_pages").select("*").eq("owner_id", user.id).order("created_at", { ascending: true })
  return <DashboardContentEditor initialPages={(data ?? []) as any} userId={user.id} />
}

import { redirect } from "next/navigation"
import { DashboardBookingsManager } from "@/components/dashboard-bookings-manager"
import { getDashboardMembership } from "@/lib/dashboard-access"
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

export default async function DashboardBookingsPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard")
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/dashboard")
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/dashboard/login")
  const membership = await getDashboardMembership()
  const { data } = await supabase.from("bookings").select("id,booking_uid,status,guest_name,guest_email,guest_timezone,event_title,start_time,end_time,location,notes,created_at").eq("owner_id", membership?.workspaceOwnerId ?? user.id).order("start_time", { ascending: false }).limit(200)
  return <DashboardBookingsManager initialBookings={(data ?? []) as any} />
}

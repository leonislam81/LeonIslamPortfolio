import type { ReactNode } from "react"
import { AdminShell } from "@/components/admin-shell"
import { getDashboardMembership } from "@/lib/dashboard-access"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const membership = await getDashboardMembership()
  if (membership?.user && membership.status !== "Active") redirect("/dashboard/login")
  if (membership?.user && !membership.role) redirect("/dashboard/login")
  return <AdminShell initialRole={membership?.role ?? undefined}>{children}</AdminShell>
}

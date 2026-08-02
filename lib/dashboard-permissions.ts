export type DashboardRole = "Owner" | "Administrator" | "Editor" | "Author" | "Contributor" | "Viewer"

export function canAccessDashboardRoute(role: DashboardRole | null, href: string) {
  if (!role) return false
  if (role === "Owner" || role === "Administrator") return true
  if (href === "/dashboard/activity") return false
  if (href === "/dashboard") return true
  if (href === "/dashboard/content" || href === "/dashboard/site-management") return ["Editor", "Author", "Contributor"].includes(role)
  if (href === "/dashboard/projects" || href === "/dashboard/leads" || href === "/dashboard/marketing" || href === "/dashboard/campaigns") return role === "Editor"
  return false
}

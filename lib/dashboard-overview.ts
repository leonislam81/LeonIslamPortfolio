export const dashboardSections = [
  ["attention", "Attention center"],
  ["quick-actions", "Quick actions"],
  ["workspace", "Workspace modules"],
  ["saved-views", "Saved views"],
  ["reporting", "Business reporting"],
  ["recent-activity", "Recent activity"],
  ["analytics", "Lead analytics"],
  ["calendar", "Follow-up calendar"],
  ["pipeline", "Lead pipeline"],
] as const

export const defaultDashboardSections = dashboardSections.map(([key]) => key)

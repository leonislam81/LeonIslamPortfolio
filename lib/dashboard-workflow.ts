export type DashboardWorkflowSettings = { firstFollowUpDays: number; reAuditDays: number }

export const defaultDashboardWorkflowSettings: DashboardWorkflowSettings = {
  firstFollowUpDays: 3,
  reAuditDays: 30,
}

export function normaliseDashboardWorkflowSettings(value: Partial<DashboardWorkflowSettings>): DashboardWorkflowSettings {
  const numberWithin = (input: unknown, fallback: number, minimum: number, maximum: number) => typeof input === "number" && Number.isInteger(input) && input >= minimum && input <= maximum ? input : fallback
  return {
    firstFollowUpDays: numberWithin(value.firstFollowUpDays, defaultDashboardWorkflowSettings.firstFollowUpDays, 1, 60),
    reAuditDays: numberWithin(value.reAuditDays, defaultDashboardWorkflowSettings.reAuditDays, 7, 365),
  }
}

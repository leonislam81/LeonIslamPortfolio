"use client"

import { ClipboardList, Gauge, Users } from "lucide-react"
import { DashboardAnalytics } from "@/components/dashboard-analytics"
import { DashboardCalendar } from "@/components/dashboard-calendar"
import { DashboardLeadList, type DashboardLead } from "@/components/dashboard-lead-list"
import { DashboardMonthlyReport } from "@/components/dashboard-monthly-report"
import { DashboardNotificationCenter } from "@/components/dashboard-notification-center"
import { DashboardQuickActions } from "@/components/dashboard-quick-actions"
import { DashboardRecentActivity } from "@/components/dashboard-recent-activity"
import { DashboardSavedViews } from "@/components/dashboard-saved-views"
import { DashboardSystemHealth } from "@/components/dashboard-system-health"
import { DashboardWorkspaceHub } from "@/components/dashboard-workspace-hub"

type Project = { id: string; title: string; client_name: string; due_date: string | null; status: string; created_at: string }
type Activity = { id: string; lead_id: string; activity_type: "status_changed" | "notes_saved" | "email_sent"; detail: string; created_at: string }

export function DashboardOverviewContent({ leads, projects, activities, sections, systemHealth }: { leads: DashboardLead[]; projects: Project[]; activities: Activity[]; sections: string[]; systemHealth: { databaseReady: boolean; auditReady: boolean; emailReady: boolean; scheduleReady: boolean } }) {
  const average = (key: "performance" | "seo") => { const values = leads.map((lead) => lead[key]).filter((value): value is number => typeof value === "number"); return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null }
  const show = (section: string) => sections.includes(section)
  return <><div className="mt-7 grid gap-4 sm:grid-cols-3">{[[Users, "Audit leads", leads.length], [Gauge, "Average mobile score", average("performance") === null ? "—" : `${average("performance")}/100`], [ClipboardList, "Average SEO score", average("seo") === null ? "—" : `${average("seo")}/100`]].map(([Icon, label, value]) => { const MetricIcon = Icon as typeof Users; return <article key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><MetricIcon className="size-5 text-sky-700" /><p className="mt-4 text-sm font-semibold text-slate-600">{label as string}</p><p className="mt-2 text-3xl font-bold">{value as string | number}</p></article> })}</div>{show("attention") && <DashboardNotificationCenter leads={leads} projects={projects} />}{show("quick-actions") && <DashboardQuickActions />}{show("workspace") && <DashboardWorkspaceHub />}{show("saved-views") && <DashboardSavedViews />}{show("reporting") && <DashboardMonthlyReport leads={leads} />}{show("recent-activity") && <DashboardRecentActivity activities={activities} projects={projects} />}<DashboardSystemHealth {...systemHealth} />{show("analytics") && <DashboardAnalytics leads={leads} />}{show("calendar") && <DashboardCalendar leads={leads} />}{show("pipeline") && <DashboardLeadList leads={leads} />}</>
}

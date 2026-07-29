"use client"

import type { ReactNode } from "react"
import { BarChart3, CalendarDays, ChevronRight, ClipboardList, ExternalLink, FilePenLine, LayoutDashboard, Settings2, Sparkles } from "lucide-react"
import { usePathname } from "next/navigation"
import { DashboardSignOutButton } from "@/components/dashboard-sign-out-button"

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Site management", href: "/dashboard/site-management", icon: FilePenLine },
  { label: "Leads inbox", href: "/dashboard/leads", icon: ClipboardList },
  { label: "Audit & leads", href: "/dashboard#pipeline", icon: CalendarDays },
  { label: "Analytics", href: "/dashboard#analytics", icon: BarChart3 },
  { label: "Workflow settings", href: "/dashboard/settings", icon: Settings2 },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname === "/dashboard/login") return <>{children}</>
  return <div className="min-h-screen bg-slate-100 text-slate-950 lg:grid lg:grid-cols-[260px_1fr]"><aside className="hidden min-h-screen flex-col bg-slate-950 px-4 py-6 text-slate-100 lg:flex"><a href="/dashboard" className="flex items-center gap-3 rounded-2xl px-3 py-3"><span className="flex size-9 items-center justify-center rounded-xl bg-sky-500 text-slate-950"><Sparkles className="size-5" /></span><span><span className="block text-sm font-bold">Leon Islam</span><span className="block text-xs text-slate-400">Admin workspace</span></span></a><nav className="mt-8 space-y-1">{navigation.map((item) => { const Icon = item.icon; const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href.split("#")[0]); return <a key={item.label} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-sky-500 text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}><Icon className="size-4" />{item.label}</a> })}</nav><div className="mt-8 border-t border-slate-800 pt-6"><p className="px-3 text-xs font-bold uppercase tracking-[.14em] text-slate-500">Coming soon</p><div className="mt-3 space-y-1 px-3 text-sm text-slate-500"><p>Content manager</p><p>Site health</p><p>Projects</p><p>Reports</p></div></div><div className="mt-auto space-y-3 border-t border-slate-800 pt-5"><a href="/" className="flex items-center gap-2 px-3 text-sm font-semibold text-slate-300 hover:text-white"><ExternalLink className="size-4" />View public site</a><DashboardSignOutButton /></div></aside><div className="min-w-0"><header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur lg:hidden"><a href="/dashboard" className="font-bold">Leon Islam Admin</a><a href="/dashboard/settings" className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700">Menu <ChevronRight className="size-4" /></a></header>{children}</div></div>
}

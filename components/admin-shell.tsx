"use client"

import type { ReactNode } from "react"
import {
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FilePenLine,
  FolderKanban,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings2,
  Sparkles,
  Rocket,
  Megaphone,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardSignOutButton } from "@/components/dashboard-sign-out-button"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Site management", href: "/dashboard/site-management", icon: FilePenLine },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Leads inbox", href: "/dashboard/leads", icon: ClipboardList },
  { label: "Workflow settings", href: "/dashboard/settings", icon: Settings2 },
  { label: "Upcoming features", href: "/dashboard/upcoming", icon: Rocket },
  { label: "Marketing audience", href: "/dashboard/marketing", icon: Megaphone },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [newLeadCount, setNewLeadCount] = useState(0)
  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return
    void supabase.from("audit_leads").select("id", { count: "exact", head: true }).eq("status", "New").then(({ count }) => setNewLeadCount(count ?? 0))
  }, [pathname])

  if (pathname === "/dashboard/login") return <>{children}</>

  return (
    <div className={`min-h-screen bg-slate-100 text-slate-950 transition-[grid-template-columns] duration-300 lg:grid ${collapsed ? "lg:grid-cols-[76px_1fr]" : "lg:grid-cols-[260px_1fr]"}`}>
      <aside className={`hidden min-h-screen flex-col bg-slate-950 px-3 py-6 text-slate-100 transition-all duration-300 lg:flex ${collapsed ? "items-center" : ""}`}>
        <div className={`flex w-full items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          <a href="/dashboard" className="flex items-center gap-3 rounded-2xl p-2" title="Leon Islam Admin">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-slate-950"><Sparkles className="size-5" /></span>
            {!collapsed && <span><span className="block text-sm font-bold">Leon Islam</span><span className="block text-xs text-slate-400">Admin workspace</span></span>}
          </a>
          {!collapsed && <button type="button" onClick={() => setCollapsed(true)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Collapse sidebar"><PanelLeftClose className="size-4" /></button>}
        </div>

        {collapsed && <button type="button" onClick={() => setCollapsed(false)} className="mt-6 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Expand sidebar"><PanelLeftOpen className="size-4" /></button>}

        <nav className="mt-8 w-full space-y-1" aria-label="Admin navigation">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)
            return <a key={item.label} href={item.href} title={collapsed ? item.label : undefined} className={`flex items-center rounded-xl py-3 text-sm font-semibold transition ${collapsed ? "justify-center px-3" : "gap-3 px-3"} ${active ? "bg-sky-500 text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}><Icon className="size-4 shrink-0" />{!collapsed && <><span>{item.label}</span>{item.label === "Leads inbox" && newLeadCount > 0 && <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">{newLeadCount}</span>}</>}</a>
          })}
        </nav>

        <div className={`mt-auto w-full space-y-3 border-t border-slate-800 pt-5 ${collapsed ? "flex flex-col items-center" : ""}`}>
          <a href="/" title={collapsed ? "View public site" : undefined} className={`flex items-center text-sm font-semibold text-slate-300 transition hover:text-white ${collapsed ? "justify-center p-2" : "gap-2 px-3"}`}><ExternalLink className="size-4" />{!collapsed && "View public site"}</a>
          <DashboardSignOutButton />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur lg:hidden"><a href="/dashboard" className="font-bold">Leon Islam Admin</a><button type="button" onClick={() => setMobileOpen((value) => !value)} className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700" aria-expanded={mobileOpen}>{mobileOpen ? "Close" : "Menu"} <ChevronRight className={`size-4 transition-transform ${mobileOpen ? "rotate-90" : ""}`} /></button></header>
        {mobileOpen && <nav className="sticky top-[53px] z-20 border-b border-slate-200 bg-white p-3 shadow-lg lg:hidden" aria-label="Mobile admin navigation">{navigation.map((item) => { const Icon = item.icon; const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href); return <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${active ? "bg-sky-100 text-sky-800" : "text-slate-600 hover:bg-slate-50"}`}><Icon className="size-4" />{item.label}</a> })}</nav>}
        {children}
      </div>
    </div>
  )
}

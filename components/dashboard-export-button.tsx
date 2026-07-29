"use client"

import { Download } from "lucide-react"
import type { DashboardLead } from "@/components/dashboard-lead-list"

function safeCell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value)
  const protectedText = /^[=+\-@]/.test(text) ? `'${text}` : text
  return `"${protectedText.replace(/"/g, '""')}"`
}

export function DashboardExportButton({ leads }: { leads: DashboardLead[] }) {
  const download = () => {
    const rows = [
      ["Website", "Email", "Status", "Mobile performance", "SEO score", "Business goal", "Follow-up date", "Re-audit date", "Received"],
      ...leads.map((lead) => [lead.website_url, lead.email, lead.status, lead.performance, lead.seo, lead.business_goal, lead.follow_up_at, lead.re_audit_at, lead.created_at]),
    ]
    const csv = rows.map((row) => row.map(safeCell).join(",")).join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `leon-islam-audit-leads-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return <button type="button" onClick={download} disabled={!leads.length} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"><Download className="size-4" />Export CSV</button>
}

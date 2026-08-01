"use client"

import { Download } from "lucide-react"

type Contact = { lead_name: string | null; email: string; lead_type: string | null; lead_source: string | null; marketing_consent_at: string | null }

export function MarketingExport({ contacts }: { contacts: Contact[] }) {
  const exportContacts = () => {
    const quote = (value: string) => `"${value.replaceAll('"', '""')}"`
    const csv = ["Name,Email,Lead type,Lead source,Opted in at", ...contacts.map((contact) => [contact.lead_name || "", contact.email, contact.lead_type || "General enquiry", contact.lead_source || "Contact form", contact.marketing_consent_at || ""].map(quote).join(","))].join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `marketing-audience-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }
  return <button type="button" onClick={exportContacts} disabled={!contacts.length} className="ml-auto inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"><Download className="size-4" />Export audience</button>
}

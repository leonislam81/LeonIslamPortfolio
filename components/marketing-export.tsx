"use client"

import { Download } from "lucide-react"
import { MarketingUnsubscribe } from "@/components/marketing-unsubscribe"

type Contact = { id: string; lead_name: string | null; email: string; lead_type: string | null; lead_source: string | null; marketing_consent_at: string | null }

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
  return <div className="ml-auto flex flex-wrap items-center justify-end gap-3"><button type="button" onClick={exportContacts} disabled={!contacts.length} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"><Download className="size-4" />Export audience</button>{contacts.length > 0 && <details className="relative"><summary className="cursor-pointer list-none text-xs font-semibold text-slate-500 hover:text-slate-800">Manage opt-ins</summary><div className="absolute right-0 top-8 z-10 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Remove a contact</p><div className="max-h-56 space-y-2 overflow-auto">{contacts.map((contact) => <div key={contact.email} className="flex items-center justify-between gap-2 text-xs"><span className="truncate text-slate-700">{contact.email}</span><MarketingUnsubscribe id={(contact as Contact & { id?: string }).id || ""} /></div>)}</div></div></details>}</div>
}

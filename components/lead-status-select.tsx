"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

const statuses = ["New", "Report sent", "Contacted", "In progress", "Won", "Not a fit"]

export function LeadStatusSelect({ leadId, initialStatus }: { leadId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const saveStatus = async (nextStatus: string) => {
    setStatus(nextStatus)
    setSaving(true)
    setError("")
    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      setError("Dashboard connection is unavailable.")
      setSaving(false)
      return
    }
    const { error: updateError } = await supabase.from("audit_leads").update({ status: nextStatus }).eq("id", leadId)
    if (updateError) {
      setStatus(initialStatus)
      setError("Could not update this lead. Please try again.")
    }
    setSaving(false)
  }

  return <div className="w-fit"><select aria-label="Lead status" value={status} onChange={(event) => saveStatus(event.target.value)} disabled={saving} className="w-fit rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 outline-none ring-1 ring-sky-100 disabled:opacity-60">{!statuses.includes(status) && <option value={status}>{status}</option>}{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select>{error && <p className="mt-1 text-xs text-rose-700">{error}</p>}</div>
}

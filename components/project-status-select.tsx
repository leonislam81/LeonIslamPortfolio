"use client"

import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

const statuses = ["Planned", "In progress", "Waiting", "Completed"]

export function ProjectStatusSelect({ projectId, initialStatus }: { projectId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const save = async (nextStatus: string) => {
    const previous = status
    setStatus(nextStatus)
    setSaving(true)
    setError("")
    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      setStatus(previous)
      setError("Dashboard connection is unavailable.")
      setSaving(false)
      return
    }
    const { error: updateError } = await supabase.from("projects").update({ status: nextStatus }).eq("id", projectId)
    if (updateError) {
      setStatus(previous)
      setError("Could not update the project status.")
    }
    setSaving(false)
  }

  return <div><select aria-label="Project status" value={status} onChange={(event) => void save(event.target.value)} disabled={saving} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800 outline-none ring-1 ring-sky-100 disabled:opacity-60">{!statuses.includes(status) && <option value={status}>{status}</option>}{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select>{error && <p className="mt-2 text-xs text-rose-700">{error}</p>}</div>
}

"use client"

import { FormEvent, useState } from "react"
import { Save } from "lucide-react"
import type { DashboardWorkflowSettings } from "@/lib/dashboard-workflow"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export function DashboardWorkflowSettingsForm({ initial }: { initial: DashboardWorkflowSettings }) {
  const [firstFollowUpDays, setFirstFollowUpDays] = useState(initial.firstFollowUpDays)
  const [reAuditDays, setReAuditDays] = useState(initial.reAuditDays)
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState("saving")
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return setState("error")
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setState("error")
    const { error } = await supabase.from("dashboard_settings").upsert({ owner_id: user.id, first_follow_up_days: firstFollowUpDays, re_audit_days: reAuditDays, updated_at: new Date().toISOString() })
    setState(error ? "error" : "saved")
  }
  return <form onSubmit={save} className="mt-7 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><label className="block text-sm font-semibold">First follow-up after an audit<input type="number" min="1" max="60" required value={firstFollowUpDays} onChange={(event) => { setFirstFollowUpDays(Number(event.target.value)); setState("idle") }} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /><span className="mt-2 block text-sm font-normal leading-6 text-slate-600">Days after the report email is sent.</span></label><label className="block text-sm font-semibold">Re-audit follow-up after request<input type="number" min="7" max="365" required value={reAuditDays} onChange={(event) => { setReAuditDays(Number(event.target.value)); setState("idle") }} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /><span className="mt-2 block text-sm font-normal leading-6 text-slate-600">Days after a visitor asks for a re-audit.</span></label><div className="flex flex-wrap items-center gap-3"><button disabled={state === "saving"} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:opacity-60"><Save className="size-4" />{state === "saving" ? "Saving..." : "Save workflow settings"}</button>{state === "saved" && <p className="text-sm font-medium text-emerald-700">Settings saved. New audits will use them.</p>}{state === "error" && <p className="text-sm font-medium text-rose-700">Could not save. Confirm the dashboard settings SQL has been run.</p>}</div></form>
}

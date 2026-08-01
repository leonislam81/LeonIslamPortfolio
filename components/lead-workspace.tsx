"use client"

import type { FormEvent } from "react"
import { CalendarClock, Check, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

function futureDate(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function LeadWorkspace({ leadId, initialNotes, initialFollowUpAt }: { leadId: string; initialNotes: string | null; initialFollowUpAt: string | null }) {
  const [attribution, setAttribution] = useState<{ leadType: string | null; leadSource: string | null; marketingConsent: boolean } | null>(null)
  const [notes, setNotes] = useState(initialNotes ?? "")
  const [followUpAt, setFollowUpAt] = useState(initialFollowUpAt ?? "")
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const router = useRouter()

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return
    void supabase.from("audit_leads").select("lead_type, lead_source, marketing_consent").eq("id", leadId).single().then(({ data }) => {
      if (data) setAttribution({ leadType: data.lead_type ?? null, leadSource: data.lead_source ?? null, marketingConsent: data.marketing_consent === true })
    })
  }, [leadId])

  const setDate = (date: string) => {
    setFollowUpAt(date)
    setState("idle")
  }

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState("saving")
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return setState("error")

    const { error } = await supabase.from("audit_leads").update({ notes: notes.trim() || null, follow_up_at: followUpAt || null }).eq("id", leadId)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) await supabase.from("audit_lead_activities").insert({ lead_id: leadId, owner_id: user.id, activity_type: "notes_saved", detail: `Workspace notes and follow-up date saved${followUpAt ? ` for ${followUpAt}` : ""}.` })
    }
    setState(error ? "error" : "saved")
    if (!error) router.refresh()
  }

  return (
    <form onSubmit={save} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>{attribution && <div className="mb-4 flex flex-wrap gap-2"><span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">{attribution.leadType || "General enquiry"}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{attribution.leadSource || "Contact form"}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${attribution.marketingConsent ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{attribution.marketingConsent ? "Marketing opt-in" : "No marketing opt-in"}</span></div>}
        <p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Next action</p>
        <h2 className="mt-2 text-xl font-bold">Notes and follow-up</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Keep the next conversation and your private assessment in one place.</p>
      </div>

      <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-sky-950"><CalendarClock className="size-4" />{followUpAt ? `Follow-up planned for ${new Date(`${followUpAt}T00:00:00`).toLocaleDateString()}` : "No follow-up date set"}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[{ label: "Tomorrow", days: 1 }, { label: "In 3 days", days: 3 }, { label: "Next week", days: 7 }].map((option) => <button key={option.label} type="button" onClick={() => setDate(futureDate(option.days))} className="rounded-lg border border-sky-200 bg-white px-2.5 py-1.5 text-xs font-bold text-sky-800 transition hover:border-sky-400">{option.label}</button>)}
        </div>
      </div>

      <label className="block text-sm font-semibold">Follow-up date<input type="date" value={followUpAt} onChange={(event) => setDate(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>
      <label className="block text-sm font-semibold">Private notes<textarea value={notes} onChange={(event) => { setNotes(event.target.value); setState("idle") }} rows={8} placeholder="What should you mention in the follow-up? What did you notice about this website?" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal leading-6 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>
      <div className="flex flex-wrap items-center gap-3"><button disabled={state === "saving"} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:opacity-60"><Save className="size-4" />{state === "saving" ? "Saving..." : "Save workspace"}</button>{state === "saved" && <p className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700"><Check className="size-4" />Saved.</p>}{state === "error" && <p className="text-sm font-medium text-rose-700">Could not save. Please try again.</p>}</div>
    </form>
  )
}

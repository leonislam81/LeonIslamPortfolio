"use client"

import { Check, Eye, SlidersHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { dashboardSections } from "@/lib/dashboard-overview"
import { getWorkspaceOwnerId } from "@/lib/supabase/workspace"

export function DashboardOverviewPreferences({ initial }: { initial: string[] }) {
  const [open, setOpen] = useState(false)
  const [sections, setSections] = useState(initial)
  const [state, setState] = useState<"idle" | "saving" | "error">("idle")
  const router = useRouter()
  const toggle = (key: string) => setSections((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])
  const save = async () => {
    setState("saving")
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return setState("error")
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setState("error")
    const { error } = await supabase.from("dashboard_settings").upsert({ owner_id: await getWorkspaceOwnerId(supabase, user.id), overview_sections: sections, updated_at: new Date().toISOString() })
    if (error) return setState("error")
    setOpen(false)
    setState("idle")
    router.refresh()
  }
  return <div className="relative"><button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"><SlidersHorizontal className="size-4" />Display</button>{open && <div className="absolute right-0 z-40 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"><div className="flex items-start gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><Eye className="size-4" /></span><div><p className="font-bold">Overview display</p><p className="mt-1 text-sm leading-5 text-slate-600">Choose the sections that help you work best.</p></div></div><div className="mt-5 space-y-1">{dashboardSections.map(([key, label]) => { const selected = sections.includes(key); return <button key={key} type="button" onClick={() => toggle(key)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50"><span className={`flex size-5 items-center justify-center rounded-md border ${selected ? "border-sky-700 bg-sky-700 text-white" : "border-slate-300"}`}>{selected && <Check className="size-3.5" />}</span><span className="font-medium">{label}</span></button> })}</div>{state === "error" && <p className="mt-3 text-sm text-rose-700">Could not save. Run the dashboard preferences SQL migration first.</p>}<div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => { setSections(initial); setOpen(false) }} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="button" onClick={() => void save()} disabled={state === "saving"} className="rounded-lg bg-sky-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{state === "saving" ? "Saving..." : "Save layout"}</button></div></div>}</div>
}

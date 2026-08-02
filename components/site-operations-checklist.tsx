"use client"

import { Check, CircleAlert, ClipboardCheck } from "lucide-react"
import { useMemo, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getWorkspaceOwnerId } from "@/lib/supabase/workspace"

const tasks = [
  { key: "review-homepage", title: "Review the homepage message", description: "Confirm your main offer, proof, and primary call to action are still accurate." },
  { key: "run-site-audit", title: "Run a fresh site audit", description: "Check mobile performance and essential SEO signals after meaningful updates." },
  { key: "check-contact-flow", title: "Test the contact and audit flow", description: "Submit a test enquiry to confirm notifications and follow-up emails arrive." },
  { key: "update-services", title: "Refresh services and case studies", description: "Keep your offers, examples, and client outcomes relevant and current." },
]

export function SiteOperationsChecklist({ initialCompleted }: { initialCompleted: string[] }) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [error, setError] = useState(false)
  const progress = useMemo(() => Math.round((completed.length / tasks.length) * 100), [completed.length])

  const toggle = async (taskKey: string) => {
    const next = completed.includes(taskKey) ? completed.filter((key) => key !== taskKey) : [...completed, taskKey]
    setCompleted(next)
    setError(false)
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return setError(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setError(true)
    const isComplete = next.includes(taskKey)
    const workspaceOwnerId = await getWorkspaceOwnerId(supabase, user.id)
    const { error: saveError } = await supabase.from("site_operations").upsert({ owner_id: workspaceOwnerId, task_key: taskKey, completed: isComplete, completed_at: isComplete ? new Date().toISOString() : null, updated_at: new Date().toISOString() }, { onConflict: "owner_id,task_key" })
    if (saveError) {
      setCompleted(completed)
      setError(true)
    }
  }

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Website operations</p><h2 className="mt-2 text-xl font-bold">Keep the site healthy</h2><p className="mt-2 text-sm leading-6 text-slate-600">A practical recurring checklist saved to your admin account.</p></div><span className="rounded-full bg-sky-100 px-3 py-1.5 text-sm font-bold text-sky-800">{completed.length}/{tasks.length} complete</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-sky-600 transition-all" style={{ width: `${progress}%` }} /></div><div className="mt-5 space-y-2">{tasks.map((task) => { const done = completed.includes(task.key); return <button key={task.key} type="button" onClick={() => void toggle(task.key)} className="flex w-full items-start gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-sky-300 hover:bg-sky-50"><span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border ${done ? "border-sky-700 bg-sky-700 text-white" : "border-slate-300 bg-white"}`}>{done && <Check className="size-3.5" />}</span><span><span className={`block text-sm font-bold ${done ? "text-slate-500 line-through" : "text-slate-950"}`}>{task.title}</span><span className="mt-1 block text-sm leading-5 text-slate-600">{task.description}</span></span></button> })}</div>{error && <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900"><CircleAlert className="size-4" />Could not save the checklist. Run the site operations SQL migration, then refresh.</p>}<p className="mt-5 inline-flex items-center gap-2 text-xs text-slate-500"><ClipboardCheck className="size-4" />Progress is private to your dashboard account.</p></section>
}

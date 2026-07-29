"use client"

import { useEffect, useState } from "react"
import { Copy, Mail, MessageSquareText, UserRound } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type ContactDetails = { lead_name: string | null; email: string; message: string | null; website_url: string }

export function LeadContactPanel({ leadId }: { leadId: string }) {
  const [lead, setLead] = useState<ContactDetails | null>(null)
  const [copied, setCopied] = useState(false)
  useEffect(() => { const load = async () => { const supabase = createSupabaseBrowserClient(); if (!supabase) return; const { data } = await supabase.from("audit_leads").select("lead_name, email, message, website_url").eq("id", leadId).single(); setLead(data) }; void load() }, [leadId])
  if (!lead) return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Loading lead message…</p></section>
  const copyEmail = async () => { await navigator.clipboard.writeText(lead.email); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700"><UserRound className="size-5" /></span><div><p className="text-sm font-bold uppercase tracking-[.14em] text-sky-700">Lead contact</p><h2 className="mt-2 text-xl font-bold">{lead.lead_name || "Website audit visitor"}</h2><p className="mt-1 break-all text-sm text-slate-600">{lead.email}</p></div></div><div className="mt-5 flex flex-wrap gap-3"><a href={`mailto:${lead.email}?subject=${encodeURIComponent(`Your website audit: ${lead.website_url}`)}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white"><Mail className="size-4" />Reply by email</a><button type="button" onClick={copyEmail} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"><Copy className="size-4" />{copied ? "Copied" : "Copy email"}</button></div><div className="mt-5 rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-sm font-bold text-slate-800"><MessageSquareText className="size-4 text-sky-700" />Submitted message</div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{lead.message || "This visitor requested the detailed website audit report and follow-up advice."}</p></div></section>
}

"use client"

import { useEffect, useState } from "react"
import { Check, Clock3, ExternalLink, Loader2, Save, Send, TriangleAlert } from "lucide-react"

const templates = [
  { label: "Website tips", subject: "A practical website improvement tip", message: "Hi,\n\nHere is one practical improvement you can make to your website this week:\n\n[Add your helpful tip here]\n\nBest,\nLeon" },
  { label: "Audit follow-up", subject: "A quick follow-up on your website", message: "Hi,\n\nI wanted to share a quick follow-up idea based on the website work we discussed:\n\n[Add your relevant update here]\n\nBest,\nLeon" },
]
type Campaign = { id: string; subject: string; message: string; recipient_count: number; status: "Draft" | "Sent" | "Failed"; error_message: string | null; sent_at: string | null; open_count: number; click_count: number; delivery_status: string; delivered_count: number; bounced_count: number; complained_count: number; created_at: string }

export function CampaignComposer({ emails }: { emails: string[] }) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [state, setState] = useState<"idle" | "saving" | "sending" | "error">("idle")
  const [error, setError] = useState("")

  useEffect(() => { void fetch("/api/dashboard/campaigns", { cache: "no-store" }).then(async (response) => { const payload = await response.json(); if (response.ok) setCampaigns(payload.campaigns ?? []) }) }, [])
  useEffect(() => { const saved = window.localStorage.getItem("leon-campaign-draft"); if (!saved) return; try { const draft = JSON.parse(saved) as { subject?: string; message?: string }; setSubject(draft.subject ?? ""); setMessage(draft.message ?? "") } catch { window.localStorage.removeItem("leon-campaign-draft") } }, [])
  useEffect(() => { if (subject || message) window.localStorage.setItem("leon-campaign-draft", JSON.stringify({ subject, message })) }, [message, subject])

  const clearDraft = () => { setSubject(""); setMessage(""); window.localStorage.removeItem("leon-campaign-draft") }
  const saveCampaign = async (action: "save" | "send") => {
    if (!subject.trim() || !message.trim()) return
    if (action === "send" && !window.confirm(`Send this campaign to ${emails.length} opted-in recipient${emails.length === 1 ? "" : "s"}?`)) return
    setState(action === "send" ? "sending" : "saving"); setError("")
    const response = await fetch("/api/dashboard/campaigns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject, message, action }) })
    const payload = await response.json()
    if (!response.ok) { setError(payload.error ?? "Could not save the campaign."); setState("error"); return }
    if (payload.campaign) setCampaigns((current) => [payload.campaign, ...current])
    if (action === "send") clearDraft()
    setState("idle")
  }

  const openDraft = () => { if (!subject.trim() || !message.trim() || !emails.length) return; const compliantMessage = `${message.trim()}\n\n---\nIf you no longer want these updates, reply with "unsubscribe" and I’ll remove you from the list.`; window.location.href = `mailto:?bcc=${encodeURIComponent(emails.join(","))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compliantMessage)}` }
  const statusIcon = (status: Campaign["status"]) => status === "Sent" ? <Check className="size-3.5" /> : status === "Failed" ? <TriangleAlert className="size-3.5" /> : <Clock3 className="size-3.5" />

  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Start with a template</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {templates.map((template) => <button key={template.label} type="button" onClick={() => { setSubject(template.subject); setMessage(template.message) }} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-800">{template.label}</button>)}
          </div>
        </div>
        <button type="button" onClick={clearDraft} disabled={!subject && !message} className="text-xs font-semibold text-slate-500 hover:text-rose-700 disabled:opacity-40">Clear draft</button>
      </div>
      <label className="block text-sm font-semibold">Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="A helpful update for your audience" className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>
      <label className="block text-sm font-semibold">Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a useful, relevant update..." rows={8} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal leading-6 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => void saveCampaign("save")} disabled={state !== "idle" || !emails.length || !subject.trim() || !message.trim()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50"><Save className="size-4" />{state === "saving" ? "Saving..." : "Save draft"}</button>
        <button type="button" onClick={() => void saveCampaign("send")} disabled={state !== "idle" || !emails.length || !subject.trim() || !message.trim()} className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"><Send className="size-4" />{state === "sending" ? "Sending..." : "Send campaign"}</button>
        <button type="button" onClick={openDraft} disabled={!emails.length || !subject.trim() || !message.trim()} className="inline-flex items-center gap-2 rounded-xl px-2 py-3 text-sm font-semibold text-slate-500 hover:text-sky-800 disabled:opacity-40"><ExternalLink className="size-4" />Open mail draft</button>
      </div>
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
      <section className="border-t border-slate-100 pt-6">
        <div className="flex items-center gap-2"><Loader2 className="size-4 text-sky-700" /><div><h3 className="font-bold">Campaign history</h3><p className="text-xs text-slate-500">Saved drafts and delivery results for this workspace.</p></div></div>
        {campaigns.length ? <div className="mt-4 space-y-2">{campaigns.map((campaign) => <article key={campaign.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{campaign.subject}</p><p className="mt-1 text-xs text-slate-500">{campaign.recipient_count} recipient{campaign.recipient_count === 1 ? "" : "s"} · {new Date(campaign.created_at).toLocaleDateString()}</p>{campaign.status === "Sent" && <p className="mt-1 text-xs font-semibold text-slate-600">{campaign.open_count ?? 0} opens · {campaign.click_count ?? 0} clicks · {campaign.delivery_status ?? "pending"}</p>}{campaign.error_message && <p className="mt-1 text-xs text-rose-700">{campaign.error_message}</p>}</div><span className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${campaign.status === "Sent" ? "bg-emerald-100 text-emerald-700" : campaign.status === "Failed" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{statusIcon(campaign.status)}{campaign.status}</span></article>)}</div> : <p className="mt-4 text-sm text-slate-500">No campaigns saved yet.</p>}
      </section>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"

const templates = [
  { label: "Website tips", subject: "A practical website improvement tip", message: "Hi,\n\nHere is one practical improvement you can make to your website this week:\n\n[Add your helpful tip here]\n\nBest,\nLeon" },
  { label: "Audit follow-up", subject: "A quick follow-up on your website", message: "Hi,\n\nI wanted to share a quick follow-up idea based on the website work we discussed:\n\n[Add your relevant update here]\n\nBest,\nLeon" },
]

export function CampaignComposer({ emails }: { emails: string[] }) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  useEffect(() => {
    const saved = window.localStorage.getItem("leon-campaign-draft")
    if (!saved) return
    try { const draft = JSON.parse(saved) as { subject?: string; message?: string }; setSubject(draft.subject ?? ""); setMessage(draft.message ?? "") } catch { window.localStorage.removeItem("leon-campaign-draft") }
  }, [])
  useEffect(() => {
    if (subject || message) window.localStorage.setItem("leon-campaign-draft", JSON.stringify({ subject, message }))
  }, [message, subject])
  const openDraft = () => {
    if (!subject.trim() || !message.trim() || !emails.length) return
    window.location.href = `mailto:?bcc=${encodeURIComponent(emails.join(","))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
  }
  return <div className="mt-6 space-y-4"><div><p className="text-sm font-semibold">Start with a template</p><div className="mt-2 flex flex-wrap gap-2">{templates.map((template) => <button key={template.label} type="button" onClick={() => { setSubject(template.subject); setMessage(template.message) }} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-800">{template.label}</button>)}</div></div><label className="block text-sm font-semibold">Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="A helpful update for your audience" className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label><label className="block text-sm font-semibold">Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a useful, relevant update..." rows={8} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal leading-6 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label><div className="flex flex-wrap items-center gap-3"><button type="button" onClick={openDraft} disabled={!emails.length || !subject.trim() || !message.trim()} className="rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Open reviewed email draft</button><p className="text-xs text-slate-500">No email is sent automatically.</p></div></div>
}

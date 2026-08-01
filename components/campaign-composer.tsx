"use client"

import { useState } from "react"

export function CampaignComposer({ emails }: { emails: string[] }) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const openDraft = () => {
    if (!subject.trim() || !message.trim() || !emails.length) return
    window.location.href = `mailto:?bcc=${encodeURIComponent(emails.join(","))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
  }
  return <div className="mt-6 space-y-4"><label className="block text-sm font-semibold">Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="A helpful update for your audience" className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label><label className="block text-sm font-semibold">Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a useful, relevant update..." rows={8} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal leading-6 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label><div className="flex flex-wrap items-center gap-3"><button type="button" onClick={openDraft} disabled={!emails.length || !subject.trim() || !message.trim()} className="rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Open reviewed email draft</button><p className="text-xs text-slate-500">No email is sent automatically.</p></div></div>
}

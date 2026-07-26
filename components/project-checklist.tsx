"use client"

import { useCallback, useState } from "react"
import { CheckCircle2, Download, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Turnstile } from "@/components/turnstile"
import { trackEvent } from "@/lib/analytics"

const services = [
  "Website management & updates",
  "E-commerce product listings",
  "Amazon product listing support",
  "Data entry & admin support",
]

export function ProjectChecklist() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [service, setService] = useState(services[0])
  const [turnstileToken, setTurnstileToken] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [error, setError] = useState("")

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter your name and a valid email address.")
      return
    }

    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setError("Please complete the security check.")
      return
    }

    setStatus("submitting")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          service,
          message: "Requested the free project preparation checklist.",
          sendChecklist: true,
          turnstileToken,
        }),
      })
      const result = await response.json().catch(() => null) as { checklistSent?: boolean } | null
      if (!response.ok || result?.checklistSent === false) throw new Error("Checklist delivery failed")

      trackEvent("generate_lead", { event_category: "checklist", lead_source: "free_checklist", service_interest: service })
      setStatus("success")
    } catch {
      setStatus("error")
      setError("The checklist could not be sent. Please try again or request a quote instead.")
    }
  }

  const handleVerify = useCallback((token: string) => setTurnstileToken(token), [])
  const handleExpire = useCallback(() => setTurnstileToken(""), [])

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(99,102,241,.38),transparent_28rem),radial-gradient(circle_at_90%_70%,rgba(20,184,166,.22),transparent_30rem)]" />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[.16em] text-cyan-100"><Download className="h-3.5 w-3.5" /> Free project checklist</span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">Get organized before you hand over the work.</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-200">Receive a practical checklist for website updates, product listings, Amazon catalog work, or data and admin tasks.</p>
            <div className="mt-7 flex items-center gap-3 text-sm text-cyan-100"><CheckCircle2 className="h-5 w-5 text-cyan-300" />A clear starting point, delivered to your inbox.</div>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur sm:p-8">
            {status === "success" ? <div className="py-8 text-center"><Mail className="mx-auto h-10 w-10 text-cyan-300" /><h3 className="mt-5 text-2xl font-bold">Check your inbox</h3><p className="mt-3 text-sm leading-6 text-slate-200">Your project checklist is on its way. When you are ready, reply with the details you have.</p></div> : <form onSubmit={submit} className="space-y-5"><div><h3 className="text-xl font-semibold">Send me the checklist</h3><p className="mt-1 text-sm text-slate-200">Choose the kind of work you are preparing for.</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><label htmlFor="checklist-name" className="text-sm font-medium">Name</label><Input id="checklist-name" value={name} onChange={(event) => setName(event.target.value)} className="border-white/20 bg-white text-slate-950" placeholder="Your name" /></div><div className="space-y-2"><label htmlFor="checklist-email" className="text-sm font-medium">Email</label><Input id="checklist-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="border-white/20 bg-white text-slate-950" placeholder="you@example.com" /></div></div><div className="space-y-2"><label htmlFor="checklist-service" className="text-sm font-medium">Support needed</label><select id="checklist-service" value={service} onChange={(event) => setService(event.target.value)} className="flex h-11 w-full rounded-xl border border-white/20 bg-white px-3 text-sm text-slate-950 outline-none">{services.map((option) => <option key={option} value={option}>{option}</option>)}</select></div><Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} onVerify={handleVerify} onExpire={handleExpire} />{error && <p className="text-sm text-rose-200">{error}</p>}<Button type="submit" disabled={status === "submitting"} className="w-full rounded-xl bg-white text-slate-950 hover:bg-slate-100">{status === "submitting" ? "Sending..." : "Email my checklist"}<Download className="ml-2 h-4 w-4" /></Button></form>}
          </div>
        </div>
      </div>
    </section>
  )
}

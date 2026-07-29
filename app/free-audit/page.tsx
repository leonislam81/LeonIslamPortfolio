"use client"

import { FormEvent, useCallback, useState } from "react"
import { ArrowRight, Check, ChevronLeft, CircleAlert, CircleCheck, Gauge, LockKeyhole, Search, Target, Wrench, Zap } from "lucide-react"
import { Turnstile } from "@/components/turnstile"

type AuditResult = {
  url: string
  seo: number
  source: "pagespeed" | "fallback"
  performance?: number
  status?: number
  loadTime?: number
  title?: string | null
  notice?: string
  findings?: AuditFinding[]
  metrics?: AuditMetric[]
}

type AuditFinding = {
  category: "Performance" | "SEO" | "Technical"
  priority: "high" | "medium" | "low"
  title: string
  detail: string
  action: string
}

type AuditMetric = {
  label: string
  value: string
  score?: number | null
}

const businessGoals = ["More leads", "More sales", "More bookings", "More search traffic"]

type AuditState = "idle" | "loading" | "error"
type LeadState = "idle" | "sending" | "success" | "error"

function scoreTone(score: number) {
  if (score >= 90) return "bg-emerald-500"
  if (score >= 50) return "bg-amber-400"
  return "bg-rose-500"
}

function ScoreCard({ label, score, detail, icon }: { label: string; score: number; detail: string; icon: React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="text-sky-700">{icon}</span>
            {label}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
        </div>
        <span className="text-3xl font-bold tracking-tight text-slate-950">{score}</span>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
        <div className={`h-full rounded-full ${scoreTone(score)}`} style={{ width: `${score}%` }} />
      </div>
    </article>
  )
}

export default function FreeAuditPage() {
  const [url, setUrl] = useState("")
  const [email, setEmail] = useState("")
  const [businessGoal, setBusinessGoal] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")
  const [result, setResult] = useState<AuditResult | null>(null)
  const [auditState, setAuditState] = useState<AuditState>("idle")
  const [auditError, setAuditError] = useState("")
  const [leadState, setLeadState] = useState<LeadState>("idle")
  const [leadError, setLeadError] = useState("")

  const handleAudit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuditState("loading")
    setAuditError("")
    setLeadState("idle")
    setLeadError("")

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "We could not complete the audit. Please try again.")

      setResult(data)
      setEmail("")
      setTurnstileToken("")
      setAuditState("idle")
    } catch (error) {
      setResult(null)
      setAuditError(error instanceof Error ? error.message : "We could not complete the audit. Please try again.")
      setAuditState("error")
    }
  }

  const handleLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!result) return

    if (!turnstileToken) {
      setLeadState("error")
      setLeadError("Please complete the security check before sending your report.")
      return
    }

    setLeadState("sending")
    setLeadError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Free audit visitor",
          email,
          service: "Something else",
          message: `Free website audit requested for ${result.url}. ${result.source === "pagespeed" ? `Performance score: ${result.performance}.` : `Direct availability check: HTTP ${result.status}, response time: ${result.loadTime}ms.`} SEO score: ${result.seo}.`,
          audit: {
            url: result.url,
            source: result.source,
            performance: result.performance,
            seo: result.seo,
            status: result.status,
            loadTime: result.loadTime,
            findings: result.findings ?? [],
          },
          businessGoal,
          turnstileToken,
        }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "We could not send your report. Please try again.")

      setLeadState("success")
    } catch (error) {
      setLeadState("error")
      setLeadError(error instanceof Error ? error.message : "We could not send your report. Please try again.")
    }
  }

  const handleTurnstileVerify = useCallback((token: string) => setTurnstileToken(token), [])
  const handleTurnstileExpire = useCallback(() => setTurnstileToken(""), [])
  const isAuditing = auditState === "loading"
  const isSending = leadState === "sending"

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="text-sm font-bold tracking-tight text-slate-950">Leon Islam</a>
          <a href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-sky-700">
            <ChevronLeft className="size-4" /> Back to site
          </a>
        </div>
      </div>

      <section className="relative overflow-hidden px-5 pb-14 pt-14 sm:px-8 sm:pt-20">
        <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(186,230,253,.7),transparent_65%)]" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-sky-800">
            <Zap className="size-3.5 fill-current" /> Free instant check
          </p>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">See what is holding your website back.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg">Get a quick, mobile-first view of your website&apos;s performance and SEO health — powered by Google PageSpeed Insights.</p>
        </div>

        <form onSubmit={handleAudit} className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/5 sm:flex sm:gap-3">
          <label className="sr-only" htmlFor="website-url">Website address</label>
          <input id="website-url" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://yourwebsite.com" className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100" />
          <button type="submit" disabled={isAuditing} className="mt-3 inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-wait disabled:opacity-70 sm:mt-0 sm:w-auto">
            {isAuditing ? "Checking site…" : "Run free audit"}
            {!isAuditing && <ArrowRight className="size-4" />}
          </button>
        </form>
        {auditError && <p role="alert" className="mx-auto mt-4 max-w-2xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{auditError}</p>}
        <p className="mt-4 text-center text-xs text-slate-500">No account required. We only check the public URL you enter.</p>
      </section>

      <section className="border-y border-slate-200 bg-white px-5 py-10 sm:px-8">
        <div className="mx-auto grid max-w-4xl gap-7 text-center sm:grid-cols-3 sm:text-left">
          {[
            [Gauge, "Mobile-first scores", "Performance measured as a visitor experiences it on mobile."],
            [Search, "Essential SEO signal", "A focused snapshot of page discoverability basics."],
            [LockKeyhole, "Private by design", "Your email is only used if you ask us to send your report."],
          ].map(([Icon, title, description]) => {
            const FeatureIcon = Icon as typeof Gauge
            return <div key={title as string}><FeatureIcon className="mx-auto size-5 text-sky-700 sm:mx-0" /><h2 className="mt-3 font-semibold text-slate-950">{title as string}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{description as string}</p></div>
          })}
        </div>
      </section>

      {result && (
        <section aria-live="polite" className="px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">Your snapshot</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Your website audit is ready.</h2>
              </div>
              <p className="truncate text-sm text-slate-500" title={result.url}>{result.url}</p>
            </div>

            {result.source === "pagespeed" ? (
              <>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <ScoreCard label="Performance" score={result.performance ?? 0} detail="How quickly your page loads and responds on a mobile connection." icon={<Gauge className="size-4" />} />
                  <ScoreCard label="SEO" score={result.seo} detail="Fundamental checks that help search engines understand your page." icon={<Search className="size-4" />} />
                </div>
                {result.metrics?.length ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{result.metrics.map((metric) => <div key={metric.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p><p className="mt-2 text-lg font-bold text-slate-950">{metric.value}</p></div>)}</div> : null}
                <p className="mt-5 text-sm text-slate-500">Scores are from Google PageSpeed Insights. A score of 90 or above is generally considered strong.</p>
              </>
            ) : (
              <>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><span className="text-sky-700"><Gauge className="size-4" /></span>Website response</div><p className="mt-2 text-sm leading-6 text-slate-500">Direct check of the public website when Google PageSpeed cannot run.</p></div><span className="text-3xl font-bold tracking-tight text-slate-950">{result.status}</span></div>
                    <p className="mt-5 text-sm font-medium text-emerald-700">Reached in {result.loadTime} ms</p>
                  </article>
                  <ScoreCard label="SEO essentials" score={result.seo} detail="Checks for title, description, viewport, language, canonical URL, and main heading." icon={<Search className="size-4" />} />
                </div>
                <p className="mt-5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">{result.notice}</p>
              </>
            )}

            <div className="mt-7">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-sky-100 p-2 text-sky-800"><CircleAlert className="size-5" /></div>
                <div>
                  <h3 className="font-bold text-slate-950">Priority improvements</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">These are the clearest issues found in this automated snapshot. They are practical starting points, not a substitute for a full manual review.</p>
                </div>
              </div>
              {result.findings?.length ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {result.findings.map((finding) => (
                    <article key={`${finding.category}-${finding.title}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold uppercase tracking-[.12em] text-sky-700">{finding.category}</span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${finding.priority === "high" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-800"}`}>{finding.priority} priority</span>
                      </div>
                      <h4 className="mt-3 font-bold text-slate-950">{finding.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{finding.detail}</p>
                      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-700"><Wrench className="mt-1 size-4 shrink-0 text-sky-700" />{finding.action}</div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-900"><Check className="mr-2 inline size-4" />No major automated issues were flagged in this snapshot. A manual review can still uncover conversion, content, and user-journey improvements.</div>
              )}
            </div>

            <div className="mt-10 rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/15 sm:p-9">
              {leadState === "success" ? (
                <div className="max-w-xl py-2">
                  <CircleCheck className="size-9 text-emerald-400" />
                  <h3 className="mt-4 text-2xl font-bold">Your detailed report has been accepted for delivery.</h3>
                  <p className="mt-2 leading-7 text-slate-300">Check your inbox, Promotions, and Spam folders for the scores, issues found, and practical improvement ideas for your website.</p>
                </div>
              ) : (
                <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-300">What&apos;s next</p>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight">Want the practical next steps?</h3>
                    <p className="mt-3 leading-7 text-slate-300">Email yourself a clearer report with the issues found, SEO and content opportunities, plus ideas to improve trust and conversions.</p>
                    <ul className="mt-5 space-y-2 text-sm text-slate-300">
                      {["A copy of your scores", "A human review of the biggest opportunities", "No spam — just relevant follow-up"].map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-4 text-emerald-400" />{item}</li>)}
                    </ul>
                  </div>
                  <form onSubmit={handleLead} className="rounded-2xl bg-white p-5 text-slate-900 sm:p-6">
                    <label htmlFor="audit-email" className="text-sm font-semibold">Your email address</label>
                    <input id="audit-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100" />
                    <fieldset className="mt-5">
                      <legend className="flex items-center gap-2 text-sm font-semibold"><Target className="size-4 text-sky-700" />What would you most like to improve? <span className="font-normal text-slate-500">(optional)</span></legend>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {businessGoals.map((goal) => <button key={goal} type="button" onClick={() => setBusinessGoal(goal === businessGoal ? "" : goal)} className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${businessGoal === goal ? "border-sky-700 bg-sky-50 text-sky-900" : "border-slate-200 text-slate-600 hover:border-sky-300 hover:bg-sky-50"}`} aria-pressed={businessGoal === goal}>{goal}</button>)}
                      </div>
                    </fieldset>
                    <div className="mt-4"><Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} onVerify={handleTurnstileVerify} onExpire={handleTurnstileExpire} /></div>
                    {leadError && <p role="alert" className="mt-3 text-sm text-rose-700">{leadError}</p>}
                    <button type="submit" disabled={isSending} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-wait disabled:opacity-70">
                      {isSending ? "Sending…" : "Send my report"} <ArrowRight className="size-4" />
                    </button>
                    <p className="mt-3 text-xs leading-5 text-slate-500">By sending, you agree to receive audit-related follow-up from Leon Islam. You can opt out at any time.</p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import { ArrowRight, CalendarDays, Check, ChevronLeft, CircleAlert, CircleCheck, Copy, Download, Gauge, LockKeyhole, Search, ShieldCheck, Target, Wrench, X, Zap } from "lucide-react"
import { Turnstile } from "@/components/turnstile"
import { BookingLink } from "@/components/booking-link"

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
  checks?: AuditCheck[]
  conversion?: AuditCheck[]
  competitor?: CompetitorSnapshot
  savedAt?: string
}

type CompetitorSnapshot = {
  url: string
  performance: number
  seo: number
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

type AuditCheck = {
  label: string
  status: "pass" | "attention"
  detail: string
}

const businessGoals = ["More leads", "More sales", "More bookings", "More search traffic"]
const auditHistoryKey = "leon-islam-audit-history"
const mobileCheckLabels = ["Mobile viewport", "Mobile text size", "Mobile tap targets", "Mobile content width"]

function isAuditResult(value: unknown): value is AuditResult {
  return typeof value === "object" && value !== null && "url" in value && "seo" in value && "source" in value && typeof value.url === "string" && typeof value.seo === "number" && (value.source === "pagespeed" || value.source === "fallback")
}

function auditKey(url: string) {
  try {
    const parsed = new URL(url)
    return `${parsed.hostname.toLowerCase()}${parsed.pathname.replace(/\/$/, "")}`
  } catch {
    return url
  }
}

function attentionCount(audit: AuditResult) {
  return audit.checks?.filter((check) => check.status === "attention").length ?? 0
}

function changeLabel(current: number, previous: number, reverse = false) {
  const difference = current - previous
  if (difference === 0) return { text: "No change", tone: "text-slate-600" }
  const improved = reverse ? difference < 0 : difference > 0
  return { text: `${difference > 0 ? "+" : ""}${difference} ${improved ? "improved" : "worse"}`, tone: improved ? "text-emerald-700" : "text-amber-700" }
}

function getAuditPriority(audit: AuditResult) {
  const highFindings = audit.findings?.filter((finding) => finding.priority === "high").length ?? 0
  const mediumFindings = audit.findings?.filter((finding) => finding.priority === "medium").length ?? 0
  const attention = [...(audit.checks ?? []), ...(audit.conversion ?? [])].filter((check) => check.status === "attention").length
  const score = Math.min(10, highFindings * 3 + mediumFindings * 2 + attention + (audit.source === "pagespeed" && (audit.performance ?? 100) < 50 ? 3 : 0) + (audit.seo < 50 ? 2 : 0))

  if (score >= 7) return { score, label: "Urgent attention", detail: "Several automated issues could be affecting visitor trust, mobile experience, or search visibility. Start with the action plan this week.", tone: "border-rose-200 bg-rose-50 text-rose-800" }
  if (score >= 4) return { score, label: "Needs attention", detail: "The site has clear improvement opportunities. Work through the priority items to strengthen its results.", tone: "border-amber-200 bg-amber-50 text-amber-800" }
  return { score, label: "Good foundation", detail: "No major automated issues were found. Keep monitoring and use the recommendations to improve conversion over time.", tone: "border-emerald-200 bg-emerald-50 text-emerald-800" }
}

function buildOpportunitySignals(audit: AuditResult) {
  const conversionAttention = audit.conversion?.filter((check) => check.status === "attention") ?? []
  const mobileAttention = audit.checks?.filter((check) => mobileCheckLabels.includes(check.label) && check.status === "attention") ?? []
  const seoFindings = audit.findings?.filter((finding) => finding.category === "SEO").length ?? 0

  return [
    conversionAttention.length ? { title: "Lead conversion opportunity", detail: `${conversionAttention.length} visitor-decision signal${conversionAttention.length === 1 ? " needs" : "s need"} attention. Clearer next steps and stronger proof can reduce friction before an enquiry.` } : { title: "Lead conversion foundation", detail: "The automated page signals include the main paths visitors need to take the next step. A manual review can refine the message and journey." },
    audit.seo < 80 || seoFindings ? { title: "Search visibility opportunity", detail: `${seoFindings || "Some"} SEO signal${seoFindings === 1 ? " needs" : "s need"} improvement. Better page context can help the right visitors find and understand the offer.` } : { title: "Search visibility foundation", detail: "The main automated SEO signals are in place. Keep building helpful content around the services and questions customers search for." },
    audit.source === "pagespeed" && ((audit.performance ?? 100) < 90 || mobileAttention.length) ? { title: "Mobile experience opportunity", detail: `${mobileAttention.length ? `${mobileAttention.length} mobile usability signal${mobileAttention.length === 1 ? " needs" : "s need"} attention, and ` : ""}improving load speed and mobile usability can help more visitors stay engaged.` } : { title: "Mobile experience foundation", detail: "No major automated mobile usability signals were flagged. Recheck after changing layouts, images, or third-party tools." },
  ]
}

function buildServiceRecommendation(audit: AuditResult, businessGoal: string) {
  const hasSeoNeed = audit.seo < 80 || audit.findings?.some((finding) => finding.category === "SEO")
  const hasMobileNeed = audit.source === "pagespeed" && (audit.performance ?? 100) < 70 || audit.checks?.some((check) => mobileCheckLabels.includes(check.label) && check.status === "attention")
  const hasConversionNeed = audit.conversion?.some((check) => check.status === "attention")

  if (businessGoal === "More search traffic" || hasSeoNeed) return { title: "SEO and content improvements", detail: "Recommended focus: refine the page topic, headings, search-focused copy, and internal links so the right visitors can find the service more easily.", bookingDetails: `SEO and content review for ${audit.url}` }
  if (hasMobileNeed) return { title: "Website speed and mobile improvements", detail: "Recommended focus: improve loading speed, mobile layout, and tap-friendly journeys so fewer visitors leave before taking action.", bookingDetails: `Mobile performance review for ${audit.url}` }
  if (businessGoal === "More leads" || businessGoal === "More bookings" || hasConversionNeed) return { title: "Website conversion improvements", detail: "Recommended focus: make the offer, proof, and next action clearer so ready visitors can contact or book with less friction.", bookingDetails: `Conversion review for ${audit.url}` }
  return { title: "Website management and improvements", detail: "Recommended focus: turn the audit priorities into a practical update plan, then keep the site accurate, fast, and focused on the business goal.", bookingDetails: `Website improvement review for ${audit.url}` }
}

type ActionPlanItem = { title: string; detail: string }

function buildActionPlan(audit: AuditResult) {
  const findings = audit.findings ?? []
  const healthIssues = [...(audit.checks ?? []), ...(audit.conversion ?? [])].filter((check) => check.status === "attention").map((check) => ({ title: check.label, detail: check.detail }))
  const urgent: ActionPlanItem[] = findings.filter((finding) => finding.priority === "high").map((finding) => ({ title: finding.title, detail: finding.action }))
  const next: ActionPlanItem[] = findings.filter((finding) => finding.priority !== "high").map((finding) => ({ title: finding.title, detail: finding.action }))

  for (const issue of healthIssues) {
    if (urgent.length < 2) urgent.push(issue)
    else if (next.length < 2) next.push(issue)
  }

  return {
    urgent: urgent.slice(0, 2),
    next: next.slice(0, 2),
    monitor: [
      audit.source === "pagespeed" ? { title: "Recheck mobile performance", detail: "Run the audit again after changes and compare the mobile score, loading speed, and layout stability." } : { title: "Recheck full PageSpeed data", detail: "Run the audit again soon to capture the full mobile performance breakdown." },
      { title: "Keep content current", detail: "Review the primary offer, proof, and call to action whenever the business changes." },
    ],
  }
}

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
  const [competitorUrl, setCompetitorUrl] = useState("")
  const [email, setEmail] = useState("")
  const [businessGoal, setBusinessGoal] = useState("")
  const [requestReauditFollowUp, setRequestReauditFollowUp] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [result, setResult] = useState<AuditResult | null>(null)
  const [auditState, setAuditState] = useState<AuditState>("idle")
  const [auditError, setAuditError] = useState("")
  const [leadState, setLeadState] = useState<LeadState>("idle")
  const [leadError, setLeadError] = useState("")
  const [recentAudits, setRecentAudits] = useState<AuditResult[]>([])
  const [shareMessage, setShareMessage] = useState("")
  const [isSharedReport, setIsSharedReport] = useState(false)

  const saveAudit = useCallback((audit: AuditResult) => {
    const savedAudit = { ...audit, savedAt: new Date().toISOString() }
    setResult(savedAudit)
    setRecentAudits((current) => {
      const next = [savedAudit, ...current].slice(0, 8)
      window.localStorage.setItem(auditHistoryKey, JSON.stringify(next))
      return next
    })
  }, [])

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(auditHistoryKey) ?? "[]")
      if (Array.isArray(stored)) setRecentAudits(stored.filter(isAuditResult).slice(0, 8))

      const encodedReport = new URLSearchParams(window.location.search).get("report")
      if (encodedReport) {
        const sharedReport = JSON.parse(decodeURIComponent(atob(encodedReport)))
        if (isAuditResult(sharedReport)) {
          setResult(sharedReport)
          setUrl(sharedReport.url)
          setIsSharedReport(true)
        }
      }
    } catch {
      // A malformed shared link or expired browser storage should not affect the audit page.
    }
  }, [])

  const handleAudit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuditState("loading")
    setIsSharedReport(false)
    setAuditError("")
    setLeadState("idle")
    setLeadError("")

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, competitorUrl }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "We could not complete the audit. Please try again.")

      saveAudit(data)
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
            checks: result.checks ?? [],
            conversion: result.conversion ?? [],
            competitor: result.competitor,
          },
          businessGoal,
          reAuditFollowUp: requestReauditFollowUp,
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

  const downloadReport = () => {
    if (!result) return
    const lines = [
      "Website audit report",
      `Website: ${result.url}`,
      result.source === "pagespeed" ? `Mobile performance: ${result.performance}/100` : `Website response: HTTP ${result.status} in ${result.loadTime}ms`,
      `SEO essentials: ${result.seo}/100`,
      ...(result.competitor ? ["", "Competitor comparison:", `Competitor: ${result.competitor.url}`, `Your mobile performance: ${result.performance ?? "Not available"}/100 | Competitor: ${result.competitor.performance}/100`, `Your SEO: ${result.seo}/100 | Competitor: ${result.competitor.seo}/100`] : []),
      "",
      "Priority improvements:",
      ...(result.findings?.map((finding) => `- ${finding.title}: ${finding.action}`) ?? ["- No major automated issues were flagged."]),
      "",
      "Website health checks:",
      ...(result.checks?.map((check) => `- ${check.label}: ${check.status === "pass" ? "Looks good" : check.detail}`) ?? []),
    ]
    const file = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" })
    const fileUrl = URL.createObjectURL(file)
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = "website-audit-report.txt"
    link.click()
    URL.revokeObjectURL(fileUrl)
  }

  const downloadPdfReport = () => {
    if (!result) return

    const rawLines = [
      "LEON ISLAM - WEBSITE AUDIT REPORT",
      `Website: ${result.url}`,
      `Generated: ${new Date().toLocaleDateString()}`,
      "",
      result.source === "pagespeed" ? `Mobile performance: ${result.performance}/100` : `Website response: HTTP ${result.status} in ${result.loadTime}ms`,
      `SEO essentials: ${result.seo}/100`,
      "",
      "PRIORITY IMPROVEMENTS",
      ...(result.findings?.map((finding) => `${finding.title}: ${finding.action}`) ?? ["No major automated issues were flagged."]),
      "",
      "WEBSITE HEALTH CHECKS",
      ...(result.checks?.map((check) => `${check.label}: ${check.status === "pass" ? "Looks good" : check.detail}`) ?? []),
      ...(result.competitor ? ["", "COMPETITOR COMPARISON", `Competitor: ${result.competitor.url}`, `Mobile performance: You ${result.performance ?? "Not available"}/100 | Competitor ${result.competitor.performance}/100`, `SEO essentials: You ${result.seo}/100 | Competitor ${result.competitor.seo}/100`] : []),
      "",
      "This automated public-page snapshot highlights likely improvements. It does not test every page, form, or device.",
    ]
    const sanitise = (value: string) => value.normalize("NFKD").replace(/[^\x20-\x7E]/g, "").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
    const lines = rawLines.flatMap((line) => {
      const words = sanitise(line).split(/\s+/)
      const wrapped: string[] = []
      let current = ""
      for (const word of words) {
        if ((current ? `${current} ${word}` : word).length > 88) {
          if (current) wrapped.push(current)
          current = word
        } else current = current ? `${current} ${word}` : word
      }
      if (current || !line) wrapped.push(current)
      return wrapped
    })
    const pages = Array.from({ length: Math.max(1, Math.ceil(lines.length / 46)) }, (_, index) => lines.slice(index * 46, index * 46 + 46))
    const pageIds = pages.map((_, index) => 4 + index * 2)
    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`,
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      ...pages.flatMap((page, index) => {
        const content = [
          "BT /F1 16 Tf 50 782 Td (Leon Islam - Website Audit Report) Tj",
          "/F1 9 Tf 0 -24 Td",
          ...page.flatMap((line) => [`(${line}) Tj`, "0 -14 Td"]),
          "ET",
        ].join("\n")
        return [
          `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${pageIds[index] + 1} 0 R >>`,
          `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
        ]
      }),
    ]
    let pdf = "%PDF-1.4\n"
    const offsets = [0]
    objects.forEach((object, index) => {
      offsets.push(pdf.length)
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
    })
    const xrefOffset = pdf.length
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
    const fileUrl = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }))
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = "website-audit-report.pdf"
    link.click()
    URL.revokeObjectURL(fileUrl)
  }

  const shareReport = async () => {
    if (!result) return
    try {
      const report = encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(result))))
      await navigator.clipboard.writeText(`${window.location.origin}/free-audit?report=${report}`)
      setShareMessage("Share link copied")
    } catch {
      setShareMessage("Unable to copy the share link")
    }
  }

  const resultSavedAt = result?.savedAt
  const previousAudit = result && resultSavedAt ? recentAudits.find((audit) => auditKey(audit.url) === auditKey(result.url) && audit.savedAt && new Date(audit.savedAt).getTime() < new Date(resultSavedAt).getTime()) : undefined
  const actionPlan = result ? buildActionPlan(result) : null
  const mobileChecks = result?.checks?.filter((check) => mobileCheckLabels.includes(check.label)) ?? []
  const auditPriority = result ? getAuditPriority(result) : null
  const opportunitySignals = result ? buildOpportunitySignals(result) : []
  const serviceRecommendation = result ? buildServiceRecommendation(result, businessGoal) : null
  const savedAudits = recentAudits.slice(0, 8)
  const sameSiteHistory = result ? savedAudits.filter((audit) => auditKey(audit.url) === auditKey(result.url)) : []
  const earlierSiteAudit = sameSiteHistory.find((audit) => audit.savedAt && audit.savedAt !== result?.savedAt)
  const performanceTrend = result?.source === "pagespeed" && earlierSiteAudit?.performance !== undefined ? changeLabel(result.performance ?? 0, earlierSiteAudit.performance) : null
  const seoTrend = result && earlierSiteAudit ? changeLabel(result.seo, earlierSiteAudit.seo) : null

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

        <form onSubmit={handleAudit} className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/5 sm:flex sm:flex-wrap sm:gap-3">
          <label className="sr-only" htmlFor="website-url">Website address</label>
          <input id="website-url" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://yourwebsite.com" className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100" />
          <button type="submit" disabled={isAuditing} className="mt-3 inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-wait disabled:opacity-70 sm:mt-0 sm:w-auto">
            {isAuditing ? "Checking site…" : "Run free audit"}
            {!isAuditing && <ArrowRight className="size-4" />}
          </button>
          <label className="block w-full text-left" htmlFor="competitor-url"><span className="text-xs font-semibold text-slate-600">Optional: compare one competitor</span><input id="competitor-url" type="url" value={competitorUrl} onChange={(event) => setCompetitorUrl(event.target.value)} placeholder="https://competitor.com" className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>
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
            {isSharedReport ? <section className="mb-7 rounded-2xl border border-violet-200 bg-violet-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-violet-700">Shared website audit</p><h2 className="mt-2 text-xl font-bold text-slate-950">A colleague shared this public audit snapshot with you.</h2><p className="mt-2 text-sm leading-6 text-slate-600">It contains website scores and public-page findings only—no email address or private lead details are included.</p></div><a href="/free-audit" className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:mt-0">Run your own audit <ArrowRight className="size-4" /></a></section> : null}
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">Your snapshot</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Your website audit is ready.</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:justify-end"><p className="max-w-64 truncate text-sm text-slate-500" title={result.url}>{result.url}</p><button type="button" onClick={downloadPdfReport} className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"><Download className="size-4" />PDF report</button><button type="button" onClick={downloadReport} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50"><Download className="size-4" />Text</button><button type="button" onClick={shareReport} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50"><Copy className="size-4" />Share</button></div>
            </div>
            {shareMessage && <p role="status" className="mt-3 text-sm font-medium text-emerald-700">{shareMessage}</p>}

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

            {auditPriority ? <section className={`mt-7 rounded-2xl border p-5 ${auditPriority.tone}`}><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[.16em]">Audit priority</p><h3 className="mt-2 text-2xl font-bold text-slate-950">{auditPriority.label}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">{auditPriority.detail}</p></div><div className="rounded-2xl bg-white px-5 py-4 text-center shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Priority score</p><p className="mt-1 text-3xl font-bold text-slate-950">{auditPriority.score}<span className="text-base text-slate-500">/10</span></p></div></div></section> : null}

            {result.competitor ? <section className="mt-8 rounded-2xl border border-violet-200 bg-violet-50 p-5"><p className="text-sm font-bold uppercase tracking-[.16em] text-violet-700">Competitor comparison</p><h3 className="mt-2 text-xl font-bold text-slate-950">See how the public mobile scores compare</h3><p className="mt-1 truncate text-sm text-slate-600" title={result.competitor.url}>{result.competitor.url}</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Mobile performance</p><p className="mt-2 text-lg font-bold text-slate-950">You: {result.performance ?? "—"} <span className="text-slate-400">vs</span> Competitor: {result.competitor.performance}</p><p className="mt-1 text-sm text-slate-600">{(result.performance ?? 0) >= result.competitor.performance ? "Your site is matching or ahead on this score." : `Opportunity: ${result.competitor.performance - (result.performance ?? 0)} points behind.`}</p></div><div className="rounded-xl bg-white p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">SEO essentials</p><p className="mt-2 text-lg font-bold text-slate-950">You: {result.seo} <span className="text-slate-400">vs</span> Competitor: {result.competitor.seo}</p><p className="mt-1 text-sm text-slate-600">{result.seo >= result.competitor.seo ? "Your site is matching or ahead on this score." : `Opportunity: ${result.competitor.seo - result.seo} points behind.`}</p></div></div></section> : null}

            <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><p className="text-sm font-bold uppercase tracking-[.16em] text-emerald-700">Business opportunity</p><h3 className="mt-2 text-xl font-bold text-slate-950">Where improvements could help the most</h3><p className="mt-1 text-sm leading-6 text-slate-600">These are practical impact signals from the automated checks—not a forecast of leads, sales, or revenue.</p><div className="mt-4 grid gap-3 lg:grid-cols-3">{opportunitySignals.map((signal) => <div key={signal.title} className="rounded-xl bg-white p-4"><p className="font-semibold text-slate-950">{signal.title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{signal.detail}</p></div>)}</div></section>

            {serviceRecommendation ? <section className="mt-8 rounded-2xl bg-slate-950 p-6 text-white"><p className="text-sm font-bold uppercase tracking-[.16em] text-sky-300">Recommended support</p><h3 className="mt-2 text-2xl font-bold">{serviceRecommendation.title}</h3><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{serviceRecommendation.detail}</p><div className="mt-5 flex flex-wrap gap-3"><BookingLink placement="free_audit" bookingDetails={serviceRecommendation.bookingDetails} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-50"><CalendarDays className="size-4" />Book a free review</BookingLink><a href="/services/website-management" className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">See support options <ArrowRight className="size-4" /></a></div></section> : null}

            {mobileChecks.length ? <section className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-5"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-sky-700">Mobile usability</p><h3 className="mt-2 text-xl font-bold text-slate-950">How the site behaves on a phone</h3><p className="mt-1 text-sm leading-6 text-slate-600">These checks focus on whether visitors can read, tap, and view the page comfortably on a small screen.</p></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{mobileChecks.map((check) => <div key={check.label} className="rounded-xl bg-white p-4"><div className="flex items-center gap-2 text-sm font-semibold text-slate-950">{check.status === "pass" ? <Check className="size-4 text-emerald-600" /> : <X className="size-4 text-amber-600" />}{check.label}</div><p className="mt-2 text-sm leading-6 text-slate-600">{check.status === "pass" ? "Looks good in this automated check." : check.detail}</p></div>)}</div></section> : null}

            {previousAudit ? <section className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-5"><div className="flex items-center gap-2"><Gauge className="size-5 text-sky-700" /><h3 className="font-bold text-slate-950">Improvement since your previous check</h3></div><p className="mt-1 text-sm text-slate-600">Compared with the saved audit from {previousAudit.savedAt ? new Date(previousAudit.savedAt).toLocaleDateString() : "an earlier visit"}.</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{result.source === "pagespeed" && previousAudit.performance !== undefined ? <div className="rounded-xl bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Performance</p><p className="mt-2 text-xl font-bold text-slate-950">{result.performance}/100</p><p className={`mt-1 text-sm font-semibold ${changeLabel(result.performance ?? 0, previousAudit.performance).tone}`}>{changeLabel(result.performance ?? 0, previousAudit.performance).text}</p></div> : null}<div className="rounded-xl bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">SEO</p><p className="mt-2 text-xl font-bold text-slate-950">{result.seo}/100</p><p className={`mt-1 text-sm font-semibold ${changeLabel(result.seo, previousAudit.seo).tone}`}>{changeLabel(result.seo, previousAudit.seo).text}</p></div><div className="rounded-xl bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Health issues</p><p className="mt-2 text-xl font-bold text-slate-950">{attentionCount(result)}</p><p className={`mt-1 text-sm font-semibold ${changeLabel(attentionCount(result), attentionCount(previousAudit), true).tone}`}>{changeLabel(attentionCount(result), attentionCount(previousAudit), true).text}</p></div></div></section> : null}

            {result.conversion?.length ? <section className="mt-8 rounded-2xl border border-violet-200 bg-violet-50 p-5"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-violet-700">Conversion snapshot</p><h3 className="mt-2 text-xl font-bold text-slate-950">How easy is it for a visitor to take the next step?</h3><p className="mt-1 text-sm leading-6 text-slate-600">This is an automated check of public page signals, not a full user test.</p></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{result.conversion.map((check) => <div key={check.label} className="rounded-xl bg-white p-4"><div className="flex items-center gap-2 text-sm font-semibold text-slate-950">{check.status === "pass" ? <Check className="size-4 text-emerald-600" /> : <X className="size-4 text-violet-700" />}{check.label}</div><p className="mt-2 text-sm leading-6 text-slate-600">{check.status === "pass" ? "This signal is present in the page markup." : check.detail}</p></div>)}</div></section> : null}

            {actionPlan ? <section className="mt-8"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-sky-700">Your next steps</p><h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">A practical action plan</h3><p className="mt-2 text-sm leading-6 text-slate-600">Start with the items that remove the biggest visitor or search barrier, then work through the next layer.</p></div><div className="mt-5 grid gap-4 lg:grid-cols-3">{[{ title: "Fix this week", items: actionPlan.urgent, tone: "border-rose-200 bg-rose-50", empty: "No urgent automated issues were found. Keep the main page clear and fast." }, { title: "Improve next", items: actionPlan.next, tone: "border-amber-200 bg-amber-50", empty: "Use this time to strengthen your service message, proof, and calls to action." }, { title: "Keep monitoring", items: actionPlan.monitor, tone: "border-sky-200 bg-sky-50", empty: "Recheck the site after meaningful changes." }].map((column) => <div key={column.title} className={`rounded-2xl border p-5 ${column.tone}`}><h4 className="font-bold text-slate-950">{column.title}</h4><div className="mt-4 space-y-4">{column.items.length ? column.items.map((item) => <div key={`${column.title}-${item.title}`}><p className="text-sm font-semibold text-slate-950">{item.title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p></div>) : <p className="text-sm leading-6 text-slate-600">{column.empty}</p>}</div></div>)}</div></section> : null}

            {result.checks?.length ? <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-sky-700" /><h3 className="font-bold text-slate-950">Website health checks</h3></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{result.checks.map((check) => <div key={check.label} className="rounded-xl bg-slate-50 p-3"><div className="flex items-center gap-2 text-sm font-semibold text-slate-900">{check.status === "pass" ? <Check className="size-4 text-emerald-600" /> : <X className="size-4 text-amber-600" />}{check.label}</div><p className="mt-1 text-xs leading-5 text-slate-500">{check.status === "pass" ? "Looks good in this check." : check.detail}</p></div>)}</div></div> : null}

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
                  {requestReauditFollowUp && <p className="mt-2 text-sm leading-6 text-emerald-300">Your 30-day re-audit follow-up request has also been recorded.</p>}
                  <BookingLink placement="free_audit" bookingDetails={`Website audit: ${result.url}`} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-50"><CalendarDays className="size-4" />Book a free audit review</BookingLink>
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
                  <div className="space-y-4">
                    <BookingLink placement="free_audit" bookingDetails={`Website audit: ${result.url}`} className="inline-flex items-center gap-2 rounded-xl border border-sky-300/50 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"><CalendarDays className="size-4" />Book a free 20-minute review</BookingLink>
                  <form onSubmit={handleLead} className="rounded-2xl bg-white p-5 text-slate-900 sm:p-6">
                    <label htmlFor="audit-email" className="text-sm font-semibold">Your email address</label>
                    <input id="audit-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100" />
                    <fieldset className="mt-5">
                      <legend className="flex items-center gap-2 text-sm font-semibold"><Target className="size-4 text-sky-700" />What would you most like to improve? <span className="font-normal text-slate-500">(optional)</span></legend>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {businessGoals.map((goal) => <button key={goal} type="button" onClick={() => setBusinessGoal(goal === businessGoal ? "" : goal)} className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${businessGoal === goal ? "border-sky-700 bg-sky-50 text-sky-900" : "border-slate-200 text-slate-600 hover:border-sky-300 hover:bg-sky-50"}`} aria-pressed={businessGoal === goal}>{goal}</button>)}
                      </div>
                    </fieldset>
                    <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-5 text-slate-700"><input type="checkbox" checked={requestReauditFollowUp} onChange={(event) => setRequestReauditFollowUp(event.target.checked)} className="mt-0.5 size-4 rounded border-slate-300 text-sky-700 focus:ring-sky-500" /><span><strong className="text-slate-950">Request a 30-day re-audit follow-up</strong><br />Leon will have this request recorded with your audit lead so you can review progress after updates.</span></label>
                    <div className="mt-4"><Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} onVerify={handleTurnstileVerify} onExpire={handleTurnstileExpire} /></div>
                    {leadError && <p role="alert" className="mt-3 text-sm text-rose-700">{leadError}</p>}
                    <button type="submit" disabled={isSending} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-wait disabled:opacity-70">
                      {isSending ? "Sending…" : "Send my report"} <ArrowRight className="size-4" />
                    </button>
                    <p className="mt-3 text-xs leading-5 text-slate-500">By sending, you agree to receive audit-related follow-up from Leon Islam. You can opt out at any time.</p>
                  </form>
                  </div>
                </div>
              )}
            </div>
            {recentAudits.length > 1 ? <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-sky-700">Saved on this device</p><h3 className="mt-2 text-2xl font-bold text-slate-950">Audit history dashboard</h3><p className="mt-2 text-sm text-slate-600">Review up to eight saved reports in this browser and track progress for the current website.</p></div><p className="text-xs text-slate-500">Private to this browser</p></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Saved reports</p><p className="mt-2 text-2xl font-bold text-slate-950">{savedAudits.length}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Checks for this site</p><p className="mt-2 text-2xl font-bold text-slate-950">{sameSiteHistory.length}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Latest trend</p><p className="mt-2 text-sm font-semibold text-slate-950">{performanceTrend ? `Performance: ${performanceTrend.text}` : seoTrend ? `SEO: ${seoTrend.text}` : "Run another audit to compare"}</p></div></div><div className="mt-6"><h4 className="font-bold text-slate-950">Saved reports</h4><div className="mt-3 grid gap-3 sm:grid-cols-2">{savedAudits.map((audit) => { const isCurrent = audit.savedAt === result.savedAt && auditKey(audit.url) === auditKey(result.url); const issues = attentionCount(audit); return <button key={`${audit.url}-${audit.savedAt}`} type="button" onClick={() => { setResult(audit); setUrl(audit.url); window.scrollTo({ top: 0, behavior: "smooth" }) }} className={`rounded-xl border p-4 text-left transition ${isCurrent ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50"}`}><div className="flex items-start justify-between gap-3"><p className="truncate text-sm font-semibold text-slate-950">{audit.url}</p>{isCurrent && <span className="shrink-0 rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-800">Open</span>}</div><p className="mt-2 text-sm text-slate-600">{audit.source === "pagespeed" ? `Performance ${audit.performance}/100` : `HTTP ${audit.status}`} · SEO {audit.seo}/100</p><p className="mt-1 text-xs text-slate-500">{issues} health issue{issues === 1 ? "" : "s"} · {audit.savedAt ? new Date(audit.savedAt).toLocaleDateString() : "Saved report"}</p><p className="mt-3 text-xs font-semibold text-sky-700">{isCurrent ? "Viewing this report" : "Open saved report"}</p></button> })}</div></div></section> : null}
          </div>
        </section>
      )}
    </main>
  )
}

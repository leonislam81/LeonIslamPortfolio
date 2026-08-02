"use client"

import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Eye,
  ExternalLink,
  FileText,
  History,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type Section = { id: string; type: "hero" | "rich_text" | "feature_list" | "cta"; label: string; heading: string; body: string; items: string[]; buttonLabel: string; buttonHref: string }
type Page = { id: string; slug: string; title: string; excerpt: string; body: { sections?: Section[] }; seo_title: string; seo_description: string; status: "Draft" | "Published" | "Archived"; published_at: string | null; updated_at: string }
type Revision = { id: string; body: { sections?: Section[] }; seo_title: string; seo_description: string; created_at: string }

const pageTemplates = [
  { slug: "home", title: "Home", excerpt: "Main positioning, services, proof, and primary enquiries.", seo: "Core landing page", href: "/" },
  { slug: "services", title: "Services", excerpt: "Service overview and routes into focused service pages.", seo: "Service hub", href: "/services" },
  { slug: "free-audit", title: "Free audit", excerpt: "Website audit conversion page and report capture.", seo: "Lead generation", href: "/free-audit" },
  { slug: "contact", title: "Contact", excerpt: "Quote and support enquiry form.", seo: "Conversion page", href: "/contact" },
  { slug: "start-project", title: "Start a project", excerpt: "Structured project request and qualification.", seo: "Project intent", href: "/start-project" },
]

const starterCopy: Record<string, { heading: string; body: string; contentHeading: string; contentBody: string; buttonLabel: string; buttonHref: string; items?: string[] }> = {
  home: { heading: "Websites that move your business forward.", body: "Practical website, e-commerce, and online admin support for growing businesses.", contentHeading: "Make every visit count", contentBody: "Clear strategy, confident design, and a site that is ready to convert.", buttonLabel: "Start a project", buttonHref: "/start-project" },
  services: { heading: "Reliable support for the work behind your online business.", body: "Choose focused help for your website, store, catalog, and daily admin work.", contentHeading: "Support that fits the work", contentBody: "Start with one task, plan a focused project, or keep a dependable partner available for recurring online work.", buttonLabel: "Discuss your needs", buttonHref: "/contact", items: ["Website management", "E-commerce operations", "Data and admin support"] },
  "free-audit": { heading: "Find the clearest improvements for your website.", body: "Run a practical audit to understand performance, SEO, mobile experience, and conversion opportunities.", contentHeading: "Turn the findings into action", contentBody: "Get a focused view of what to fix first, what to improve next, and what to keep monitoring.", buttonLabel: "Run your audit", buttonHref: "/free-audit" },
  contact: { heading: "Tell me what you need help with.", body: "Share your website, store, catalog, data, or admin task and get a clear next step.", contentHeading: "A practical conversation starts here", contentBody: "You can begin with one focused task or describe a larger workflow. The right next step will be shaped around your priorities.", buttonLabel: "Send an enquiry", buttonHref: "/contact" },
  "start-project": { heading: "A simple way to get the right support in place.", body: "Share the outcome, timeline, and useful details so your project can start with a clear plan.", contentHeading: "Bring the useful details", contentBody: "A short, focused brief is enough to begin. Include the task, desired outcome, timing, and any relevant website or source files.", buttonLabel: "Start your project", buttonHref: "/start-project" },
}

const defaultSections = (slug: string): Section[] => {
  const copy = starterCopy[slug] ?? starterCopy.home
  return [
    { id: crypto.randomUUID(), type: "hero", label: "Hero", heading: copy.heading, body: copy.body, items: [], buttonLabel: copy.buttonLabel, buttonHref: copy.buttonHref },
    { id: crypto.randomUUID(), type: copy.items ? "feature_list" : "rich_text", label: copy.items ? "Key points" : "Content block", heading: copy.contentHeading, body: copy.contentBody, items: copy.items ?? [], buttonLabel: "", buttonHref: "" },
  ]
}

function formatDate(value: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)) }

export function DashboardContentEditor({ initialPages, userId }: { initialPages: Page[]; userId: string }) {
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [selectedSlug, setSelectedSlug] = useState(initialPages[0]?.slug ?? "home")
  const [draft, setDraft] = useState<Page | null>(initialPages[0] ?? null)
  const [revisions, setRevisions] = useState<Revision[]>([])
  const [saving, setSaving] = useState(false)
  const [loadingRevisions, setLoadingRevisions] = useState(false)
  const [preview, setPreview] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [notice, setNotice] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])

  useEffect(() => { setDraft(pages.find((page) => page.slug === selectedSlug) ?? null); setShowHistory(false) }, [pages, selectedSlug])
  useEffect(() => {
    if (!hasChanges) return
    const handleBeforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = "" }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasChanges])

  const selectPage = (slug: string) => {
    if (hasChanges && !window.confirm("You have unsaved changes. Switch pages and discard them?")) return
    setHasChanges(false); setSelectedSlug(slug); setNotice("")
  }
  const discardChanges = () => {
    if (!draft || !hasChanges) return
    if (!window.confirm("Discard all unsaved changes to this page?")) return
    const savedPage = pages.find((page) => page.id === draft.id)
    setDraft(savedPage ?? draft)
    setHasChanges(false)
    setNotice("Unsaved changes discarded")
  }
  const ensurePage = async (template: typeof pageTemplates[number]) => {
    if (!supabase) return
    setSaving(true)
    const { data, error } = await supabase.from("content_pages").insert({ owner_id: userId, slug: template.slug, title: template.title, excerpt: template.excerpt, body: { sections: defaultSections(template.slug) }, seo_title: `${template.title} | Leon Islam`, seo_description: template.excerpt, status: "Draft" }).select().single()
    if (error) setNotice(error.message); else if (data) { setPages((current) => [...current, data as Page]); setSelectedSlug(template.slug); setNotice("Draft created") }
    setSaving(false)
  }
  const updateDraft = (changes: Partial<Page>) => { setHasChanges(true); setDraft((current) => current ? { ...current, ...changes } : current) }
  const updateSection = (id: string, changes: Partial<Section>) => updateDraft({ body: { sections: (draft?.body.sections ?? []).map((section) => section.id === id ? { ...section, ...changes } : section) } })
  const moveSection = (index: number, direction: -1 | 1) => { if (!draft) return; const sections = [...(draft.body.sections ?? [])]; const target = index + direction; if (target < 0 || target >= sections.length) return; [sections[index], sections[target]] = [sections[target], sections[index]]; updateDraft({ body: { sections } }) }
  const addSection = (type: Section["type"]) => { if (!draft) return; const label = type === "feature_list" ? "Features" : type === "cta" ? "Call to action" : type === "hero" ? "Hero" : "Content block"; const section: Section = { id: crypto.randomUUID(), type, label, heading: type === "cta" ? "Ready to make a change?" : "New section", body: "Add supporting copy here.", items: type === "feature_list" ? ["First benefit", "Second benefit", "Third benefit"] : [], buttonLabel: type === "cta" ? "Get started" : "", buttonHref: type === "cta" ? "/contact" : "" }; updateDraft({ body: { sections: [...(draft.body.sections ?? []), section] } }) }
  const removeSection = (id: string) => updateDraft({ body: { sections: (draft?.body.sections ?? []).filter((section) => section.id !== id) } })
  const applyStarterContent = () => {
    if (!draft) return
    updateDraft({
      body: { sections: defaultSections(draft.slug) },
      seo_title: draft.seo_title || `${draft.title} | Leon Islam`,
      seo_description: draft.seo_description || draft.excerpt,
    })
    setNotice("Starter content added — save the draft or publish when ready")
  }

  const save = async (status: Page["status"] = "Draft") => {
    if (!supabase || !draft) return
    setSaving(true); setNotice("")
    const payload = { title: draft.title, excerpt: draft.excerpt, body: draft.body, seo_title: draft.seo_title, seo_description: draft.seo_description, status, published_at: status === "Published" ? new Date().toISOString() : draft.published_at }
    const { data, error } = await supabase.from("content_pages").update(payload).eq("id", draft.id).eq("owner_id", userId).select().single()
    if (error) setNotice(error.message); else if (data) {
      await supabase.from("content_revisions").insert({ page_id: draft.id, owner_id: userId, body: draft.body, seo_title: draft.seo_title, seo_description: draft.seo_description })
      setPages((current) => current.map((page) => page.id === draft.id ? data as Page : page)); setHasChanges(false); setLastSavedAt(new Date().toISOString()); setNotice(status === "Published" ? "Published to the live site" : "Draft saved")
    }
    setSaving(false)
  }
  const loadHistory = async () => { if (!supabase || !draft) return; setShowHistory(true); setLoadingRevisions(true); const { data } = await supabase.from("content_revisions").select("id, body, seo_title, seo_description, created_at").eq("page_id", draft.id).order("created_at", { ascending: false }).limit(12); setRevisions((data ?? []) as Revision[]); setLoadingRevisions(false) }
  const restore = (revision: Revision) => { if (!draft) return; updateDraft({ body: revision.body, seo_title: revision.seo_title, seo_description: revision.seo_description }); setShowHistory(false); setNotice("Revision loaded — save the draft to keep it") }
  const isSuccessNotice = notice.startsWith("Published") || notice.startsWith("Draft saved") || notice.startsWith("Unsaved changes discarded")

  if (!draft) return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8"><div className="mx-auto max-w-6xl"><a href="/dashboard/upcoming" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700"><ArrowLeft className="size-4" />Upcoming features</a><div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-sm text-slate-500">No content pages have been created yet.</p><button onClick={() => ensurePage(pageTemplates[0])} className="mt-4 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">Create Home draft</button></div></div></main>

  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 sm:px-8"><div className="mx-auto max-w-[1440px]"><header className="flex flex-wrap items-end justify-between gap-5 border-b border-slate-200 pb-7"><div><a href="/dashboard/upcoming" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"><ArrowLeft className="size-4" />Upcoming features</a><div className="mt-5 flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><FileText className="size-5" /></span><div><p className="text-sm font-bold uppercase tracking-[.16em] text-violet-700">Content manager</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Edit public pages</h1></div></div><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">Shape the page sections, search preview, and publishing status from one focused workspace.</p></div><div className="flex items-center gap-2">{hasChanges && <><span className="hidden rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 sm:inline-flex">Unsaved changes</span><button onClick={discardChanges} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-700 shadow-sm hover:bg-rose-50"><RotateCcw className="size-4" />Discard</button></>}{draft.status === "Published" && <a href={pageTemplates.find((template) => template.slug === draft.slug)?.href ?? `/${draft.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm"><ExternalLink className="size-4" />View live</a>}<button onClick={() => setPreview(true)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm"><Eye className="size-4" />Preview</button><button onClick={() => save("Draft")} disabled={saving} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm"><Save className="size-4" />Save draft</button><button onClick={() => save("Published")} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm">{saving ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}Publish</button></div></header>
      {notice && <div className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold ${isSuccessNotice ? "border border-emerald-200 bg-emerald-50 text-emerald-800" : "border border-sky-200 bg-sky-50 text-sky-800"}`}>{notice}{lastSavedAt && isSuccessNotice && <span className="ml-2 font-normal text-emerald-700">{formatDate(lastSavedAt)}</span>}</div>}
      <div className="mt-8 grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_300px]"><aside className="space-y-4"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Pages</p><button onClick={() => ensurePage(pageTemplates.find((item) => !pages.some((page) => page.slug === item.slug)) ?? pageTemplates[0])} className="rounded-lg p-1.5 text-sky-700 hover:bg-sky-50" aria-label="Create page"><Plus className="size-4" /></button></div><div className="space-y-2">{pageTemplates.map((template) => { const page = pages.find((item) => item.slug === template.slug); return <button key={template.slug} onClick={() => page ? selectPage(template.slug) : ensurePage(template)} className={`w-full rounded-2xl border p-4 text-left transition ${selectedSlug === template.slug ? "border-sky-300 bg-white shadow-sm" : "border-transparent hover:border-slate-200 hover:bg-white"}`}><div className="flex items-center justify-between gap-2"><span className="font-bold">{template.title}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${page?.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{page?.status ?? "Create"}</span></div><p className="mt-1 text-xs leading-5 text-slate-500">{template.excerpt}</p></button> })}</div></aside>
        <section className="space-y-5"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><label className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Page title</label><input value={draft.title} onChange={(event) => updateDraft({ title: event.target.value })} className="mt-2 block w-full max-w-xl border-0 p-0 text-2xl font-bold outline-none placeholder:text-slate-300" /><p className="mt-2 text-xs text-slate-500">/{draft.slug} · Last saved {formatDate(draft.updated_at)}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${draft.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{draft.status}</span></div><label className="mt-5 block text-xs font-bold uppercase tracking-[.16em] text-slate-500">Page summary</label><textarea value={draft.excerpt} onChange={(event) => updateDraft({ excerpt: event.target.value })} rows={2} className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 outline-none focus:border-sky-400" /></div>
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Page sections</p><p className="mt-1 text-sm text-slate-500">Build the page in the order visitors will experience it.</p></div><div className="flex gap-2"><button onClick={() => addSection("rich_text")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"><Plus className="size-3.5" />Content</button><button onClick={() => addSection("feature_list")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"><Plus className="size-3.5" />Features</button></div></div>
          <div className="space-y-4">{(Array.isArray(draft.body?.sections) ? draft.body.sections : []).length === 0 && <div className="rounded-2xl border border-dashed border-sky-300 bg-sky-50/60 p-7 text-center"><p className="text-sm font-bold text-slate-800">This page does not have any sections yet.</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Start with a ready-made hero and content block, then tailor the copy to this page.</p><button onClick={applyStarterContent} className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">Use starter content</button></div>}{(Array.isArray(draft.body?.sections) ? draft.body.sections : []).map((section, index) => <article key={section.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">{String(index + 1).padStart(2, "0")}</span><div><input value={section.label ?? ""} onChange={(event) => updateSection(section.id, { label: event.target.value })} className="w-40 border-0 p-0 text-sm font-bold outline-none" /><p className="text-[11px] uppercase tracking-[.14em] text-slate-400">{(section.type ?? "rich_text").replace("_", " ")}</p></div></div><div className="flex items-center gap-1"><button onClick={() => moveSection(index, -1)} disabled={index === 0} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-30" aria-label="Move section up"><ArrowUp className="size-4" /></button><button onClick={() => moveSection(index, 1)} disabled={index === (Array.isArray(draft.body?.sections) ? draft.body.sections.length : 1) - 1} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-30" aria-label="Move section down"><ArrowDown className="size-4" /></button><button onClick={() => removeSection(section.id)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove section"><Trash2 className="size-4" /></button></div></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Heading<input value={section.heading ?? ""} onChange={(event) => updateSection(section.id, { heading: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-semibold outline-none focus:border-sky-400" /></label><label className="text-sm font-semibold text-slate-700">Button label<input value={section.buttonLabel ?? ""} onChange={(event) => updateSection(section.id, { buttonLabel: event.target.value })} placeholder="Optional" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-sky-400" /></label></div><label className="mt-4 block text-sm font-semibold text-slate-700">Body copy<textarea value={section.body ?? ""} onChange={(event) => updateSection(section.id, { body: event.target.value })} rows={3} className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 leading-6 outline-none focus:border-sky-400" /></label>{section.type === "feature_list" && <label className="mt-4 block text-sm font-semibold text-slate-700">Feature items<input value={(Array.isArray(section.items) ? section.items : []).join(" | ")} onChange={(event) => updateSection(section.id, { items: event.target.value.split("|").map((item) => item.trim()).filter(Boolean) })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-sky-400" /><span className="mt-1 block text-xs font-normal text-slate-500">Separate items with a vertical bar.</span></label>}</article>)}</div></section>
        <aside className="space-y-5"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Search preview</p><p className="mt-1 text-xs text-slate-400">How this page may appear in results</p></div><Search className="size-4 text-slate-400" /></div><div className="mt-5 rounded-xl border border-slate-100 p-4"><p className="truncate text-sm font-semibold text-sky-700">{draft.seo_title || draft.title}</p><p className="mt-1 text-xs text-emerald-700">leonislam.com/{draft.slug === "home" ? "" : draft.slug}</p><p className="mt-2 text-xs leading-5 text-slate-500">{draft.seo_description || draft.excerpt}</p></div><label className="mt-5 block text-sm font-semibold text-slate-700">SEO title<input value={draft.seo_title ?? ""} onChange={(event) => updateDraft({ seo_title: event.target.value })} maxLength={60} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-sky-400" /><span className="mt-1 block text-right text-xs font-normal text-slate-400">{(draft.seo_title ?? "").length}/60</span></label><label className="mt-3 block text-sm font-semibold text-slate-700">Meta description<textarea value={draft.seo_description ?? ""} onChange={(event) => updateDraft({ seo_description: event.target.value })} maxLength={160} rows={4} className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-5 outline-none focus:border-sky-400" /><span className="mt-1 block text-right text-xs font-normal text-slate-400">{(draft.seo_description ?? "").length}/160</span></label></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Revision history</p><p className="mt-1 text-xs text-slate-400">Restore an earlier saved version</p></div><History className="size-4 text-slate-400" /></div><button onClick={loadHistory} className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">View revisions</button></div></aside>
      </div>
    </div>
    {preview && <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 sm:p-10"><div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10"><div className="flex items-center justify-between border-b border-slate-100 pb-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-sky-700">Preview · {draft.status}</p><h2 className="mt-2 text-3xl font-bold">{draft.title}</h2></div><button onClick={() => setPreview(false)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close preview"><X className="size-5" /></button></div><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{draft.excerpt}</p><div className="mt-8 space-y-6">{(Array.isArray(draft.body?.sections) ? draft.body.sections : []).map((section) => { const items = Array.isArray(section.items) ? section.items : []; return <div key={section.id} className="rounded-2xl bg-slate-50 p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-sky-700">{section.label ?? "Content block"}</p><h3 className="mt-2 text-2xl font-bold">{section.heading ?? ""}</h3><p className="mt-3 leading-7 text-slate-600">{section.body ?? ""}</p>{items.length > 0 && <ul className="mt-4 grid gap-2 sm:grid-cols-3">{items.map((item) => <li key={item} className="rounded-xl bg-white p-3 text-sm font-semibold shadow-sm">{item}</li>)}</ul>}{section.buttonLabel && <button className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">{section.buttonLabel}</button>}</div>})}</div></div></div>}
    {showHistory && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 sm:items-center"><div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-violet-700">Revision history</p><h2 className="mt-1 text-xl font-bold">Saved versions</h2></div><button onClick={() => setShowHistory(false)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close revision history"><X className="size-5" /></button></div><div className="mt-5 max-h-[55vh] space-y-2 overflow-y-auto">{loadingRevisions ? <div className="flex items-center gap-2 py-8 text-sm text-slate-500"><Loader2 className="size-4 animate-spin" />Loading revisions…</div> : revisions.length === 0 ? <p className="py-8 text-sm text-slate-500">No saved revisions yet. Your next draft save will start the history.</p> : revisions.map((revision) => <div key={revision.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"><div><p className="text-sm font-semibold">{formatDate(revision.created_at)}</p><p className="text-xs text-slate-500">{revision.seo_title || "Untitled SEO version"}</p></div><button onClick={() => restore(revision)} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700"><RotateCcw className="size-3.5" />Restore</button></div>)}</div></div></div>}
  </main>
}

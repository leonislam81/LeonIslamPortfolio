"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpRight, Code2, Mail, MapPin, Phone, Sparkles } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const links = ["Services", "Skills", "Projects", "Experience", "Testimonials", "Contact"]
  const scrollTo = (id: string) => document.querySelector(`#${id.toLowerCase()}`)?.scrollIntoView({ behavior: "smooth" })

  return <footer className="overflow-hidden bg-slate-950 text-white">
    <div className="container mx-auto px-4 pt-16 sm:pt-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-500/20 via-slate-900 to-emerald-500/15 px-6 py-10 sm:px-10 sm:py-12">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div><div className="mb-4 flex items-center gap-2 text-sm font-medium text-sky-200"><Sparkles className="h-4 w-4" />Have a project in mind?</div><h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Let’s turn your website into a dependable growth tool.</h2></div>
          <Button onClick={() => scrollTo("Contact")} className="h-12 rounded-xl bg-white px-6 text-slate-950 hover:bg-sky-100">Start a conversation <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div><div className="flex items-center gap-2 font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500"><Code2 className="h-5 w-5" /></span>Leon Islam</div><p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">A hands-on WordPress, Shopify, and Wix specialist building fast, polished websites that are easy to maintain.</p><div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-300"><span className="rounded-full border border-white/10 px-3 py-1.5">WordPress</span><span className="rounded-full border border-white/10 px-3 py-1.5">Shopify</span><span className="rounded-full border border-white/10 px-3 py-1.5">Wix</span></div></div>
        <div><h3 className="text-sm font-semibold uppercase tracking-[.16em] text-slate-400">Navigate</h3><div className="mt-5 grid grid-cols-2 gap-y-3">{links.map(link => <button key={link} onClick={() => scrollTo(link)} className="text-left text-sm text-slate-300 transition hover:text-sky-300">{link}</button>)}</div></div>
        <div><h3 className="text-sm font-semibold uppercase tracking-[.16em] text-slate-400">Say hello</h3><div className="mt-5 space-y-3 text-sm text-slate-300"><a href="mailto:leonislam810@gmail.com" className="flex items-center gap-3 transition hover:text-sky-300"><Mail className="h-4 w-4 text-sky-300" />leonislam810@gmail.com</a><a href="https://wa.me/8801521783498" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-emerald-300"><Phone className="h-4 w-4 text-emerald-300" />+880 1521 783498</a><span className="flex items-center gap-3"><MapPin className="h-4 w-4 text-slate-400" />Bangladesh · working globally</span></div></div>
      </div>
      <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>© {currentYear} Leon Islam. Built with care.</span><span>Clear communication · Reliable delivery · Practical results</span></div>
    </div>
  </footer>
}

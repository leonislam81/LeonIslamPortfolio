"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpRight, Code2, Mail, MapPin, Phone, Sparkles } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const links = ["Services", "Capabilities", "Support", "Platforms", "Process", "Contact"]
  const sectionIds: Record<string, string> = { Capabilities: "skills", Support: "projects", Platforms: "experience", Process: "testimonials" }
  const scrollTo = (id: string) => document.querySelector(`#${sectionIds[id] || id.toLowerCase()}`)?.scrollIntoView({ behavior: "smooth" })
  return <footer className="overflow-hidden border-t border-border bg-slate-50 text-foreground dark:bg-slate-950">
    <div className="container mx-auto px-4 pt-16 sm:pt-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-portfolio-primary/20 bg-gradient-to-br from-portfolio-primary to-portfolio-accent px-6 py-10 text-portfolio-primary-foreground shadow-xl shadow-portfolio-primary/20 sm:px-10 sm:py-12"><div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" /><div className="relative grid items-end gap-8 lg:grid-cols-[1fr_auto]"><div><div className="mb-4 flex items-center gap-2 text-sm font-medium opacity-80"><Sparkles className="h-4 w-4" />Need reliable online support?</div><h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Let’s make your website, catalog, and daily admin work easier to manage.</h2></div><Button onClick={() => scrollTo("Contact")} className="h-12 rounded-xl bg-white px-6 text-slate-950 hover:bg-slate-100">Start a conversation <ArrowUpRight className="ml-2 h-4 w-4" /></Button></div></div>
      <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]"><div><div className="flex items-center gap-2 font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-portfolio-primary text-portfolio-primary-foreground"><Code2 className="h-5 w-5" /></span>Leon Islam</div><p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">Website, e-commerce, Amazon, and admin support for businesses that need accurate, dependable online help.</p><div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground"><span className="rounded-full border border-border px-3 py-1.5">Website support</span><span className="rounded-full border border-border px-3 py-1.5">Product listings</span><span className="rounded-full border border-border px-3 py-1.5">Admin tasks</span></div></div><div><h3 className="text-sm font-semibold uppercase tracking-[.16em] text-muted-foreground">Navigate</h3><div className="mt-5 grid grid-cols-2 gap-y-3">{links.map(link => <button key={link} onClick={() => scrollTo(link)} className="text-left text-sm text-muted-foreground transition hover:text-portfolio-primary">{link}</button>)}</div></div><div><h3 className="text-sm font-semibold uppercase tracking-[.16em] text-muted-foreground">Say hello</h3><div className="mt-5 space-y-3 text-sm text-muted-foreground"><a href="mailto:leonislam810@gmail.com" className="flex items-center gap-3 transition hover:text-portfolio-primary"><Mail className="h-4 w-4 text-portfolio-primary" />leonislam810@gmail.com</a><a href="https://wa.me/8801521783498" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-portfolio-primary"><Phone className="h-4 w-4 text-portfolio-accent" />+880 1521 783498</a><span className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" />Bangladesh · working globally</span></div></div></div>
      <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© {currentYear} Leon Islam. Built with care.</span><span>Clear communication · Reliable delivery · Practical results</span></div>
      <div className="pb-6 text-center text-xs text-muted-foreground">
        <a href="/privacy" className="font-medium transition hover:text-portfolio-primary">Privacy Policy</a>
      </div>
    </div>
  </footer>
}

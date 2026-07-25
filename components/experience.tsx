"use client"

import { Blocks, CheckCircle2, FileSpreadsheet, PackageCheck, Settings, Store } from "lucide-react"

const platforms = [
  { icon: Blocks, title: "Website platforms", items: ["WordPress", "Shopify", "Wix", "WooCommerce"] },
  { icon: PackageCheck, title: "E-commerce channels", items: ["Amazon product listings", "Store catalogs", "Product variations", "Marketplace data"] },
  { icon: FileSpreadsheet, title: "Admin tools", items: ["Google Sheets", "Microsoft Excel", "PDF conversion", "Web research"] },
]

export function Experience() {
  return <section id="experience" className="relative overflow-hidden bg-muted/30 py-20 md:py-28"><div className="container mx-auto px-4"><div className="mx-auto mb-12 max-w-2xl text-center md:mb-16"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-portfolio-primary/10 px-3 py-1 text-sm font-medium text-portfolio-primary"><Settings className="h-4 w-4" />Platforms & tools</div><h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">Support that fits the tools you already use.</h2><p className="mt-4 text-lg leading-relaxed text-muted-foreground">Flexible help across website platforms, e-commerce catalogs, and the data tools behind your operations.</p></div><div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">{platforms.map(platform => { const Icon = platform.icon; return <article key={platform.title} className="rounded-3xl border border-border bg-card p-7 shadow-sm"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-portfolio-primary/10 text-portfolio-primary"><Icon className="h-5 w-5" /></span><h3 className="mt-6 text-xl font-semibold text-foreground">{platform.title}</h3><div className="mt-5 flex flex-wrap gap-2">{platform.items.map(item => <span key={item} className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-portfolio-accent" />{item}</span>)}</div></article> })}</div></div></section>
}

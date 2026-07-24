"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Compass as Wordpress, ShoppingCart, Palette, Database, Bug, Settings, ArrowRight, CheckCircle, TrendingUp, RefreshCw, Zap, Sparkles } from "lucide-react"

const services = [
  { id: "wordpress-dev", icon: Wordpress, title: "WordPress development", description: "Fast, secure sites with clean themes, SEO basics, and reliable updates.", features: ["Custom theme development", "Plugin integration", "Security hardening", "Performance optimization"], accent: "from-sky-500 to-cyan-400" },
  { id: "shopify-setup", icon: ShoppingCart, title: "Shopify store setup", description: "Conversion-ready stores, theme tweaks, products, and app integrations.", features: ["Store configuration", "Theme customization", "Product catalog setup", "Payment integration"], accent: "from-emerald-500 to-teal-400" },
  { id: "wix-design", icon: Palette, title: "Wix design & launch", description: "Modern, responsive designs delivered quickly and built to be easy to manage.", features: ["Custom design", "Mobile optimization", "SEO setup", "Content management"], accent: "from-violet-500 to-fuchsia-400" },
  { id: "data-entry", icon: Database, title: "Content operations", description: "Accurate, consistent pages, posts, and products at scale.", features: ["Bulk content upload", "Data migration", "Content formatting", "Quality assurance"], accent: "from-orange-500 to-amber-400" },
  { id: "bug-fixing", icon: Bug, title: "Fixes & performance", description: "Diagnose layout, script, or speed issues and improve Core Web Vitals.", features: ["Issue diagnosis", "Code debugging", "Speed optimization", "Cross-browser testing"], accent: "from-rose-500 to-pink-400" },
  { id: "management", icon: Settings, title: "Website care plans", description: "Backups, uptime checks, edits, and ongoing technical support.", features: ["Regular backups", "Security monitoring", "Content updates", "Technical support"], accent: "from-indigo-500 to-blue-400" },
  { id: "seo-optimization", icon: TrendingUp, title: "SEO & analytics", description: "Technical SEO, content improvements, and meaningful performance tracking.", features: ["Technical SEO audit", "Content optimization", "Analytics setup", "Ranking improvement"], accent: "from-lime-500 to-emerald-400" },
  { id: "ecommerce-migration", icon: RefreshCw, title: "Platform migration", description: "Move platforms while protecting your data, SEO, and site functionality.", features: ["Platform assessment", "Data migration", "SEO preservation", "Testing & validation"], accent: "from-cyan-500 to-blue-400" },
  { id: "custom-integrations", icon: Zap, title: "Automations", description: "Connect your website with third-party tools, APIs, and useful workflows.", features: ["API integrations", "Workflow automation", "Custom plugins", "System connections"], accent: "from-purple-500 to-violet-400" },
]

export function Services() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  return (
    <section id="services" className="relative overflow-hidden bg-white py-20 text-foreground dark:bg-slate-950 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,.10),transparent_28%),radial-gradient(circle_at_85%_65%,rgba(20,184,166,.08),transparent_24%)] dark:bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,.18),transparent_28%),radial-gradient(circle_at_85%_65%,rgba(20,184,166,.12),transparent_24%)]" />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <Badge className="border border-portfolio-primary/20 bg-portfolio-primary/10 px-3 py-1 text-portfolio-primary hover:bg-portfolio-primary/10"><Sparkles className="mr-1.5 h-3.5 w-3.5" />Capabilities</Badge>
          <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">Digital work that moves your business forward.</h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">From a focused fix to an end-to-end launch, every service is designed around practical results, clear communication, and a site that stays easy to run.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon
            const isExpanded = expandedCard === service.id
            return <article key={service.id} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-portfolio-primary/30 hover:shadow-xl sm:p-7">
              <div className={`absolute right-0 top-0 h-24 w-24 rounded-bl-[4rem] bg-gradient-to-br ${service.accent} opacity-15 transition-opacity group-hover:opacity-30`} />
              <div className="relative flex items-start justify-between gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${service.accent} shadow-lg`}><Icon className="h-5 w-5 text-white" /></div>
                <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
              </div>
              <h3 className="relative mt-7 text-xl font-semibold tracking-tight text-foreground">{service.title}</h3>
              <p className="relative mt-3 min-h-12 text-sm leading-6 text-muted-foreground">{service.description}</p>
              <div className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ${isExpanded ? "mt-5 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden"><ul className="space-y-2 border-t border-border pt-5">{service.features.map(feature => <li key={feature} className="flex gap-2 text-sm text-muted-foreground"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-portfolio-accent" />{feature}</li>)}</ul></div>
              </div>
              <Button variant="ghost" onClick={() => setExpandedCard(isExpanded ? null : service.id)} className="relative mt-5 h-auto w-full justify-between rounded-xl px-0 py-2 text-portfolio-primary hover:bg-transparent hover:text-portfolio-primary">
                {isExpanded ? "Close details" : "Explore service"}<ArrowRight className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : "group-hover:translate-x-1"}`} />
              </Button>
            </article>
          })}
        </div>
      </div>
    </section>
  )
}

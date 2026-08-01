import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import type { PublishedSection } from "@/lib/published-content"

export function PublishedContentSections({ sections }: { sections: PublishedSection[] }) {
  const additionalSections = sections.filter((section) => section.type !== "hero")
  if (additionalSections.length === 0) return null

  return <div className="relative bg-background">
    {additionalSections.map((section) => <section key={section.id} className="border-t border-border/70 py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-border bg-card p-7 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-portfolio-primary">{section.label}</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{section.heading}</h2>
          <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-8 text-muted-foreground">{section.body}</p>
          {section.items.length > 0 && <ul className="mt-7 grid gap-3 sm:grid-cols-3">{section.items.map((item) => <li key={item} className="flex gap-2 rounded-xl border border-border bg-muted/40 p-4 text-sm font-semibold text-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-portfolio-accent" />{item}</li>)}</ul>}
          {section.buttonLabel && section.buttonHref && <Link href={section.buttonHref} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-portfolio-primary px-5 py-3 text-sm font-semibold text-portfolio-primary-foreground shadow-lg shadow-portfolio-primary/20 transition hover:bg-portfolio-primary/90">{section.buttonLabel}<ArrowRight className="size-4" /></Link>}
        </div>
      </div>
    </section>)}
  </div>
}

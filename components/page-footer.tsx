import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'

export function PageFooter() {
  return (
    <footer className="border-t border-border bg-muted/25">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-semibold text-foreground">Leon Islam</p><p className="mt-1">Website, e-commerce, Amazon, and admin support.</p></div>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          <a href="mailto:info@leonislam.com" className="inline-flex items-center gap-2 transition hover:text-portfolio-primary"><Mail className="h-4 w-4" /> Email</a>
          <a href="https://wa.me/8801521783498" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-portfolio-primary"><Phone className="h-4 w-4" /> WhatsApp</a>
          <Link href="/privacy" className="transition hover:text-portfolio-primary">Privacy</Link>
        </div>
      </div>
    </footer>
  )
}

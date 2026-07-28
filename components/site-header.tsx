'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Code2, MessageSquare } from 'lucide-react'
import { BookingLink } from '@/components/booking-link'
import { ThemeToggle } from '@/components/theme-toggle'

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:h-20">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold text-foreground" aria-label="Leon Islam home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-portfolio-primary text-portfolio-primary-foreground shadow-sm"><Code2 className="h-5 w-5" /></span>
          <span className="hidden sm:inline">Leon Islam</span>
        </Link>
        <nav aria-label="Site navigation" className="flex min-w-0 items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname === link.href || (link.href === '/services' && pathname.startsWith('/services/'))

            return <Link key={link.href} href={link.href} aria-current={isActive ? 'page' : undefined} className={`rounded-lg px-2 py-2 text-xs transition sm:px-3 sm:text-sm ${isActive ? 'bg-portfolio-primary/10 font-semibold text-portfolio-primary' : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground'}`}>{link.label}</Link>
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle />
          <BookingLink placement="header" className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted lg:inline-flex"><CalendarDays className="h-4 w-4" /> Book a call</BookingLink>
          <Link href="/start-project" className="hidden items-center gap-2 rounded-xl bg-portfolio-primary px-3 py-2 text-sm font-semibold text-portfolio-primary-foreground shadow-sm hover:bg-portfolio-primary/90 lg:inline-flex"><MessageSquare className="h-4 w-4" /> Start a project</Link>
        </div>
      </div>
    </header>
  )
}

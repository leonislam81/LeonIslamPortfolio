'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

declare global {
  interface Window { Cal?: (...args: unknown[]) => void }
}

const themeStyles = {
  light: { 'cal-brand': '#4338ca', 'cal-brand-emphasis': '#3730a3', 'cal-brand-text': '#ffffff', 'cal-text': '#1e293b', 'cal-text-emphasis': '#0f172a', 'cal-text-subtle': '#64748b', 'radius-2xl': '1rem', 'radius-3xl': '1.5rem' },
  dark: { 'cal-brand': '#a5b4fc', 'cal-brand-emphasis': '#c7d2fe', 'cal-brand-text': '#172554', 'cal-text': '#e2e8f0', 'cal-text-emphasis': '#f8fafc', 'cal-text-subtle': '#94a3b8', 'radius-2xl': '1rem', 'radius-3xl': '1.5rem' },
}

export function CalBookingEmbed() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.cal.com/embed/embed.js'
    script.async = true
    script.onload = () => {
      window.Cal?.('init', 'project-discovery', { origin: 'https://cal.com' })
      window.Cal?.('inline', { elementOrSelector: '#cal-booking', calLink: 'leobislam/project-discovery' })
      window.Cal?.('ui', { theme: resolvedTheme === 'dark' ? 'dark' : 'light', hideEventTypeDetails: false, cssVarsPerTheme: themeStyles })
    }
    document.body.appendChild(script)
    return () => script.remove()
  }, [resolvedTheme])

  return <div id="cal-booking" className="min-h-[720px] overflow-hidden rounded-3xl border border-border bg-card shadow-sm" />
}

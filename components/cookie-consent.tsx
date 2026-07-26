'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Cookie, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ConsentChoice = 'accepted' | 'rejected' | null

const storageKey = 'leon-analytics-consent'

export function CookieConsent({ measurementId }: { measurementId: string }) {
  const [choice, setChoice] = useState<ConsentChoice>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const savedChoice = window.localStorage.getItem(storageKey)
    if (savedChoice === 'accepted' || savedChoice === 'rejected') {
      setChoice(savedChoice)
    }
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (choice !== 'accepted' || document.getElementById('google-analytics-script')) return

    window.dataLayer = window.dataLayer || []
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args)
    window.gtag('js', new Date())
    window.gtag('config', measurementId, { anonymize_ip: true })

    const script = document.createElement('script')
    script.id = 'google-analytics-script'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
  }, [choice, measurementId])

  const saveChoice = (nextChoice: Exclude<ConsentChoice, null>) => {
    window.localStorage.setItem(storageKey, nextChoice)
    setChoice(nextChoice)
  }

  if (!isReady) return null

  if (choice) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setChoice(null)}
        className="fixed bottom-24 left-3 z-50 rounded-full border-border bg-card/95 px-3 shadow-lg backdrop-blur hover:bg-muted sm:bottom-5 sm:left-5 sm:px-4"
      >
        <Settings2 className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Cookie settings</span><span className="sr-only sm:hidden">Cookie settings</span>
      </Button>
    )
  }

  return (
    <aside className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-xl rounded-3xl border border-border bg-card p-5 shadow-2xl shadow-slate-950/20 backdrop-blur sm:bottom-6 sm:p-6" aria-label="Cookie preferences">
      <div className="flex gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-portfolio-primary/10 text-portfolio-primary">
          <Cookie className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-semibold text-foreground">Your privacy choices</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">This site uses optional analytics cookies to understand visits and improve the website. You can accept or decline analytics at any time.</p>
          <Link href="/privacy" className="mt-2 inline-block text-sm font-medium text-portfolio-primary hover:underline">Read the Privacy Policy</Link>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => saveChoice('rejected')} className="rounded-xl">Decline analytics</Button>
            <Button type="button" onClick={() => saveChoice('accepted')} className="rounded-xl bg-portfolio-primary text-portfolio-primary-foreground hover:bg-portfolio-primary/90">Accept analytics</Button>
          </div>
        </div>
      </div>
    </aside>
  )
}

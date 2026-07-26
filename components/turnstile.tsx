"use client"

import { useEffect, useRef } from "react"

type TurnstileOptions = {
  sitekey: string
  action?: string
  callback: (token: string) => void
  "expired-callback": () => void
  "error-callback": () => void
  theme: "auto"
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileOptions) => string
      remove: (widgetId: string) => void
    }
  }
}

type TurnstileProps = {
  siteKey?: string
  onVerify: (token: string) => void
  onExpire: () => void
}

const scriptId = "cloudflare-turnstile-script"

export function Turnstile({ siteKey, onVerify, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    let widgetId: string | undefined
    let isCancelled = false

    const renderWidget = () => {
      if (isCancelled || !containerRef.current || !window.turnstile) return

      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: "contact",
        callback: onVerify,
        "expired-callback": onExpire,
        "error-callback": onExpire,
        theme: "auto",
      })
    }

    const script = document.getElementById(scriptId) as HTMLScriptElement | null
    if (window.turnstile) {
      renderWidget()
    } else if (script) {
      script.addEventListener("load", renderWidget, { once: true })
    } else {
      const newScript = document.createElement("script")
      newScript.id = scriptId
      newScript.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      newScript.async = true
      newScript.addEventListener("load", renderWidget, { once: true })
      document.head.appendChild(newScript)
    }

    return () => {
      isCancelled = true
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [siteKey, onExpire, onVerify])

  if (!siteKey) return null

  return <div ref={containerRef} className="pt-1" />
}

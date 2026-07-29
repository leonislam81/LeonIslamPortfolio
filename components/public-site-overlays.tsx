"use client"

import { usePathname } from "next/navigation"
import { CookieConsent } from "@/components/cookie-consent"
import { ProjectAssistant } from "@/components/project-assistant"

export function PublicSiteOverlays({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  if (pathname.startsWith("/dashboard")) return null
  return <><ProjectAssistant /><CookieConsent measurementId={measurementId} /></>
}

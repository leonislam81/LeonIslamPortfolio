"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function CalBookingEmbed() {
  const { resolvedTheme } = useTheme()
  const [isCompact, setIsCompact] = useState(false)
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1100px)")
    const updateLayout = () => setIsCompact(mediaQuery.matches)
    updateLayout()
    mediaQuery.addEventListener("change", updateLayout)
    return () => mediaQuery.removeEventListener("change", updateLayout)
  }, [])

  const layout = isCompact ? "column_view" : "month_view"

  return (
    <div className="booking-frame overflow-hidden rounded-[1.35rem] border border-border bg-white px-3 pt-3 dark:bg-[#111827] sm:px-4 sm:pt-4">
      <iframe
        key={`${theme}-${layout}`}
        title="Book a project discovery call with Leon Islam"
        src={`https://cal.com/leobislam/project-discovery?embed=1&theme=${theme}&layout=${layout}`}
        className="block h-[860px] w-full rounded-[1.05rem] border-0 bg-white dark:bg-[#111827] sm:h-[640px] lg:h-[580px]"
        loading="eager"
      />
    </div>
  )
}

'use client'

import { useTheme } from 'next-themes'

export function CalBookingEmbed() {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <div className="booking-frame overflow-hidden rounded-[1.5rem] border border-border bg-card/95 px-3 pt-3 dark:bg-card/90 sm:px-5 sm:pt-5">
      <iframe
        key={theme}
        title="Book a project discovery call with Leon Islam"
        src={`https://cal.com/leobislam/project-discovery?embed=1&theme=${theme}`}
        className="block h-[860px] w-full rounded-[1.1rem] border-0 bg-card sm:h-[620px] lg:h-[560px]"
        loading="eager"
      />
    </div>
  )
}

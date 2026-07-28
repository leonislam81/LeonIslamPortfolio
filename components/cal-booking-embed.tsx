'use client'

import { useTheme } from 'next-themes'

export function CalBookingEmbed() {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <iframe
        key={theme}
        title="Book a project discovery call with Leon Islam"
        src={`https://cal.com/leobislam/project-discovery?embed=1&theme=${theme}`}
        className="block h-[860px] w-full border-0 bg-card sm:h-[620px] lg:h-[560px]"
        loading="eager"
      />
    </div>
  )
}

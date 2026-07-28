'use client'

import { useTheme } from 'next-themes'

export function CalBookingEmbed() {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <iframe
      title="Book a project discovery call with Leon Islam"
      src={`https://cal.com/leobislam/project-discovery?embed=1&theme=${theme}`}
      className="h-[760px] w-full rounded-3xl border-0 bg-card"
      loading="eager"
    />
  )
}

'use client'

import { useTheme } from 'next-themes'

export function CalBookingEmbed() {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <div className="booking-frame overflow-hidden rounded-[1.4rem] p-px">
      <iframe
        key={theme}
        title="Book a project discovery call with Leon Islam"
        src={`https://cal.com/leobislam/project-discovery?embed=1&theme=${theme}`}
        className="block h-[860px] w-full rounded-[calc(1.4rem-1px)] border-0 bg-card sm:h-[620px] lg:h-[560px]"
        loading="eager"
      />
    </div>
  )
}

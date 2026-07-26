'use client'

import type { ReactNode } from 'react'
import { trackEvent } from '@/lib/analytics'

type BookingLinkProps = {
  children: ReactNode
  className?: string
  placement: 'header' | 'hero' | 'start_project'
}

export function BookingLink({ children, className, placement }: BookingLinkProps) {
  return (
    <a
      href="https://cal.com/leobislam/project-discovery"
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => trackEvent('booking_call_click', { event_category: 'engagement', placement, booking_type: 'project_discovery' })}
    >
      {children}
    </a>
  )
}

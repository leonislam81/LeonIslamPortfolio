'use client'

import type { ReactNode } from 'react'
import { trackEvent } from '@/lib/analytics'

type BookingLinkProps = {
  bookingDetails?: string
  children: ReactNode
  className?: string
  placement: 'header' | 'hero' | 'service' | 'start_project'
}

export function BookingLink({ bookingDetails, children, className, placement }: BookingLinkProps) {
  const bookingUrl = bookingDetails
    ? `https://cal.com/leobislam/project-discovery?project-details=${encodeURIComponent(bookingDetails)}`
    : 'https://cal.com/leobislam/project-discovery'

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => trackEvent('booking_call_click', { event_category: 'engagement', placement, booking_type: 'project_discovery', service_interest: bookingDetails })}
    >
      {children}
    </a>
  )
}

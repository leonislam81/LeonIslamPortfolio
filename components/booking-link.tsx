'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

type BookingLinkProps = {
  bookingDetails?: string
  children: ReactNode
  className?: string
  placement: 'header' | 'hero' | 'service' | 'start_project'
}

export function BookingLink({ bookingDetails, children, className, placement }: BookingLinkProps) {
  const bookingUrl = bookingDetails
    ? `/book-call?service=${encodeURIComponent(bookingDetails)}`
    : '/book-call'

  return (
    <Link
      href={bookingUrl}
      className={className}
      onClick={() => trackEvent('booking_call_click', { event_category: 'engagement', placement, booking_type: 'project_discovery', service_interest: bookingDetails })}
    >
      {children}
    </Link>
  )
}

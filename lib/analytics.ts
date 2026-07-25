type AnalyticsParameters = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, parameters?: AnalyticsParameters) => void
  }
}

export function trackEvent(eventName: string, parameters?: AnalyticsParameters) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

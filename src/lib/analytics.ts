import { isAnalyticsEnabled } from './preferences'

export type AnalyticsEventType =
  | 'page_view'
  | 'date_navigated'
  | 'bookmark_toggled'
  | 'search_performed'
  | 'theme_changed'
  | 'font_size_changed'
  | 'language_switched'
  | 'timezone_changed'
  | 'reading_shared'
  | 'notification_toggled'

export interface EventProperties {
  [key: string]: string | number | boolean | undefined | null
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    plausible?: (eventName: string, options?: { props?: EventProperties }) => void
    umami?: {
      track: (eventName: string, data?: EventProperties) => void
    }
  }
}

function hasDoNotTrack(): boolean {
  if (typeof window === 'undefined') return false
  const nav = window.navigator as unknown as { globalPrivacyControl?: boolean; doNotTrack?: string }
  const win = window as unknown as { doNotTrack?: string }
  return (
    nav.globalPrivacyControl === true ||
    nav.doNotTrack === '1' ||
    win.doNotTrack === '1'
  )
}

function isTrackingAllowed(): boolean {
  return isAnalyticsEnabled.value && !hasDoNotTrack()
}

export function initAnalytics() {
  if (typeof window === 'undefined' || !isTrackingAllowed()) return

  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (gaId && !document.getElementById('ga-script')) {
    const script = document.createElement('script')
    script.id = 'ga-script'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      window.dataLayer?.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', gaId, {
      anonymize_ip: true,
      send_page_view: false
    })
  }

  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN
  if (plausibleDomain && !document.getElementById('plausible-script')) {
    const script = document.createElement('script')
    script.id = 'plausible-script'
    script.defer = true
    script.dataset.domain = plausibleDomain
    script.src = import.meta.env.VITE_PLAUSIBLE_SRC || 'https://plausible.io/js/script.manual.js'
    document.head.appendChild(script)
  }

  const umamiWebsiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID
  if (umamiWebsiteId && !document.getElementById('umami-script')) {
    const script = document.createElement('script')
    script.id = 'umami-script'
    script.defer = true
    script.dataset.websiteId = umamiWebsiteId
    script.src = import.meta.env.VITE_UMAMI_SRC || 'https://cloud.umami.is/script.js'
    document.head.appendChild(script)
  }

  const cfToken = import.meta.env.VITE_CLOUDFLARE_BEACON_TOKEN
  if (cfToken && !document.getElementById('cloudflare-beacon-script')) {
    const script = document.createElement('script')
    script.id = 'cloudflare-beacon-script'
    script.defer = true
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
    script.dataset.cfBeacon = JSON.stringify({ token: cfToken })
    document.head.appendChild(script)
  }
}

export function trackEvent(name: AnalyticsEventType, properties?: EventProperties) {
  if (!isTrackingAllowed()) return

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, properties)
  }

  if (typeof window.plausible === 'function') {
    window.plausible(name, { props: properties })
  }

  if (window.umami && typeof window.umami.track === 'function') {
    window.umami.track(name, properties)
  }
}

export function trackPageView(pagePath: string, pageTitle: string) {
  if (!isTrackingAllowed()) return

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: window.location.href
    })
  }

  if (typeof window.plausible === 'function') {
    window.plausible('pageview', {
      props: {
        path: pagePath,
        title: pageTitle
      }
    })
  }

  if (window.umami && typeof window.umami.track === 'function') {
    window.umami.track('pageview', {
      url: pagePath,
      title: pageTitle
    })
  }
}

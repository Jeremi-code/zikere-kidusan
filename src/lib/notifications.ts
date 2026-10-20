import { ref } from 'vue'
import type { SynaxariumEntry } from './types'
import { getTodayEthiopian, ETHIOPIAN_MONTHS } from './ethiopianCalendar'
import { synaxariumData } from './synaxariumData'

const NOTIFICATION_KEY = 'synaxarium_notifications_enabled'
const LAST_NOTIFIED_DATE_KEY = 'synaxarium_last_notified_date'

export const isNotificationsEnabled = ref<boolean>(
  typeof window !== 'undefined' && localStorage.getItem(NOTIFICATION_KEY) === 'true'
)

let scheduledTimerId: ReturnType<typeof setTimeout> | null = null
let heartbeatIntervalId: ReturnType<typeof setInterval> | null = null
let isListenersAttached = false

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied'
  return Notification.permission
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied'
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    setNotificationsEnabled(false)
  }
  return permission
}

export function setNotificationsEnabled(enabled: boolean): void {
  isNotificationsEnabled.value = enabled
  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTIFICATION_KEY, enabled ? 'true' : 'false')
  }
}

export function getMillisecondsUntilNext6AM(): number {
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0)
  if (now.getTime() >= target.getTime()) {
    target.setDate(target.getDate() + 1)
  }
  return Math.max(1000, target.getTime() - now.getTime())
}

export function isPast6AMToday(): boolean {
  const now = new Date()
  return now.getHours() >= 6
}

export async function sendNotificationWithTitle(
  title: string,
  options?: NotificationOptions
): Promise<boolean> {
  if (!isNotificationSupported()) return false

  if (Notification.permission !== 'granted') {
    const granted = await requestNotificationPermission()
    if (granted !== 'granted') return false
  }

  const notificationOptions: NotificationOptions = {
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'synaxarium-daily-6am',
    renotify: true,
    ...options
  }

  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      if (registration && 'showNotification' in registration) {
        await registration.showNotification(title, notificationOptions)
        return true
      }
    } catch {
    }
  }

  try {
    new Notification(title, notificationOptions)
    return true
  } catch {
    return false
  }
}

export async function sendSynaxariumNotification(
  entry: SynaxariumEntry,
  lang: 'am' | 'en' = 'am'
): Promise<boolean> {
  const isEn = lang === 'en'
  const title = (isEn && entry.titleEn ? entry.titleEn : entry.title) || (isEn ? 'Daily Synaxarium' : 'የዕለቱ ዝክረ ቅዱሳን')
  
  const mInfo = ETHIOPIAN_MONTHS[entry.month - 1]
  const monthLabel = mInfo ? (isEn ? mInfo.nameEn : mInfo.nameAm) : ''
  const datePrefix = monthLabel ? `${monthLabel} ${entry.day} · ` : ''

  const feasts = isEn && entry.annualFeastsEn && entry.annualFeastsEn.length > 0
    ? entry.annualFeastsEn
    : entry.annualFeasts

  const bodyContent = feasts && feasts.length > 0
    ? feasts.slice(0, 3).join(' · ')
    : (isEn ? entry.subtitleEn || '' : entry.subtitle || '')

  const body = datePrefix ? `${datePrefix}${bodyContent}` : bodyContent

  const success = await sendNotificationWithTitle(title, {
    body,
    tag: 'synaxarium-daily-6am',
    data: {
      url: '/',
      id: entry.id,
      month: entry.month,
      day: entry.day
    }
  })

  return success
}

export async function checkAndTrigger6AMNotification(
  lang: 'am' | 'en' = 'am'
): Promise<boolean> {
  if (!isNotificationsEnabled.value) return false
  if (getNotificationPermission() !== 'granted') return false
  if (!isPast6AMToday()) return false

  const todayEth = getTodayEthiopian()
  const todayKey = `${todayEth.year}-${todayEth.month}-${todayEth.day}`
  const lastNotified = localStorage.getItem(LAST_NOTIFIED_DATE_KEY)

  if (lastNotified === todayKey) {
    return false
  }

  const todayEntry = synaxariumData.find(
    (e) => e.month === todayEth.month && e.day === todayEth.day
  ) || synaxariumData[0]

  const sent = await sendSynaxariumNotification(todayEntry, lang)
  if (sent) {
    localStorage.setItem(LAST_NOTIFIED_DATE_KEY, todayKey)
  }
  return sent
}

export function scheduleDaily6AMNotification(lang: 'am' | 'en' = 'am'): void {
  if (scheduledTimerId) {
    clearTimeout(scheduledTimerId)
    scheduledTimerId = null
  }

  if (!isNotificationsEnabled.value || getNotificationPermission() !== 'granted') {
    return
  }

  checkAndTrigger6AMNotification(lang)

  const msUntil6AM = getMillisecondsUntilNext6AM()
  scheduledTimerId = setTimeout(async () => {
    await checkAndTrigger6AMNotification(lang)
    scheduleDaily6AMNotification(lang)
  }, msUntil6AM)

  attachLifecycleListeners(lang)
  registerPeriodicSync()
}

export function cancelDaily6AMNotification(): void {
  if (scheduledTimerId) {
    clearTimeout(scheduledTimerId)
    scheduledTimerId = null
  }
  if (heartbeatIntervalId) {
    clearInterval(heartbeatIntervalId)
    heartbeatIntervalId = null
  }
}

function attachLifecycleListeners(lang: 'am' | 'en'): void {
  if (isListenersAttached || typeof window === 'undefined') return
  isListenersAttached = true

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkAndTrigger6AMNotification(lang)
      scheduleDaily6AMNotification(lang)
    }
  })

  heartbeatIntervalId = setInterval(() => {
    checkAndTrigger6AMNotification(lang)
  }, 30 * 60 * 1000)
}

export async function registerPeriodicSync(): Promise<void> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  try {
    const registration = await navigator.serviceWorker.ready
    if ('periodicSync' in registration) {
      const periodicSync = (registration as any).periodicSync
      const tags = await periodicSync.getTags()
      if (!tags.includes('synaxarium-daily-6am')) {
        await periodicSync.register('synaxarium-daily-6am', {
          minInterval: 12 * 60 * 60 * 1000
        })
      }
    }
  } catch {
  }
}

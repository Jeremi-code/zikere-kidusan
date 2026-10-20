import { ref } from 'vue'
import type { SynaxariumEntry } from './types'

const NOTIFICATION_KEY = 'synaxarium_notifications_enabled'
const LAST_NOTIFIED_DATE_KEY = 'synaxarium_last_notified_date'

export const isNotificationsEnabled = ref<boolean>(
  typeof window !== 'undefined' && localStorage.getItem(NOTIFICATION_KEY) === 'true'
)

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
    tag: 'synaxarium-notification',
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
  const title = (isEn && entry.titleEn ? entry.titleEn : entry.title) || (isEn ? 'Synaxarium Commemoration' : 'የዕለቱ ዝክረ ቅዱሳን')
  
  const feasts = isEn && entry.annualFeastsEn && entry.annualFeastsEn.length > 0
    ? entry.annualFeastsEn
    : entry.annualFeasts

  const body = feasts && feasts.length > 0
    ? feasts.slice(0, 3).join(' · ')
    : (isEn ? entry.subtitleEn || '' : entry.subtitle || '')

  const success = await sendNotificationWithTitle(title, {
    body,
    tag: `synaxarium-${entry.id}`,
    data: {
      url: '/',
      id: entry.id,
      month: entry.month,
      day: entry.day
    }
  })

  return success
}

export async function checkAndNotifyToday(
  entry: SynaxariumEntry,
  lang: 'am' | 'en' = 'am'
): Promise<boolean> {
  if (!isNotificationsEnabled.value) return false
  if (getNotificationPermission() !== 'granted') return false

  const todayKey = `${entry.month}-${entry.day}`
  const lastNotified = localStorage.getItem(LAST_NOTIFIED_DATE_KEY)

  if (lastNotified === todayKey) {
    return false
  }

  const sent = await sendSynaxariumNotification(entry, lang)
  if (sent) {
    localStorage.setItem(LAST_NOTIFIED_DATE_KEY, todayKey)
  }
  return sent
}

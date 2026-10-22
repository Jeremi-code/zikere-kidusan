import { ref } from 'vue'
import type { SynaxariumEntry } from './types'
import { getTodayEthiopian, ETHIOPIAN_MONTHS } from './ethiopianCalendar'
import { synaxariumData } from './synaxariumData'

const NOTIFICATION_KEY = 'synaxarium_notifications_enabled'
const NOTIFICATION_TIME_KEY = 'synaxarium_notification_time'
const LAST_NOTIFIED_DATE_KEY = 'synaxarium_last_notified_date'
export const DEFAULT_NOTIFICATION_TIME = '06:00'

export const isNotificationsEnabled = ref<boolean>(
  typeof window !== 'undefined' && localStorage.getItem(NOTIFICATION_KEY) === 'true'
)

export const notificationTime = ref<string>(
  (typeof window !== 'undefined' && localStorage.getItem(NOTIFICATION_TIME_KEY)) || DEFAULT_NOTIFICATION_TIME
)

export function setNotificationTime(time: string, lang: 'am' | 'en' = 'am'): void {
  notificationTime.value = time
  if (typeof window !== 'undefined') {
    localStorage.setItem(NOTIFICATION_TIME_KEY, time)
    localStorage.removeItem(LAST_NOTIFIED_DATE_KEY)
  }
  if (isNotificationsEnabled.value) {
    scheduleDailyNotification(lang)
  }
}

export function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  const parts = timeStr.split(':')
  const hours = Math.max(0, Math.min(23, parseInt(parts[0] || '6', 10)))
  const minutes = Math.max(0, Math.min(59, parseInt(parts[1] || '0', 10)))
  return { hours, minutes }
}

export function formatTimeToEthiopian(timeStr: string, isEn: boolean = false): string {
  const { hours, minutes } = parseTimeString(timeStr)
  const minStr = minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ':00'
  
  let ethHour = (hours + 6) % 12
  if (ethHour === 0) ethHour = 12

  const periodEn = hours >= 12 ? 'PM' : 'AM'
  const displayH = hours % 12 === 0 ? 12 : hours % 12

  if (isEn) {
    return `${displayH}${minStr} ${periodEn} · Eth ${ethHour}${minStr}`
  }

  let periodAm = 'ጧት'
  if (hours >= 23 || hours < 5) {
    periodAm = 'ሌሊት'
  } else if (hours >= 5 && hours < 7) {
    periodAm = 'ጠዋት'
  } else if (hours >= 7 && hours < 12) {
    periodAm = 'ጧት'
  } else if (hours >= 12 && hours < 13) {
    periodAm = 'ቀትር'
  } else if (hours >= 13 && hours < 18) {
    periodAm = 'ከሰዓት'
  } else {
    periodAm = 'ምሽት'
  }

  return `${periodAm} ${ethHour}${minStr} (${displayH}${minStr} ${periodEn})`
}

export function getNextScheduledNotificationDescription(lang: 'am' | 'en' = 'am'): string {
  const { hours, minutes } = parseTimeString(notificationTime.value)
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0)
  
  const todayEth = getTodayEthiopian()
  const scheduleKey = `${todayEth.year}-${todayEth.month}-${todayEth.day}@${notificationTime.value}`
  const lastNotified = typeof window !== 'undefined' ? localStorage.getItem(LAST_NOTIFIED_DATE_KEY) : null
  
  const isPast = now.getTime() >= target.getTime() && (now.getHours() !== hours || now.getMinutes() !== minutes)
  const isToday = !isPast && lastNotified !== scheduleKey
  const dayLabel = isToday ? (lang === 'en' ? 'Today' : 'ዛሬ') : (lang === 'en' ? 'Tomorrow' : 'ነገ')
  
  const timeLabel = formatTimeToEthiopian(notificationTime.value, lang === 'en')
  return `${dayLabel} · ${timeLabel}`
}

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

export function getMillisecondsUntilNextTime(timeStr: string = notificationTime.value): number {
  const { hours, minutes } = parseTimeString(timeStr)
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0)

  const todayEth = getTodayEthiopian()
  const scheduleKey = `${todayEth.year}-${todayEth.month}-${todayEth.day}@${timeStr}`
  const lastNotified = typeof window !== 'undefined' ? localStorage.getItem(LAST_NOTIFIED_DATE_KEY) : null

  if (now.getHours() === hours && now.getMinutes() === minutes && lastNotified !== scheduleKey) {
    return 1000
  }

  const isPastMinute = now.getHours() > hours || (now.getHours() === hours && now.getMinutes() > minutes)
  if (isPastMinute || (now.getTime() >= target.getTime() && lastNotified === scheduleKey)) {
    target.setDate(target.getDate() + 1)
  }

  return Math.max(1000, target.getTime() - now.getTime())
}

export function isPastConfiguredTimeToday(timeStr: string = notificationTime.value): boolean {
  const { hours, minutes } = parseTimeString(timeStr)
  const now = new Date()
  if (now.getHours() > hours) return true
  if (now.getHours() === hours && now.getMinutes() >= minutes) return true
  return false
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
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration?.active && 'showNotification' in registration) {
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

export async function checkAndTriggerDailyNotification(
  lang: 'am' | 'en' = 'am'
): Promise<boolean> {
  if (!isNotificationsEnabled.value) return false
  if (getNotificationPermission() !== 'granted') return false
  if (!isPastConfiguredTimeToday()) return false

  const todayEth = getTodayEthiopian()
  const scheduleKey = `${todayEth.year}-${todayEth.month}-${todayEth.day}@${notificationTime.value}`
  const lastNotified = typeof window !== 'undefined' ? localStorage.getItem(LAST_NOTIFIED_DATE_KEY) : null

  if (lastNotified === scheduleKey) {
    return false
  }

  const todayEntry = synaxariumData.find(
    (e) => e.month === todayEth.month && e.day === todayEth.day
  ) || synaxariumData[0]

  const sent = await sendSynaxariumNotification(todayEntry, lang)
  if (sent && typeof window !== 'undefined') {
    localStorage.setItem(LAST_NOTIFIED_DATE_KEY, scheduleKey)
  }
  return sent
}

export function scheduleDailyNotification(lang: 'am' | 'en' = 'am'): void {
  if (scheduledTimerId) {
    clearTimeout(scheduledTimerId)
    scheduledTimerId = null
  }

  if (!isNotificationsEnabled.value || getNotificationPermission() !== 'granted') {
    return
  }

  checkAndTriggerDailyNotification(lang)

  const msUntilTarget = getMillisecondsUntilNextTime()
  scheduledTimerId = setTimeout(async () => {
    await checkAndTriggerDailyNotification(lang)
    scheduleDailyNotification(lang)
  }, msUntilTarget)

  attachLifecycleListeners(lang)
  registerPeriodicSync()
}

export function cancelDailyNotification(): void {
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
      checkAndTriggerDailyNotification(lang)
      scheduleDailyNotification(lang)
    }
  })

  heartbeatIntervalId = setInterval(() => {
    checkAndTriggerDailyNotification(lang)
  }, 30 * 60 * 1000)
}

export const checkAndTrigger6AMNotification = checkAndTriggerDailyNotification
export const scheduleDaily6AMNotification = scheduleDailyNotification
export const cancelDaily6AMNotification = cancelDailyNotification
export const getMillisecondsUntilNext6AM = getMillisecondsUntilNextTime
export const isPast6AMToday = isPastConfiguredTimeToday

export async function registerPeriodicSync(): Promise<void> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration?.active && 'periodicSync' in registration) {
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

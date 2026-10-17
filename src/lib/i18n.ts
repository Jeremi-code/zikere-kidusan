import { watch } from 'vue'
import { currentLanguage } from './preferences'
import { ETHIOPIAN_MONTHS, numberToGeez } from './ethiopianCalendar'
import am from '../locales/am'
import en from '../locales/en'

// A message is either a plain template or a one/other pair picked by params.n.
export type Message = string | { one: string; other: string }
export type MessageKey = keyof typeof am
type Params = Record<string, string | number>

const catalogs: Record<'am' | 'en', Record<MessageKey, Message>> = { am, en }

// The splash shows the name in both scripts regardless of language.
export const BRAND = { am: am['app.name'], en: en['app.name'] }

// Reads currentLanguage, so any template calling t() re-renders on language change.
export function t(key: MessageKey, params?: Params): string {
  let msg = catalogs[currentLanguage.value][key] ?? am[key]
  if (typeof msg !== 'string') {
    msg = Number(params?.n) === 1 ? msg.one : msg.other
  }
  return msg.replace(/\{(\w+)\}/g, (_, k: string) => String(params?.[k] ?? `{${k}}`))
}

export function isEnglish(): boolean {
  return currentLanguage.value === 'en'
}

// Picks the English variant of bilingual content when available, else the Amharic one.
export function pick<T>(amValue: T, enValue: T | undefined | null): T {
  return isEnglish() && enValue ? enValue : amValue
}

// Ge'ez numerals in Amharic, Arabic numerals in English.
export function formatNumber(n: number): string {
  return isEnglish() ? String(n) : numberToGeez(n)
}

export function monthName(month: number): string {
  const m = ETHIOPIAN_MONTHS[month - 1]
  return m ? pick(m.nameAm, m.nameEn) : ''
}

export function formatGregorian(date: Date): string {
  const locale = isEnglish() ? 'en-GB' : 'am-ET'
  return date.toLocaleDateString(locale, { weekday: 'long', timeZone: 'UTC' }) + ' · ' +
    date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

watch(currentLanguage, (lang) => {
  document.documentElement.lang = lang
}, { immediate: true })

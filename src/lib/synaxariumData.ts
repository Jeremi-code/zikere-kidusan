import type { SynaxariumEntry } from './types'
import rawData from '../data/synaxariumData.json'

interface RawSynaxariumItem {
  id: string
  month: number
  day: number
  date?: {
    en?: string
    am?: string
  }
  title: {
    en?: string
    am?: string
  }
  subtitle?: {
    en?: string
    am?: string
  }
  annual_feasts?: {
    en?: string[]
    am?: string[]
  }
  monthly_feasts?: {
    en?: string[]
    am?: string[]
  }
  story: {
    en?: string[] | string
    am?: string[] | string
  }
  scripture?: {
    en?: {
      reference: string
      verse: string
    }
    am?: {
      reference: string
      verse: string
    }
  }
}

function normalizeStory(val?: string[] | string): string {
  if (!val) return ''
  if (Array.isArray(val)) {
    return val.filter(Boolean).join('\n\n')
  }
  return String(val)
}

export const synaxariumData: SynaxariumEntry[] = (rawData as RawSynaxariumItem[]).map((item) => {
  return {
    id: item.id,
    month: item.month,
    day: item.day,
    title: item.title?.am || item.title?.en || '',
    titleEn: item.title?.en,
    subtitle: item.subtitle?.am,
    subtitleEn: item.subtitle?.en,
    annualFeasts: item.annual_feasts?.am || [],
    annualFeastsEn: item.annual_feasts?.en || [],
    monthlyFeasts: item.monthly_feasts?.am || [],
    monthlyFeastsEn: item.monthly_feasts?.en || [],
    story: normalizeStory(item.story?.am),
    storyEn: normalizeStory(item.story?.en),
    scripture: item.scripture?.am,
    scriptureEn: item.scripture?.en
  }
})

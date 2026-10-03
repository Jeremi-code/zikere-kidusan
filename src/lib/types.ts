export interface SynaxariumEntry {
  id: string
  month: number
  day: number
  monthName?: string
  monthNameEn?: string
  title: string
  titleEn?: string
  subtitle?: string
  subtitleEn?: string
  annualFeasts: string[]
  annualFeastsEn?: string[]
  monthlyFeasts: string[]
  monthlyFeastsEn?: string[]
  hymn?: {
    title: string
    titleEn?: string
    geezText: string
    meaning?: string
    meaningEn?: string
  }
  story: string
  storyEn?: string
  scripture?: {
    verse: string
    reference: string
  }
  scriptureEn?: {
    verse: string
    reference: string
  }
  source?: string
  tags?: string[]
}

export type SupportedLanguage = 'am' | 'en'

export interface ReadingPreferences {
  fontSize: 'sm' | 'base' | 'lg' | 'xl'
  theme: 'light' | 'sepia' | 'dark'
  language: SupportedLanguage
}

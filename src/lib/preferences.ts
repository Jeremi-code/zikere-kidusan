import { ref, watch } from 'vue'
import type { SupportedLanguage } from './types'

export type AppTheme = 'light' | 'sepia' | 'dark'
export type FontSize = 'sm' | 'base' | 'lg' | 'xl'

export interface BookmarkItem {
  id: string
  month: number
  day: number
  title: string
  titleEn?: string
  dateLabel: string
  savedAt: number
}

const THEME_KEY = 'synaxarium_theme'
const FONT_SIZE_KEY = 'synaxarium_font_size'
const LANG_KEY = 'synaxarium_language'
const BOOKMARKS_KEY = 'synaxarium_bookmarks'

function getInitialTheme(): AppTheme {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'sepia' || saved === 'dark') {
    return saved
  }
  return 'light'
}

function getInitialFontSize(): FontSize {
  const saved = localStorage.getItem(FONT_SIZE_KEY)
  if (saved === 'sm' || saved === 'base' || saved === 'lg' || saved === 'xl') {
    return saved
  }
  return 'base'
}

function getInitialLanguage(): SupportedLanguage {
  const saved = localStorage.getItem(LANG_KEY)
  if (saved === 'am' || saved === 'en') {
    return saved
  }
  return 'am'
}

function getInitialBookmarks(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const currentTheme = ref<AppTheme>(getInitialTheme())
export const currentFontSize = ref<FontSize>(getInitialFontSize())
export const currentLanguage = ref<SupportedLanguage>(getInitialLanguage())
export const bookmarks = ref<BookmarkItem[]>(getInitialBookmarks())

watch(currentTheme, (val) => {
  localStorage.setItem(THEME_KEY, val)
  applyThemeToDocument(val)
}, { immediate: true })

watch(currentFontSize, (val) => {
  localStorage.setItem(FONT_SIZE_KEY, val)
})

watch(currentLanguage, (val) => {
  localStorage.setItem(LANG_KEY, val)
})

watch(bookmarks, (val) => {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(val))
}, { deep: true })

export function applyThemeToDocument(theme: AppTheme) {
  const root = document.documentElement
  root.classList.remove('theme-light', 'theme-sepia', 'theme-dark', 'dark')
  root.classList.add(`theme-${theme}`)
  root.dataset.theme = theme === 'dark' ? 'dark' : 'light'
  if (theme === 'dark') {
    root.classList.add('dark')
  }
}

export function isBookmarked(month: number, day: number): boolean {
  return bookmarks.value.some((b) => b.month === month && b.day === day)
}

export function toggleBookmarkItem(item: Omit<BookmarkItem, 'savedAt'>) {
  const idx = bookmarks.value.findIndex((b) => b.month === item.month && b.day === item.day)
  if (idx >= 0) {
    bookmarks.value.splice(idx, 1)
  } else {
    bookmarks.value.unshift({
      ...item,
      savedAt: Date.now()
    })
  }
}

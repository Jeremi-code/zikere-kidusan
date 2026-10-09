<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  getTodayEthiopian, 
  ETHIOPIAN_MONTHS, 
  numberToGeez, 
  ethiopianToJDN, 
  getWeekdayFromJDN, 
  type EthiopianDate 
} from './lib/ethiopianCalendar'
import { synaxariumData } from './data/synaxariumData'
import type { SynaxariumEntry } from './lib/types'
import { 
  currentTheme, 
  currentLanguage, 
  applyThemeToDocument, 
  isBookmarked, 
  toggleBookmarkItem 
} from './lib/preferences'
import CalendarHeader from './components/CalendarHeader.vue'
import WeekCalendarStrip from './components/WeekCalendarStrip.vue'
import DailyReadingCard from './components/DailyReadingCard.vue'
import FloatingBottomDock from './components/FloatingBottomDock.vue'
import EthiopianDatePicker from './components/EthiopianDatePicker.vue'
import SearchModal from './components/SearchModal.vue'
import BookmarksDrawer from './components/BookmarksDrawer.vue'
import SettingsModal from './components/SettingsModal.vue'
import EthiopianCross from './components/EthiopianCross.vue'
import HaragDivider from './components/HaragDivider.vue'

const allReadings = synaxariumData as SynaxariumEntry[]
const currentDate = ref<EthiopianDate>(getTodayEthiopian())
const isCopied = ref(false)

const isDatePickerOpen = ref(false)
const isSearchOpen = ref(false)
const isBookmarksOpen = ref(false)
const isSettingsOpen = ref(false)

onMounted(() => {
  applyThemeToDocument(currentTheme.value)
})

function handleSelectDate({ year, month, day }: { year?: number; month: number; day: number }) {
  const targetYear = year ?? currentDate.value.year
  const monthInfo = ETHIOPIAN_MONTHS[month - 1]
  const jdn = ethiopianToJDN(targetYear, month, day)
  const weekday = getWeekdayFromJDN(jdn)

  currentDate.value = {
    year: targetYear,
    month,
    day,
    monthName: monthInfo.nameAm,
    monthNameEn: monthInfo.nameEn,
    geezDay: numberToGeez(day),
    geezYear: numberToGeez(targetYear),
    formatted: `${monthInfo.nameAm} ${numberToGeez(day)} (${day}) ቀን ${targetYear} ዓ.ም`,
    weekdayNameAm: weekday.nameAm,
    weekdayNameEn: weekday.nameEn,
    weekdayShortAm: weekday.shortAm,
    weekdayShortEn: weekday.shortEn
  }
}

function jumpToToday() {
  currentDate.value = getTodayEthiopian()
}

const currentReading = computed(() => {
  return allReadings.find(
    (e) => e.month === currentDate.value.month && e.day === currentDate.value.day
  )
})

const readingIsBookmarked = computed(() => {
  if (!currentReading.value) return false
  return isBookmarked(currentReading.value.month, currentReading.value.day)
})

function handleToggleBookmark() {
  if (!currentReading.value) return
  toggleBookmarkItem({
    id: currentReading.value.id,
    month: currentReading.value.month,
    day: currentReading.value.day,
    title: currentReading.value.title,
    titleEn: currentReading.value.titleEn,
    dateLabel: currentDate.value.formatted
  })
}

async function handleShareReading() {
  if (!currentReading.value) return

  const isAmharic = currentLanguage.value === 'am'
  const title = isAmharic ? currentReading.value.title : currentReading.value.titleEn
  const story = isAmharic ? currentReading.value.story : (currentReading.value.storyEn || currentReading.value.story)

  const shareText = `❖ ${title}\n📅 ${currentDate.value.formatted}\n\n${story}`

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text: shareText
      })
      return
    } catch (err: any) {
      if (err.name === 'AbortError') return
    }
  }

  try {
    await navigator.clipboard.writeText(shareText)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error(err)
  }
}

function handleToggleLanguage() {
  currentLanguage.value = currentLanguage.value === 'am' ? 'en' : 'am'
}
</script>

<template>
  <div class="min-h-screen flex flex-col font-ethiopic-serif transition-colors duration-200 pb-24 sm:pb-28">
    <CalendarHeader 
      :current-date="currentDate" 
      @open-date-picker="isDatePickerOpen = true"
      @open-search="isSearchOpen = true"
      @open-bookmarks="isBookmarksOpen = true"
      @open-settings="isSettingsOpen = true"
    />

    <main class="flex-1 max-w-2xl w-full mx-auto px-3.5 sm:px-4 py-4 space-y-4 sm:space-y-5">
      <WeekCalendarStrip
        :current-date="currentDate"
        @select-date="handleSelectDate"
        @open-full-picker="isDatePickerOpen = true"
        @jump-today="jumpToToday"
      />

      <DailyReadingCard 
        :entry="currentReading" 
        :date-label="currentDate.formatted"
      />
    </main>

    <footer class="mt-8 py-8 px-4 text-center text-xs text-stone-700 dark:text-stone-300 border-t border-amber-900/15 dark:border-amber-800/30 bg-amber-50/40 dark:bg-black/40">
      <div class="flex items-center justify-center gap-2 mb-2 text-amber-900 dark:text-amber-300 opacity-95">
        <EthiopianCross variant="lalibela" :size="18" />
        <span class="font-bold tracking-wider font-ethiopic-serif">ዝክረ ቅዱሳን ዘኦርቶዶክስ ተዋሕዶ</span>
        <EthiopianCross variant="lalibela" :size="18" />
      </div>
      <HaragDivider variant="compact" />
      <p class="mt-2 text-stone-700 dark:text-stone-300 font-ethiopic-serif text-[11px] font-medium">
        ስብሐት ለእግዚአብሔር ወለወላዲቱ ድንግል ማርያም ወለመስቀሉ ክቡር
      </p>
    </footer>

    <FloatingBottomDock
      :is-bookmarked="readingIsBookmarked"
      :current-language="currentLanguage"
      :is-copied="isCopied"
      @toggle-bookmark="handleToggleBookmark"
      @toggle-language="handleToggleLanguage"
      @share="handleShareReading"
      @open-settings="isSettingsOpen = true"
      @open-search="isSearchOpen = true"
      @jump-today="jumpToToday"
    />

    <EthiopianDatePicker
      :is-open="isDatePickerOpen"
      :current-date="currentDate"
      @close="isDatePickerOpen = false"
      @select="handleSelectDate"
    />

    <SearchModal
      :is-open="isSearchOpen"
      :all-readings="allReadings"
      @close="isSearchOpen = false"
      @select="handleSelectDate"
    />

    <BookmarksDrawer
      :is-open="isBookmarksOpen"
      @close="isBookmarksOpen = false"
      @select="handleSelectDate"
    />

    <SettingsModal
      :is-open="isSettingsOpen"
      @close="isSettingsOpen = false"
    />
  </div>
</template>

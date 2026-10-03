<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTodayEthiopian, ETHIOPIAN_MONTHS, numberToGeez, type EthiopianDate } from './lib/ethiopianCalendar'
import { synaxariumData } from './data/synaxariumData'
import type { SynaxariumEntry } from './lib/types'
import { currentTheme, applyThemeToDocument } from './lib/preferences'
import CalendarHeader from './components/CalendarHeader.vue'
import DailyReadingCard from './components/DailyReadingCard.vue'
import EthiopianDatePicker from './components/EthiopianDatePicker.vue'
import SearchModal from './components/SearchModal.vue'
import BookmarksDrawer from './components/BookmarksDrawer.vue'
import SettingsModal from './components/SettingsModal.vue'

const allReadings = synaxariumData as SynaxariumEntry[]
const currentDate = ref<EthiopianDate>(getTodayEthiopian())

const isDatePickerOpen = ref(false)
const isSearchOpen = ref(false)
const isBookmarksOpen = ref(false)
const isSettingsOpen = ref(false)

onMounted(() => {
  applyThemeToDocument(currentTheme.value)
})

function handleSelectDate({ month, day }: { month: number; day: number }) {
  const monthInfo = ETHIOPIAN_MONTHS[month - 1]
  currentDate.value = {
    ...currentDate.value,
    month,
    day,
    monthName: monthInfo.nameAm,
    monthNameEn: monthInfo.nameEn,
    geezDay: numberToGeez(day),
    formatted: `${monthInfo.nameAm} ${numberToGeez(day)} (${day}) ቀን ${currentDate.value.year} ዓ.ም`
  }
}

const currentReading = computed(() => {
  return allReadings.find(
    (e) => e.month === currentDate.value.month && e.day === currentDate.value.day
  )
})
</script>

<template>
  <div class="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans transition-colors duration-150">
    <CalendarHeader 
      :current-date="currentDate" 
      @select-date="handleSelectDate"
      @open-date-picker="isDatePickerOpen = true"
      @open-search="isSearchOpen = true"
      @open-bookmarks="isBookmarksOpen = true"
      @open-settings="isSettingsOpen = true"
    />

    <main class="flex-1 max-w-2xl w-full mx-auto p-4 space-y-4">
      <DailyReadingCard 
        :entry="currentReading" 
        :date-label="currentDate.formatted"
      />
    </main>

    <footer class="py-5 text-center text-xs text-stone-500 border-t border-stone-200">
      <p>መጽሐፈ ስንክሳር — ዝክረ ቅዱሳን ዘኦርቶዶክስ ተዋሕዶ</p>
      <p class="mt-1 text-stone-400">ከዝክረ ቅዱሳን ማኅበረ ቅዱስ ዳዊት (@zikirekdusn) የተወሰደ</p>
    </footer>

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

<script setup lang="ts">
import { ETHIOPIAN_MONTHS, type EthiopianDate } from '../lib/ethiopianCalendar'
import { bookmarks } from '../lib/preferences'
import { Calendar, ChevronLeft, ChevronRight, Search, Settings, Bookmark } from 'lucide-vue-next'

const props = defineProps<{
  currentDate: EthiopianDate
}>()

const emit = defineEmits<{
  (e: 'select-date', date: { month: number; day: number }): void
  (e: 'open-date-picker'): void
  (e: 'open-search'): void
  (e: 'open-bookmarks'): void
  (e: 'open-settings'): void
}>()

function nextDay() {
  let newDay = props.currentDate.day + 1
  let newMonth = props.currentDate.month

  const maxDays = ETHIOPIAN_MONTHS[newMonth - 1].totalDays(props.currentDate.year)
  if (newDay > maxDays) {
    newDay = 1
    newMonth = (newMonth % 13) + 1
  }
  emit('select-date', { month: newMonth, day: newDay })
}

function prevDay() {
  let newDay = props.currentDate.day - 1
  let newMonth = props.currentDate.month

  if (newDay < 1) {
    newMonth = newMonth === 1 ? 13 : newMonth - 1
    newDay = ETHIOPIAN_MONTHS[newMonth - 1].totalDays(props.currentDate.year)
  }
  emit('select-date', { month: newMonth, day: newDay })
}
</script>

<template>
  <header class="bg-amber-900 text-amber-50 shadow-md">
    <div class="max-w-2xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
      <div class="flex items-center gap-2.5 sm:gap-3">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-800 flex items-center justify-center border border-amber-700/80 shadow-xs">
          <Calendar class="w-5 h-5 text-amber-200" />
        </div>
        <div>
          <h1 class="text-lg sm:text-xl font-bold tracking-wide">መጽሐፈ ስንክሳር</h1>
          <p class="text-[11px] text-amber-200/80">ዝክረ ቅዱሳን ዘኦርቶዶክስ ተዋሕዶ</p>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <button
          @click="emit('open-search')"
          class="p-2 rounded-xl text-amber-200 hover:bg-amber-800 transition-colors"
          title="ፈልግ (Search)"
        >
          <Search class="w-5 h-5" />
        </button>

        <button
          @click="emit('open-bookmarks')"
          class="p-2 rounded-xl text-amber-200 hover:bg-amber-800 transition-colors relative"
          title="የተቀመጡ (Bookmarks)"
        >
          <Bookmark class="w-5 h-5" />
          <span 
            v-if="bookmarks.length" 
            class="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-300"
          />
        </button>

        <button
          @click="emit('open-settings')"
          class="p-2 rounded-xl text-amber-200 hover:bg-amber-800 transition-colors"
          title="ማስተካከያ (Settings)"
        >
          <Settings class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="bg-amber-950/60 border-t border-amber-800/50 px-4 py-2.5 sm:py-3">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <button 
          @click="prevDay"
          class="p-2 rounded-lg hover:bg-amber-800/60 active:scale-95 transition-all text-amber-200"
          title="ቀዳሚ ቀን"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>

        <button
          @click="emit('open-date-picker')"
          class="text-center px-3 py-1 rounded-xl hover:bg-amber-800/40 transition-colors cursor-pointer group"
          title="ቀን ይምረጡ (Select Date)"
        >
          <div class="text-xl sm:text-2xl font-bold text-amber-100 flex items-center justify-center gap-2 group-hover:text-amber-200">
            <span>{{ currentDate.monthName }}</span>
            <span class="text-amber-300 font-serif">{{ currentDate.geezDay }}</span>
            <span class="text-xs sm:text-sm font-normal text-amber-300/70">({{ currentDate.day }})</span>
          </div>
          <div class="text-[11px] text-amber-300/70 mt-0.5 flex items-center justify-center gap-1.5">
            <span>{{ currentDate.monthNameEn }} {{ currentDate.day }}</span>
            <span>•</span>
            <span>{{ currentDate.year }} ዓ.ም</span>
          </div>
        </button>

        <button 
          @click="nextDay"
          class="p-2 rounded-lg hover:bg-amber-800/60 active:scale-95 transition-all text-amber-200"
          title="የሚቀጥለው ቀን"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
</template>

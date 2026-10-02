<script setup lang="ts">
import { ETHIOPIAN_MONTHS, type EthiopianDate } from '../lib/ethiopianCalendar'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  currentDate: EthiopianDate
}>()

const emit = defineEmits<{
  (e: 'select-date', date: { month: number; day: number }): void
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
    <!-- Top Bar -->
    <div class="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-amber-800 flex items-center justify-center border border-amber-700">
          <Calendar class="w-5 h-5 text-amber-200" />
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-wide">መጽሐፈ ስንክሳር</h1>
          <p class="text-xs text-amber-200/80">ዝክረ ቅዱሳን ዘኦርቶዶክስ ተዋሕዶ</p>
        </div>
      </div>

      <!-- Year Badge -->
      <div class="text-right">
        <span class="inline-block px-2.5 py-1 bg-amber-800/80 rounded-md text-xs font-semibold text-amber-200 border border-amber-700/60">
          {{ currentDate.year }} ዓ.ም ({{ currentDate.geezYear }})
        </span>
      </div>
    </div>

    <!-- Date Navigation Bar -->
    <div class="bg-amber-950/60 border-t border-amber-800/50 px-4 py-3">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <button 
          @click="prevDay"
          class="p-2 rounded-lg hover:bg-amber-800/60 active:scale-95 transition-all text-amber-200"
          title="ቀዳሚ ቀን"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>

        <div class="text-center">
          <div class="text-2xl font-bold text-amber-100 flex items-center justify-center gap-2">
            <span>{{ currentDate.monthName }}</span>
            <span class="text-amber-300 font-serif">{{ currentDate.geezDay }}</span>
            <span class="text-sm font-normal text-amber-300/70">({{ currentDate.day }})</span>
          </div>
          <div class="text-xs text-amber-300/70 mt-0.5">
            {{ currentDate.monthNameEn }} {{ currentDate.day }}
          </div>
        </div>

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

<script setup lang="ts">
import { computed } from 'vue'
import { getSurroundingDays, type EthiopianDate } from '../lib/ethiopianCalendar'
import { ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-vue-next'

const props = defineProps<{
  currentDate: EthiopianDate
}>()

const emit = defineEmits<{
  (e: 'select-date', date: { year: number; month: number; day: number }): void
  (e: 'open-full-picker'): void
  (e: 'jump-today'): void
}>()

const days = computed(() => {
  return getSurroundingDays(props.currentDate.year, props.currentDate.month, props.currentDate.day, 3)
})

const isViewingToday = computed(() => {
  const activeChip = days.value.find((d) => d.isSelected)
  return activeChip?.isToday ?? false
})

function prevDay() {
  const prev = days.value[2]
  if (prev) {
    emit('select-date', { year: prev.year, month: prev.month, day: prev.day })
  }
}

function nextDay() {
  const next = days.value[4]
  if (next) {
    emit('select-date', { year: next.year, month: next.month, day: next.day })
  }
}
</script>

<template>
  <div class="w-full reading-folio rounded-3xl p-3 sm:p-4 border-2 shadow-xs manuscript-card">
    <div class="flex items-center justify-between mb-2.5 px-1">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 font-ethiopic-serif flex items-center gap-1.5">
          <span>{{ currentDate.monthName }}</span>
          <span class="opacity-40">•</span>
          <span>{{ currentDate.year }} ዓ.ም</span>
        </span>
      </div>

      <div class="flex items-center gap-1.5">
        <button
          v-if="!isViewingToday"
          @click="emit('jump-today')"
          class="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-xl hero-pill-badge border transition-colors cursor-pointer font-ethiopic-serif shadow-2xs"
        >
          <Sparkles class="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>ዛሬ (Today)</span>
        </button>

        <button
          @click="emit('open-full-picker')"
          class="p-1.5 rounded-xl hover:bg-amber-100/60 dark:hover:bg-stone-800 text-amber-900 dark:text-amber-300 transition-colors cursor-pointer"
          title="የቀን መቁጠሪያ (Full Calendar)"
        >
          <Calendar class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between gap-1 sm:gap-2">
      <button
        @click="prevDay"
        class="p-1 sm:p-1.5 rounded-xl text-stone-400 hover:text-amber-900 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
        title="ቀዳሚ ቀን"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <div class="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
        <button
          v-for="d in days"
          :key="`${d.year}-${d.month}-${d.day}`"
          @click="emit('select-date', { year: d.year, month: d.month, day: d.day })"
          class="py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative group"
          :class="d.isSelected
            ? 'bg-amber-800 dark:bg-amber-900 text-amber-50 shadow-md ring-2 ring-amber-400/80 scale-102 font-bold'
            : d.isToday
              ? 'bg-amber-100/70 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 border border-amber-300/80 dark:border-amber-700/50'
              : 'hover:bg-amber-100/30 dark:hover:bg-stone-800/60 text-stone-700 dark:text-stone-300'"
        >
          <span class="text-[10px] sm:text-xs font-semibold uppercase tracking-tight font-ethiopic-serif opacity-80">
            {{ d.dayShortAm }}
          </span>

          <span class="text-base sm:text-lg font-bold font-ethiopic-serif my-0.5 leading-none" :class="d.isSelected ? 'text-amber-200 drop-shadow-xs' : 'text-stone-900 dark:text-stone-100'">
            {{ d.geezDay }}
          </span>

          <span class="text-[9px] sm:text-[10px] font-latin-display opacity-70 leading-none">
            {{ d.day }}
          </span>

          <span
            v-if="d.isToday && !d.isSelected"
            class="absolute bottom-1 w-1 h-1 rounded-full bg-amber-600 dark:bg-amber-400"
          ></span>
        </button>
      </div>

      <button
        @click="nextDay"
        class="p-1 sm:p-1.5 rounded-xl text-stone-400 hover:text-amber-900 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
        title="የሚቀጥለው ቀን"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

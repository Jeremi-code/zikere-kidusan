<script setup lang="ts">
import { ref, computed } from 'vue'
import { ETHIOPIAN_MONTHS, numberToGeez, type EthiopianDate, getTodayEthiopian } from '../lib/ethiopianCalendar'
import { X, RotateCcw } from 'lucide-vue-next'
import EthiopianCross from './EthiopianCross.vue'

const props = defineProps<{
  isOpen: boolean
  currentDate: EthiopianDate
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', date: { month: number; day: number }): void
}>()

const selectedMonth = ref(props.currentDate.month)

const currentMonthInfo = computed(() => {
  return ETHIOPIAN_MONTHS[selectedMonth.value - 1]
})

const daysInSelectedMonth = computed(() => {
  return currentMonthInfo.value.totalDays(props.currentDate.year)
})

function pickDay(day: number) {
  emit('select', { month: selectedMonth.value, day })
  emit('close')
}

function jumpToToday() {
  const today = getTodayEthiopian()
  emit('select', { month: today.month, day: today.day })
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
    <div 
      class="reading-folio rounded-3xl shadow-2xl border-2 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] manuscript-card"
      @click.stop
    >
      <div class="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-50 px-5 py-3.5 flex items-center justify-between border-b border-amber-700/50">
        <div class="flex items-center gap-2">
          <EthiopianCross variant="lalibela" :size="20" class="text-amber-300" />
          <h2 class="text-base sm:text-lg font-bold font-ethiopic-serif text-amber-100">ቀን ይምረጡ (Select Date)</h2>
        </div>
        <button 
          @click="emit('close')"
          class="p-1.5 rounded-xl hover:bg-amber-800/80 text-amber-200 transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-4 sm:p-5 overflow-y-auto space-y-5">
        <div>
          <label class="block text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider mb-2 font-ethiopic-serif">
            ወራት (Months)
          </label>
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-1.5 font-ethiopic-serif">
            <button
              v-for="m in ETHIOPIAN_MONTHS"
              :key="m.id"
              @click="selectedMonth = m.id"
              class="px-2 py-2 text-xs font-semibold rounded-2xl border transition-all text-center flex flex-col items-center justify-center cursor-pointer"
              :class="selectedMonth === m.id 
                ? 'bg-amber-900 text-amber-100 border-amber-700 shadow-xs ring-2 ring-amber-500/50' 
                : 'bg-amber-100/30 text-stone-800 border-amber-300/40 hover:bg-amber-100/70 dark:bg-stone-900/60 dark:text-stone-200 dark:border-stone-800'"
            >
              <span>{{ m.nameAm }}</span>
              <span class="text-[10px] opacity-75 font-normal font-latin-display">{{ m.nameEn }}</span>
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider font-ethiopic-serif">
              ቀናት (Days in {{ currentMonthInfo.nameAm }})
            </label>
            <span class="text-xs text-stone-500 font-latin-display">
              {{ currentMonthInfo.nameEn }} (1 - {{ daysInSelectedMonth }})
            </span>
          </div>

          <div class="grid grid-cols-5 sm:grid-cols-6 gap-1.5 font-ethiopic-serif">
            <button
              v-for="d in daysInSelectedMonth"
              :key="d"
              @click="pickDay(d)"
              class="py-2.5 px-1 rounded-2xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer"
              :class="currentDate.month === selectedMonth && currentDate.day === d
                ? 'bg-amber-900 text-amber-100 border-amber-700 shadow-sm font-bold ring-2 ring-amber-400' 
                : 'bg-amber-100/30 text-stone-800 border-amber-300/40 hover:bg-amber-100/60 active:scale-95 dark:bg-stone-900/50 dark:text-stone-200 dark:border-stone-800'"
            >
              <span class="text-base font-bold" :class="currentDate.month === selectedMonth && currentDate.day === d ? 'text-amber-200' : 'text-amber-950 dark:text-amber-300'">
                {{ numberToGeez(d) }}
              </span>
              <span class="text-[10px] opacity-70 font-latin-display">
                {{ d }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div class="px-5 py-3 reading-folio border-t border-amber-900/10 dark:border-amber-800/20 flex items-center justify-between">
        <button
          @click="jumpToToday"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-950 dark:text-amber-200 bg-amber-100 dark:bg-amber-950 hover:bg-amber-200 transition-colors border border-amber-300/80 dark:border-amber-700 cursor-pointer font-ethiopic-serif"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>የዛሬ ቀን (Today)</span>
        </button>

        <button
          @click="emit('close')"
          class="px-4 py-1.5 rounded-xl text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-amber-100/70 dark:hover:bg-amber-950/60 transition-colors cursor-pointer font-ethiopic-serif"
        >
          ዝጋ (Close)
        </button>
      </div>
    </div>
  </div>
</template>

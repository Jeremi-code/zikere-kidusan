<script setup lang="ts">
import { ref, computed } from 'vue'
import { ETHIOPIAN_MONTHS, numberToGeez, type EthiopianDate, getTodayEthiopian } from '../lib/ethiopianCalendar'
import { X, Calendar, RotateCcw } from 'lucide-vue-next'

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
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
    <div 
      class="bg-white rounded-2xl shadow-2xl border border-amber-200/90 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      @click.stop
    >
      <div class="bg-amber-900 text-amber-50 px-5 py-4 flex items-center justify-between border-b border-amber-800">
        <div class="flex items-center gap-2">
          <Calendar class="w-5 h-5 text-amber-200" />
          <h2 class="text-lg font-bold">ቀን ይምረጡ (Select Date)</h2>
        </div>
        <button 
          @click="emit('close')"
          class="p-1.5 rounded-lg hover:bg-amber-800 text-amber-200 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-4 sm:p-5 overflow-y-auto space-y-5">
        <div>
          <label class="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
            ወራት (Months)
          </label>
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
            <button
              v-for="m in ETHIOPIAN_MONTHS"
              :key="m.id"
              @click="selectedMonth = m.id"
              class="px-2 py-2 text-xs font-semibold rounded-xl border transition-all text-center flex flex-col items-center justify-center"
              :class="selectedMonth === m.id 
                ? 'bg-amber-800 text-white border-amber-900 shadow-xs' 
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-amber-50 hover:border-amber-300'"
            >
              <span>{{ m.nameAm }}</span>
              <span class="text-[10px] opacity-75 font-normal">{{ m.nameEn }}</span>
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-bold text-amber-900 uppercase tracking-wider">
              ቀናት (Days in {{ currentMonthInfo.nameAm }})
            </label>
            <span class="text-xs text-stone-500">
              {{ currentMonthInfo.nameEn }} (1 - {{ daysInSelectedMonth }})
            </span>
          </div>

          <div class="grid grid-cols-5 sm:grid-cols-6 gap-1.5">
            <button
              v-for="d in daysInSelectedMonth"
              :key="d"
              @click="pickDay(d)"
              class="py-2.5 px-1 rounded-xl border text-center transition-all flex flex-col items-center justify-center"
              :class="currentDate.month === selectedMonth && currentDate.day === d
                ? 'bg-amber-800 text-white border-amber-900 shadow-sm font-bold ring-2 ring-amber-500'
                : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-amber-100/70 hover:border-amber-300 active:scale-95'"
            >
              <span class="text-sm font-serif font-bold text-amber-950" :class="{ 'text-white': currentDate.month === selectedMonth && currentDate.day === d }">
                {{ numberToGeez(d) }}
              </span>
              <span class="text-[10px] text-stone-500" :class="{ 'text-amber-200': currentDate.month === selectedMonth && currentDate.day === d }">
                {{ d }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div class="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
        <button
          @click="jumpToToday"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors border border-amber-300"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>የዛሬ ቀን (Today)</span>
        </button>

        <button
          @click="emit('close')"
          class="px-4 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-200 transition-colors"
        >
          ዝጋ (Close)
        </button>
      </div>
    </div>
  </div>
</template>

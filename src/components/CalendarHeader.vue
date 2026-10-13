<script setup lang="ts">
import type { EthiopianDate } from '../lib/ethiopianCalendar'
import ZikereLogo from './ZikereLogo.vue'

defineProps<{
  currentDate: EthiopianDate
}>()

const emit = defineEmits<{
  (e: 'open-date-picker'): void
  (e: 'open-splash-board'): void
}>()
</script>

<template>
  <header class="w-full flex items-center justify-between pb-2">
    <button
      @click="emit('open-splash-board')"
      class="flex items-center gap-2.5 font-bold text-base sm:text-[17px] tracking-wide text-[var(--ink)] cursor-pointer group"
      title="ስፕላሽ ሰሌዳ (Splash Board Preview)"
    >
      <ZikereLogo :size="24" class="transition-transform group-hover:scale-105" />
      <span>ዝክረ ቅዱሳን</span>
    </button>

    <button
      @click="emit('open-date-picker')"
      class="text-right cursor-pointer hover:opacity-80 transition-opacity"
    >
      <span class="text-xs sm:text-[13px] font-semibold text-[var(--text-2)]">
        {{ currentDate.weekdayNameAm }} · <b class="text-[var(--rubric)] font-bold">{{ currentDate.monthName }} {{ currentDate.geezDay }}</b>
      </span>
    </button>
  </header>
</template>

<script setup lang="ts">
import type { EthiopianDate } from '../lib/ethiopianCalendar'
import { bookmarks } from '../lib/preferences'
import { Search, Settings, Bookmark } from 'lucide-vue-next'
import EthiopianCross from './EthiopianCross.vue'

defineProps<{
  currentDate: EthiopianDate
}>()

const emit = defineEmits<{
  (e: 'open-date-picker'): void
  (e: 'open-search'): void
  (e: 'open-bookmarks'): void
  (e: 'open-settings'): void
}>()
</script>

<template>
  <header class="sticky top-0 z-30 w-full px-3.5 sm:px-4 pt-3 pb-2 transition-all">
    <div class="max-w-2xl mx-auto rounded-3xl reading-folio backdrop-blur-xl border-2 px-4 py-2.5 shadow-md flex items-center justify-between manuscript-card">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-950 flex items-center justify-center border border-amber-500/40 shadow-xs text-amber-200">
          <EthiopianCross variant="lalibela" :size="20" />
        </div>
        <div>
          <button
            @click="emit('open-date-picker')"
            class="text-left cursor-pointer group flex items-baseline gap-2"
          >
            <h1 class="text-base sm:text-lg font-bold font-ethiopic-serif text-stone-900 dark:text-amber-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
              ዝክረ ቅዱሳን
            </h1>
            <span class="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-400 font-latin-body">
              Zikere Kidusan
            </span>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <button
          @click="emit('open-search')"
          class="p-2 rounded-xl header-btn transition-colors cursor-pointer active:scale-95"
          title="ፈልግ (Search)"
        >
          <Search class="w-4 h-4" />
        </button>

        <button
          @click="emit('open-bookmarks')"
          class="p-2 rounded-xl header-btn transition-colors relative cursor-pointer active:scale-95"
          title="የተቀመጡ (Bookmarks)"
        >
          <Bookmark class="w-4 h-4" />
          <span 
            v-if="bookmarks.length" 
            class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 shadow-xs"
          />
        </button>

        <button
          @click="emit('open-settings')"
          class="p-2 rounded-xl header-btn transition-colors cursor-pointer active:scale-95"
          title="ማስተካከያ (Settings)"
        >
          <Settings class="w-4 h-4" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.reading-folio {
  background-color: var(--bg-card) !important;
  border-color: var(--border-card) !important;
}

.header-btn {
  color: var(--dock-btn) !important;
}

.header-btn:hover {
  background-color: var(--dock-btn-hover) !important;
  color: var(--gold-accent) !important;
}
</style>


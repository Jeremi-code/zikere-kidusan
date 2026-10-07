<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SynaxariumEntry } from '../lib/types'
import { ETHIOPIAN_MONTHS, numberToGeez } from '../lib/ethiopianCalendar'
import { Search, X } from 'lucide-vue-next'
import EthiopianCross from './EthiopianCross.vue'

const props = defineProps<{
  isOpen: boolean
  allReadings: SynaxariumEntry[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', date: { month: number; day: number }): void
}>()

const searchQuery = ref('')
const searchFilter = ref<'all' | 'annual' | 'monthly'>('all')

function getMonthNameAm(monthNum: number): string {
  return ETHIOPIAN_MONTHS[monthNum - 1]?.nameAm || ''
}

function getMonthNameEn(monthNum: number): string {
  return ETHIOPIAN_MONTHS[monthNum - 1]?.nameEn || ''
}

const filteredResults = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []

  return props.allReadings.filter((entry) => {
    const titleMatch = entry.title?.toLowerCase().includes(q) || entry.titleEn?.toLowerCase().includes(q)
    const storyMatch = entry.story?.toLowerCase().includes(q) || entry.storyEn?.toLowerCase().includes(q)
    const annualMatch = entry.annualFeasts?.some((f) => f.toLowerCase().includes(q)) || 
                        entry.annualFeastsEn?.some((f) => f.toLowerCase().includes(q))
    const monthlyMatch = entry.monthlyFeasts?.some((f) => f.toLowerCase().includes(q)) || 
                         entry.monthlyFeastsEn?.some((f) => f.toLowerCase().includes(q))
    const scriptureMatch = entry.scripture?.verse?.toLowerCase().includes(q) ||
                           entry.scriptureEn?.verse?.toLowerCase().includes(q) ||
                           entry.scripture?.reference?.toLowerCase().includes(q) ||
                           entry.scriptureEn?.reference?.toLowerCase().includes(q)

    if (searchFilter.value === 'annual') {
      return annualMatch
    }
    if (searchFilter.value === 'monthly') {
      return monthlyMatch
    }

    return titleMatch || storyMatch || annualMatch || monthlyMatch || scriptureMatch
  }).slice(0, 40)
})

function handleSelect(entry: SynaxariumEntry) {
  emit('select', { month: entry.month, day: entry.day })
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs pt-8 sm:pt-14">
    <div 
      class="reading-folio rounded-3xl shadow-2xl border-2 max-w-xl w-full overflow-hidden flex flex-col max-h-[82vh] manuscript-card"
      @click.stop
    >
      <div class="p-4 border-b border-amber-900/10 dark:border-amber-800/20 bg-amber-50/50 dark:bg-stone-900/60 flex items-center gap-3">
        <div class="relative flex-1">
          <Search class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-800/60 dark:text-amber-400/60" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ፈልግ (ቅዱሳን፣ በዓላት፣ ስንክሳር)..."
            class="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-amber-300/80 dark:border-stone-700 focus:outline-hidden focus:border-amber-700 focus:ring-2 focus:ring-amber-500/20 text-sm reading-folio text-stone-900 dark:text-stone-100 font-ethiopic-serif"
            autofocus
          />
        </div>

        <button 
          @click="emit('close')"
          class="p-2 rounded-xl text-stone-500 hover:bg-stone-200/80 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="px-4 py-2.5 bg-amber-100/40 dark:bg-stone-900/80 border-b border-amber-900/10 dark:border-amber-800/20 flex items-center justify-between text-xs font-ethiopic-serif">
        <div class="flex items-center gap-1.5">
          <button
            @click="searchFilter = 'all'"
            class="px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer"
            :class="searchFilter === 'all' 
              ? 'bg-amber-900 text-amber-100 shadow-xs' 
              : 'text-stone-700 dark:text-stone-300 hover:bg-amber-200/60 dark:hover:bg-stone-800'"
          >
            ሁሉም (All)
          </button>
          <button
            @click="searchFilter = 'annual'"
            class="px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer"
            :class="searchFilter === 'annual' 
              ? 'bg-amber-900 text-amber-100 shadow-xs' 
              : 'text-stone-700 dark:text-stone-300 hover:bg-amber-200/60 dark:hover:bg-stone-800'"
          >
            ዓመታዊ ብቻ (Annual)
          </button>
          <button
            @click="searchFilter = 'monthly'"
            class="px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer"
            :class="searchFilter === 'monthly' 
              ? 'bg-amber-900 text-amber-100 shadow-xs' 
              : 'text-stone-700 dark:text-stone-300 hover:bg-amber-200/60 dark:hover:bg-stone-800'"
          >
            ወርሃዊ ብቻ (Monthly)
          </button>
        </div>

        <span v-if="searchQuery" class="text-stone-500 text-xs font-ethiopic-sans">
          {{ filteredResults.length }} ውጤቶች
        </span>
      </div>

      <div class="p-3 overflow-y-auto flex-1 space-y-1.5 divide-y divide-amber-900/5 dark:divide-stone-800">
        <div v-if="!searchQuery" class="py-14 text-center text-stone-400 font-ethiopic-serif">
          <EthiopianCross variant="lalibela" :size="32" class="mx-auto mb-3 opacity-30 text-amber-800" />
          <p class="text-sm font-semibold text-stone-600 dark:text-stone-400">የቅዱሳን ስም፣ ገድል ወይም በዓል ጽፈው ይፈልጉ</p>
          <p class="text-xs text-stone-400 mt-1 font-latin-body">Search commemorations in Amharic or English</p>
        </div>

        <div v-else-if="filteredResults.length === 0" class="py-14 text-center text-stone-400 font-ethiopic-serif">
          <p class="text-sm">ምንም አልተገኘም (No results found)</p>
          <p class="text-xs text-stone-400 mt-1 font-latin-body">Try a different name or spelling</p>
        </div>

        <button
          v-for="entry in filteredResults"
          :key="entry.id"
          @click="handleSelect(entry)"
          class="w-full text-left p-3 rounded-2xl hover:bg-amber-50/80 dark:hover:bg-stone-800/60 transition-all flex items-start gap-3 group pt-3 cursor-pointer"
        >
          <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-950 dark:text-amber-200 border border-amber-300/80 dark:border-amber-700/40 flex flex-col items-center justify-center shrink-0 shadow-2xs font-ethiopic-serif">
            <span class="text-[11px] font-bold">{{ getMonthNameAm(entry.month) }}</span>
            <span class="text-xs font-bold text-amber-900 dark:text-amber-400">{{ numberToGeez(entry.day) }}</span>
          </div>

          <div class="flex-1 min-w-0 font-ethiopic-serif">
            <div class="flex items-center gap-1.5">
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-100/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-bold border border-amber-200 dark:border-amber-800/50">
                {{ getMonthNameAm(entry.month) }} {{ numberToGeez(entry.day) }} ({{ entry.day }})
              </span>
            </div>
            <h4 class="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 mt-1 truncate group-hover:text-amber-900 dark:group-hover:text-amber-300">
              {{ entry.title }}
            </h4>
            <p v-if="entry.annualFeasts && entry.annualFeasts.length" class="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">
              {{ entry.annualFeasts.join(', ') }}
            </p>
          </div>
        </button>
      </div>

      <div class="p-3.5 reading-folio border-t border-amber-900/10 dark:border-amber-800/20 text-right">
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

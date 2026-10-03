<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SynaxariumEntry } from '../lib/types'
import { ETHIOPIAN_MONTHS } from '../lib/ethiopianCalendar'
import { Search, X } from 'lucide-vue-next'

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
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs pt-10 sm:pt-16">
    <div 
      class="bg-white rounded-2xl shadow-2xl border border-amber-200/90 max-w-xl w-full overflow-hidden flex flex-col max-h-[82vh] animate-in fade-in zoom-in-95 duration-150"
      @click.stop
    >
      <div class="p-4 border-b border-stone-200/80 bg-stone-50 flex items-center gap-3">
        <div class="relative flex-1">
          <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ፈልግ (ቅዱሳን፣ በዓላት፣ ስንክሳር)..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm bg-white text-stone-900"
            autofocus
          />
        </div>

        <button 
          @click="emit('close')"
          class="p-2 rounded-xl text-stone-500 hover:bg-stone-200/80 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="px-4 py-2.5 bg-stone-100/70 border-b border-stone-200/70 flex items-center justify-between text-xs">
        <div class="flex items-center gap-1.5">
          <button
            @click="searchFilter = 'all'"
            class="px-2.5 py-1 rounded-lg font-medium transition-colors"
            :class="searchFilter === 'all' ? 'bg-amber-800 text-white' : 'text-stone-600 hover:bg-stone-200'"
          >
            ሁሉም (All)
          </button>
          <button
            @click="searchFilter = 'annual'"
            class="px-2.5 py-1 rounded-lg font-medium transition-colors"
            :class="searchFilter === 'annual' ? 'bg-amber-800 text-white' : 'text-stone-600 hover:bg-stone-200'"
          >
            ዓመታዊ ብቻ (Annual)
          </button>
          <button
            @click="searchFilter = 'monthly'"
            class="px-2.5 py-1 rounded-lg font-medium transition-colors"
            :class="searchFilter === 'monthly' ? 'bg-amber-800 text-white' : 'text-stone-600 hover:bg-stone-200'"
          >
            ወርሃዊ ብቻ (Monthly)
          </button>
        </div>

        <span v-if="searchQuery" class="text-stone-500">
          {{ filteredResults.length }} ውጤቶች
        </span>
      </div>

      <div class="p-3 overflow-y-auto flex-1 space-y-2 divide-y divide-stone-100">
        <div v-if="!searchQuery" class="py-12 text-center text-stone-400">
          <Search class="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p class="text-sm">የቅዱሳን ስም፣ ገድል ወይም በዓል ጽፈው ይፈልጉ</p>
          <p class="text-xs text-stone-400 mt-1">Search in Amharic or English</p>
        </div>

        <div v-else-if="filteredResults.length === 0" class="py-12 text-center text-stone-400">
          <p class="text-sm">ምንም አልተገኘም (No results found)</p>
          <p class="text-xs text-stone-400 mt-1">የተለየ ቃል ወይም አጻጻፍ ይሞክሩ</p>
        </div>

        <button
          v-for="entry in filteredResults"
          :key="entry.id"
          @click="handleSelect(entry)"
          class="w-full text-left p-3 rounded-xl hover:bg-amber-50/80 transition-colors flex items-start gap-3 group pt-3"
        >
          <div class="w-11 h-11 rounded-lg bg-amber-100 text-amber-900 border border-amber-200 flex flex-col items-center justify-center shrink-0">
            <span class="text-xs font-bold">{{ getMonthNameAm(entry.month) }}</span>
            <span class="text-xs font-serif font-bold text-amber-700">{{ entry.day }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="text-xs px-2 py-0.5 rounded-full bg-amber-100/70 text-amber-900 font-semibold">
                {{ getMonthNameAm(entry.month) }} {{ entry.day }}
              </span>
              <span class="text-xs text-stone-400">
                ({{ getMonthNameEn(entry.month) }} {{ entry.day }})
              </span>
            </div>
            <h4 class="text-sm font-bold text-stone-900 mt-1 truncate group-hover:text-amber-900">
              {{ entry.title }}
            </h4>
            <p v-if="entry.annualFeasts && entry.annualFeasts.length" class="text-xs text-stone-500 mt-0.5 truncate">
              {{ entry.annualFeasts.join(', ') }}
            </p>
          </div>
        </button>
      </div>

      <div class="p-3 bg-stone-50 border-t border-stone-200 text-right">
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

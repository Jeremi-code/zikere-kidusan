<script setup lang="ts">
import { BookOpen, Sparkles, ScrollText, CalendarDays, Image } from 'lucide-vue-next'

export type ReadingTab = 'story' | 'feasts' | 'hymn' | 'scripture' | 'art'

const props = defineProps<{
  activeTab: ReadingTab
  hasHymn?: boolean
  hasScripture?: boolean
  feastsCount?: number
}>()

const emit = defineEmits<{
  (e: 'update:activeTab', tab: ReadingTab): void
}>()

const tabs: { id: ReadingTab; labelAm: string; labelEn: string; icon: any }[] = [
  { id: 'story', labelAm: 'ዜና ቅዱሳን', labelEn: 'Story', icon: BookOpen },
  { id: 'feasts', labelAm: 'በዓላት', labelEn: 'Feasts', icon: CalendarDays },
  { id: 'hymn', labelAm: 'ማሕሌት', labelEn: 'Hymn', icon: ScrollText },
  { id: 'scripture', labelAm: 'ወንጌል', labelEn: 'Gospel', icon: Sparkles },
  { id: 'art', labelAm: 'ሥነ-ሥዕል', labelEn: 'Sacred Art', icon: Image }
]
</script>

<template>
  <div class="w-full overflow-x-auto no-scrollbar py-1">
    <div class="flex items-center gap-1.5 p-1.5 bg-amber-100/40 dark:bg-stone-900/60 backdrop-blur-md rounded-2xl border border-amber-300/40 dark:border-stone-800/60 max-w-full">
      <button
        v-for="t in tabs"
        :key="t.id"
        @click="emit('update:activeTab', t.id)"
        class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none font-ethiopic-serif flex-1 justify-center"
        :class="activeTab === t.id
          ? 'bg-white dark:bg-amber-950 text-amber-950 dark:text-amber-200 shadow-xs border border-amber-300/70 dark:border-amber-700/60 scale-101'
          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-white/40 dark:hover:bg-stone-800/40'"
      >
        <component :is="t.icon" class="w-3.5 h-3.5 shrink-0" :class="activeTab === t.id ? 'text-amber-700 dark:text-amber-400' : 'opacity-70'" />
        <span>{{ t.labelAm }}</span>
        <span
          v-if="t.id === 'feasts' && feastsCount"
          class="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold"
          :class="activeTab === 'feasts' ? 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100' : 'bg-amber-200/50 dark:bg-stone-800 text-stone-600 dark:text-stone-400'"
        >
          {{ feastsCount }}
        </span>
      </button>
    </div>
  </div>
</template>

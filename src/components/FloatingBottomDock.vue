<script setup lang="ts">
import { Bookmark, Share2, Check, Globe, Settings, Sparkles, Search } from 'lucide-vue-next'

defineProps<{
  isBookmarked: boolean
  currentLanguage: 'am' | 'en'
  isCopied: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-bookmark'): void
  (e: 'toggle-language'): void
  (e: 'copy'): void
  (e: 'open-settings'): void
  (e: 'open-search'): void
  (e: 'jump-today'): void
}>()
</script>

<template>
  <div class="fixed bottom-4 sm:bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
    <nav class="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-2xl reading-folio backdrop-blur-xl border-2 shadow-2xl transition-all max-w-fit manuscript-card">
      <button
        @click="emit('jump-today')"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-950 dark:text-amber-200 hover:bg-amber-100/70 dark:hover:bg-amber-950/70 transition-all cursor-pointer font-ethiopic-serif"
        title="ወደ ዛሬ ቀን (Jump to Today)"
      >
        <Sparkles class="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span class="hidden sm:inline">ዛሬ</span>
      </button>

      <div class="w-px h-5 bg-amber-800/15 dark:bg-stone-700 mx-0.5"></div>

      <button
        @click="emit('open-search')"
        class="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-200 hover:bg-amber-100/50 dark:hover:bg-stone-800 transition-all cursor-pointer"
        title="ፈልግ (Search)"
      >
        <Search class="w-4 h-4" />
      </button>

      <button
        @click="emit('toggle-language')"
        class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-amber-100/50 dark:hover:bg-stone-800 transition-all cursor-pointer font-ethiopic-sans"
        :title="currentLanguage === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'"
      >
        <Globe class="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span class="text-[11px]">{{ currentLanguage === 'am' ? 'En' : 'አማ' }}</span>
      </button>

      <button
        @click="emit('toggle-bookmark')"
        class="p-2 rounded-xl transition-all cursor-pointer"
        :class="isBookmarked 
          ? 'text-amber-600 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/50' 
          : 'text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-200 hover:bg-amber-100/50 dark:hover:bg-stone-800'"
        :title="isBookmarked ? 'አስወግድ (Remove Bookmark)' : 'አስቀምጥ (Save Bookmark)'"
      >
        <Bookmark class="w-4 h-4" :class="{ 'fill-current': isBookmarked }" />
      </button>

      <button
        @click="emit('copy')"
        class="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-200 hover:bg-amber-100/50 dark:hover:bg-stone-800 transition-all cursor-pointer"
        title="አጋራ ወይም ቅዳ (Share / Copy)"
      >
        <Check v-if="isCopied" class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <Share2 v-else class="w-4 h-4" />
      </button>

      <div class="w-px h-5 bg-amber-800/15 dark:bg-stone-700 mx-0.5"></div>

      <button
        @click="emit('open-settings')"
        class="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-200 hover:bg-amber-100/50 dark:hover:bg-stone-800 transition-all cursor-pointer"
        title="ማስተካከያ (Settings)"
      >
        <Settings class="w-4 h-4" />
      </button>
    </nav>
  </div>
</template>

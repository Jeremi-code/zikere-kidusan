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
  <div class="fixed bottom-3 sm:bottom-6 inset-x-0 z-40 flex justify-center px-3 sm:px-4 pointer-events-none">
    <nav class="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-2xl floating-dock backdrop-blur-2xl border-2 transition-all max-w-fit">
      <button
        @click="emit('jump-today')"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold floating-dock-btn active:scale-95 transition-all cursor-pointer font-ethiopic-serif"
        title="ወደ ዛሬ ቀን (Jump to Today)"
      >
        <Sparkles class="w-4 h-4 text-amber-600" />
        <span class="font-bold">ዛሬ</span>
      </button>

      <div class="w-px h-5 floating-dock-divider mx-0.5"></div>

      <button
        @click="emit('open-search')"
        class="p-2 rounded-xl floating-dock-btn active:scale-95 transition-all cursor-pointer"
        title="ፈልግ (Search Readings)"
      >
        <Search class="w-4 h-4" />
      </button>

      <button
        @click="emit('toggle-language')"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-ethiopic-sans active:scale-95 language-pill shadow-2xs"
        :title="currentLanguage === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'"
      >
        <Globe class="w-4 h-4 text-current opacity-85" />
        <span class="tracking-wide">{{ currentLanguage === 'am' ? 'English' : 'አማርኛ' }}</span>
      </button>

      <button
        @click="emit('toggle-bookmark')"
        class="p-2 rounded-xl transition-all cursor-pointer active:scale-95"
        :class="isBookmarked 
          ? 'text-amber-700 bg-amber-200/80 font-bold shadow-2xs' 
          : 'floating-dock-btn'"
        :title="isBookmarked ? 'ዕልባት አስወግድ (Remove Bookmark)' : 'ዕልባት ያድርጉ (Save Bookmark)'"
      >
        <Bookmark class="w-4 h-4" :class="{ 'fill-current': isBookmarked }" />
      </button>

      <button
        @click="emit('copy')"
        class="p-2 rounded-xl floating-dock-btn active:scale-95 transition-all cursor-pointer"
        title="አጋራ ወይም ቅዳ (Share / Copy)"
      >
        <Check v-if="isCopied" class="w-4 h-4 text-emerald-600" />
        <Share2 v-else class="w-4 h-4" />
      </button>

      <div class="w-px h-5 floating-dock-divider mx-0.5"></div>

      <button
        @click="emit('open-settings')"
        class="p-2 rounded-xl floating-dock-btn active:scale-95 transition-all cursor-pointer"
        title="ማስተካከያ (Settings)"
      >
        <Settings class="w-4 h-4" />
      </button>
    </nav>
  </div>
</template>

<style scoped>
.floating-dock {
  background-color: var(--dock-bg) !important;
  border: 1.5px solid var(--dock-border) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
}

.floating-dock-btn {
  color: var(--dock-btn) !important;
}

.floating-dock-btn:hover {
  background-color: var(--dock-btn-hover) !important;
  color: var(--gold-accent) !important;
}

.floating-dock-divider {
  background-color: var(--dock-divider) !important;
}

.language-pill {
  background-color: var(--pill-bg) !important;
  color: var(--pill-text) !important;
  border: 1.5px solid var(--pill-border) !important;
}

.language-pill:hover {
  filter: brightness(0.95);
}
</style>


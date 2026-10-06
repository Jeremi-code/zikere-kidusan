<script setup lang="ts">
import { bookmarks, toggleBookmarkItem } from '../lib/preferences'
import { X, Bookmark, Trash2 } from 'lucide-vue-next'
import EthiopianCross from './EthiopianCross.vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', date: { month: number; day: number }): void
}>()

function handleSelect(item: { month: number; day: number }) {
  emit('select', { month: item.month, day: item.day })
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
    <div 
      class="reading-folio w-full max-w-sm h-full shadow-2xl flex flex-col border-l-2 border-amber-800/30 animate-in slide-in-from-right duration-200 manuscript-card"
      @click.stop
    >
      <div class="p-4 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-50 flex items-center justify-between border-b border-amber-700/50">
        <div class="flex items-center gap-2">
          <EthiopianCross variant="lalibela" :size="20" class="text-amber-300" />
          <h2 class="text-base font-bold font-ethiopic-serif text-amber-100">የተቀመጡ ንባቦች (Bookmarks)</h2>
        </div>
        <button 
          @click="emit('close')"
          class="p-1.5 rounded-xl hover:bg-amber-800 text-amber-200 transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-2.5">
        <div v-if="bookmarks.length === 0" class="py-20 text-center text-stone-400 font-ethiopic-serif">
          <Bookmark class="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-800" />
          <p class="text-sm font-semibold text-stone-600 dark:text-stone-300">ምንም የተቀመጠ ንባብ የለም</p>
          <p class="text-xs text-stone-400 mt-1">በንባቡ ገጽ ላይ የዕልባት ምልክቱን ተጭነው ያስቀምጡ</p>
        </div>

        <div
          v-for="item in bookmarks"
          :key="item.id"
          class="p-3.5 rounded-2xl border border-amber-200/70 dark:border-stone-800 hover:border-amber-400 hover:bg-amber-100/30 dark:hover:bg-stone-800/60 transition-all flex items-start justify-between gap-2.5 group manuscript-card"
        >
          <button
            @click="handleSelect(item)"
            class="flex-1 text-left cursor-pointer font-ethiopic-serif"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50">
                {{ item.dateLabel }}
              </span>
            </div>
            <h4 class="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1.5 line-clamp-1 group-hover:text-amber-900 dark:group-hover:text-amber-300">
              {{ item.title }}
            </h4>
            <p v-if="item.titleEn" class="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5 font-latin-display">
              {{ item.titleEn }}
            </p>
          </button>

          <button
            @click="toggleBookmarkItem(item)"
            class="p-1.5 rounded-xl text-stone-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-amber-950/60 transition-colors cursor-pointer"
            title="አስወግድ (Remove)"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="p-3.5 reading-folio border-t border-amber-900/10 dark:border-amber-800/20 text-xs text-stone-800 dark:text-stone-200 text-center font-ethiopic-serif font-bold">
        {{ bookmarks.length }} የተቀመጡ ቀናት
      </div>
    </div>
  </div>
</template>

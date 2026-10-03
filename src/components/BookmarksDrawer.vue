<script setup lang="ts">
import { bookmarks, toggleBookmarkItem } from '../lib/preferences'
import { X, Bookmark, Trash2, BookmarkCheck } from 'lucide-vue-next'

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
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
    <div 
      class="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col border-l border-amber-200/90 animate-in slide-in-from-right duration-200"
      @click.stop
    >
      <div class="p-4 bg-amber-900 text-amber-50 flex items-center justify-between border-b border-amber-800">
        <div class="flex items-center gap-2">
          <BookmarkCheck class="w-5 h-5 text-amber-200" />
          <h2 class="text-base font-bold">የተቀመጡ ንባቦች (Bookmarks)</h2>
        </div>
        <button 
          @click="emit('close')"
          class="p-1.5 rounded-lg hover:bg-amber-800 text-amber-200 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-2">
        <div v-if="bookmarks.length === 0" class="py-16 text-center text-stone-400">
          <Bookmark class="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-900" />
          <p class="text-sm font-medium">ምንም የተቀመጠ ንባብ የለም</p>
          <p class="text-xs text-stone-400 mt-1">በንባቡ ገጽ ላይ የዕልባት ምልክቱን ተጭነው ያስቀምጡ</p>
        </div>

        <div
          v-for="item in bookmarks"
          :key="item.id"
          class="p-3 rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all flex items-start justify-between gap-2 group"
        >
          <button
            @click="handleSelect(item)"
            class="flex-1 text-left"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                {{ item.dateLabel }}
              </span>
            </div>
            <h4 class="text-sm font-bold text-stone-900 mt-1 line-clamp-1 group-hover:text-amber-900">
              {{ item.title }}
            </h4>
            <p v-if="item.titleEn" class="text-xs text-stone-500 line-clamp-1">
              {{ item.titleEn }}
            </p>
          </button>

          <button
            @click="toggleBookmarkItem(item)"
            class="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="አስወግድ"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 text-center">
        {{ bookmarks.length }} የተቀመጡ ቀናት
      </div>
    </div>
  </div>
</template>

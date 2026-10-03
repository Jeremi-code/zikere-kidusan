<script setup lang="ts">
import { currentTheme, currentFontSize, type AppTheme, type FontSize } from '../lib/preferences'
import { X, Sun, Moon, BookOpen, Settings, Type } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const fontSizes: { id: FontSize; label: string; preview: string }[] = [
  { id: 'sm', label: 'ትንሽ (Small)', preview: 'text-sm' },
  { id: 'base', label: 'መደበኛ (Medium)', preview: 'text-base' },
  { id: 'lg', label: 'ትልቅ (Large)', preview: 'text-lg' },
  { id: 'xl', label: 'በጣም ትልቅ (XL)', preview: 'text-xl' }
]

const themes: { id: AppTheme; label: string; sub: string; icon: any }[] = [
  { id: 'light', label: 'ብርሃን (Light)', sub: 'የነጣ ገጽታ', icon: Sun },
  { id: 'sepia', label: 'ብራና (Sepia)', sub: 'ባህላዊ የብራና ወረቀት', icon: BookOpen },
  { id: 'dark', label: 'ጨለማ (Dark)', sub: 'ለሊት ምቹ እይታ', icon: Moon }
]
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div 
      class="bg-white rounded-2xl shadow-2xl border border-amber-200/90 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      @click.stop
    >
      <div class="p-4 bg-amber-900 text-amber-50 flex items-center justify-between border-b border-amber-800">
        <div class="flex items-center gap-2">
          <Settings class="w-5 h-5 text-amber-200" />
          <h2 class="text-base font-bold">የአነባበብ ማስተካከያ (Reading Settings)</h2>
        </div>
        <button 
          @click="emit('close')"
          class="p-1.5 rounded-lg hover:bg-amber-800 text-amber-200 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-5 space-y-6">
        <div>
          <label class="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <BookOpen class="w-4 h-4 text-amber-700" />
            <span>ገጽታ (Theme)</span>
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="t in themes"
              :key="t.id"
              @click="currentTheme = t.id"
              class="p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5"
              :class="currentTheme === t.id 
                ? 'bg-amber-800 text-white border-amber-900 shadow-sm font-bold ring-2 ring-amber-500' 
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-amber-50 hover:border-amber-300'"
            >
              <component :is="t.icon" class="w-5 h-5" />
              <span class="text-xs font-semibold">{{ t.label }}</span>
              <span class="text-[10px] opacity-75 font-normal">{{ t.sub }}</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Type class="w-4 h-4 text-amber-700" />
            <span>የፊደል መጠን (Font Size)</span>
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="f in fontSizes"
              :key="f.id"
              @click="currentFontSize = f.id"
              class="p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center"
              :class="currentFontSize === f.id
                ? 'bg-amber-800 text-white border-amber-900 shadow-sm font-bold ring-2 ring-amber-500'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-amber-50 hover:border-amber-300'"
            >
              <span class="text-xs">{{ f.label }}</span>
              <span :class="f.preview" class="font-serif mt-1">ሀ ለ ሐ</span>
            </button>
          </div>
        </div>
      </div>

      <div class="p-3 bg-stone-50 border-t border-stone-200 text-right">
        <button
          @click="emit('close')"
          class="px-4 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-200 transition-colors"
        >
          ተጠናቋል (Done)
        </button>
      </div>
    </div>
  </div>
</template>

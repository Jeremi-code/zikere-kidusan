<script setup lang="ts">
import { currentTheme, currentFontSize, type AppTheme, type FontSize } from '../lib/preferences'
import { X, Sun, Moon, BookOpen, Type } from 'lucide-vue-next'
import EthiopianCross from './EthiopianCross.vue'

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
  { id: 'light', label: 'የብርሃን ብራና', sub: 'Light Vellum', icon: Sun },
  { id: 'sepia', label: 'የወጋገን ቅብዓ', sub: 'Warm Sepia', icon: BookOpen },
  { id: 'dark', label: 'የማሕሌት ሌሊት', sub: 'Monastic Dark', icon: Moon }
]
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
    <div 
      class="reading-folio rounded-3xl shadow-2xl border-2 max-w-md w-full overflow-hidden manuscript-card"
      @click.stop
    >
      <div class="p-4 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-50 flex items-center justify-between border-b border-amber-700/50">
        <div class="flex items-center gap-2">
          <EthiopianCross variant="lalibela" :size="20" class="text-amber-300" />
          <h2 class="text-base font-bold font-ethiopic-serif text-amber-100">የአነባበብ ማስተካከያ (Settings)</h2>
        </div>
        <button 
          @click="emit('close')"
          class="p-1.5 rounded-xl hover:bg-amber-800 text-amber-200 transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-5 space-y-6">
        <div>
          <label class="block text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-ethiopic-serif">
            <BookOpen class="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>ገጽታ (Theme)</span>
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="t in themes"
              :key="t.id"
              @click="currentTheme = t.id"
              class="p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer font-ethiopic-serif"
              :class="currentTheme === t.id 
                ? 'bg-amber-800 dark:bg-amber-900 text-white border-amber-600 shadow-sm font-bold ring-2 ring-amber-400' 
                : 'bg-amber-100/30 text-stone-800 border-amber-300/40 hover:bg-amber-100/70 dark:bg-stone-900/60 dark:text-stone-200 dark:border-stone-800'"
            >
              <component :is="t.icon" class="w-5 h-5" />
              <span class="text-xs font-semibold">{{ t.label }}</span>
              <span class="text-[10px] opacity-75 font-normal font-latin-display">{{ t.sub }}</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-ethiopic-serif">
            <Type class="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>የፊደል መጠን (Font Size)</span>
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="f in fontSizes"
              :key="f.id"
              @click="currentFontSize = f.id"
              class="p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer font-ethiopic-serif"
              :class="currentFontSize === f.id
                ? 'bg-amber-800 dark:bg-amber-900 text-white border-amber-600 shadow-sm font-bold ring-2 ring-amber-400' 
                : 'bg-amber-100/30 text-stone-800 border-amber-300/40 hover:bg-amber-100/70 dark:bg-stone-900/60 dark:text-stone-200 dark:border-stone-800'"
            >
              <span class="text-xs">{{ f.label }}</span>
              <span :class="f.preview" class="font-ethiopic-serif mt-1 font-bold text-amber-950 dark:text-amber-200">ሀ ለ ሐ</span>
            </button>
          </div>
        </div>
      </div>

      <div class="p-3.5 reading-folio border-t border-amber-900/10 dark:border-amber-800/20 text-right">
        <button
          @click="emit('close')"
          class="px-4 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/70 transition-colors cursor-pointer font-ethiopic-serif"
        >
          ተጠናቋል (Done)
        </button>
      </div>
    </div>
  </div>
</template>

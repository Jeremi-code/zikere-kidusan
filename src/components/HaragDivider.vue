<script setup lang="ts">
import EthiopianCross from './EthiopianCross.vue'

withDefaults(
  defineProps<{
    variant?: 'banner' | 'divider' | 'compact'
  }>(),
  {
    variant: 'divider'
  }
)
</script>

<template>
  <div v-if="variant === 'banner'" class="w-full flex flex-col items-center justify-center my-3 select-none" aria-hidden="true">
    <div class="w-full flex items-center justify-center gap-2 px-2">
      <div class="h-0.5 flex-1 bg-gradient-to-r from-transparent via-amber-700/40 to-amber-800/80"></div>
      <div class="flex items-center gap-1.5 text-amber-800 dark:text-amber-500">
        <EthiopianCross variant="meskel" :size="16" class="opacity-80" />
        <EthiopianCross variant="lalibela" :size="22" class="opacity-95 text-amber-900 dark:text-amber-400" />
        <EthiopianCross variant="meskel" :size="16" class="opacity-80" />
      </div>
      <div class="h-0.5 flex-1 bg-gradient-to-l from-transparent via-amber-700/40 to-amber-800/80"></div>
    </div>
    
    <svg class="w-full max-w-md h-5 mt-1 text-amber-800 dark:text-amber-500/90" viewBox="0 0 320 20" fill="none" stroke="currentColor">
      <path
        d="M10 10 Q25 2, 40 10 T70 10 T100 10 T130 10 T160 10 T190 10 T220 10 T250 10 T280 10 T310 10"
        stroke-width="1.8"
        stroke-linecap="round"
      />
      <path
        d="M10 10 Q25 18, 40 10 T70 10 T100 10 T130 10 T160 10 T190 10 T220 10 T250 10 T280 10 T310 10"
        stroke-width="1.8"
        stroke-linecap="round"
      />
      <circle cx="70" cy="10" r="2.2" fill="currentColor" />
      <circle cx="130" cy="10" r="2.2" fill="currentColor" />
      <circle cx="160" cy="10" r="3.2" fill="currentColor" />
      <circle cx="190" cy="10" r="2.2" fill="currentColor" />
      <circle cx="250" cy="10" r="2.2" fill="currentColor" />
    </svg>
  </div>

  <div v-else-if="variant === 'divider'" class="w-full flex items-center justify-center my-4 gap-2.5 opacity-85 select-none" aria-hidden="true">
    <div class="h-px flex-1 bg-gradient-to-r from-transparent via-amber-700/30 to-amber-700/60 dark:via-amber-500/20 dark:to-amber-500/50"></div>
    <div class="flex items-center gap-2 text-amber-800 dark:text-amber-400">
      <span class="w-1.5 h-1.5 rotate-45 bg-amber-700 dark:bg-amber-400"></span>
      <EthiopianCross variant="lalibela" :size="16" />
      <span class="w-1.5 h-1.5 rotate-45 bg-amber-700 dark:bg-amber-400"></span>
    </div>
    <div class="h-px flex-1 bg-gradient-to-l from-transparent via-amber-700/30 to-amber-700/60 dark:via-amber-500/20 dark:to-amber-500/50"></div>
  </div>

  <div v-else class="flex items-center justify-center gap-1.5 my-2 opacity-75 select-none text-amber-800 dark:text-amber-400" aria-hidden="true">
    <span class="w-1 h-1 rotate-45 bg-current"></span>
    <span class="text-xs font-serif">፨</span>
    <span class="w-1 h-1 rotate-45 bg-current"></span>
  </div>
</template>

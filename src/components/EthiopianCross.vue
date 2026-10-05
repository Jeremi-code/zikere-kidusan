<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'lalibela' | 'gondar' | 'meskel'
    size?: number | string
    class?: string
  }>(),
  {
    variant: 'lalibela',
    size: 24,
    class: 'text-current'
  }
)

const pixelSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})
</script>

<template>
  <svg
    :width="pixelSize"
    :height="pixelSize"
    viewBox="0 0 100 100"
    fill="currentColor"
    :class="props.class"
    aria-hidden="true"
  >
    <g v-if="variant === 'lalibela'">
      <path
        d="M44 8 H56 V24 H72 V36 H56 V44 H76 V40 H88 V60 H76 V56 H56 V64 H72 V76 H56 V92 H44 V76 H28 V64 H44 V56 H24 V60 H12 V40 H24 V44 H44 V36 H28 V24 H44 Z"
        fill-rule="evenodd"
      />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
      <rect x="47" y="16" width="6" height="6" fill="#fff" fill-opacity="0.3" />
      <rect x="47" y="78" width="6" height="6" fill="#fff" fill-opacity="0.3" />
      <rect x="20" y="47" width="6" height="6" fill="#fff" fill-opacity="0.3" />
      <rect x="74" y="47" width="6" height="6" fill="#fff" fill-opacity="0.3" />
    </g>

    <g v-else-if="variant === 'gondar'">
      <path
        d="M50 6 C52 14 58 18 64 20 C58 24 54 30 54 38 L68 38 C74 34 80 34 86 38 C84 44 84 50 86 56 C80 60 74 60 68 56 L54 56 C54 64 58 70 64 74 C58 76 52 80 50 88 C48 80 42 76 36 74 C42 70 46 64 46 56 L32 56 C26 60 20 60 14 56 C16 50 16 44 14 38 C20 34 26 34 32 38 L46 38 C46 30 42 24 36 20 C42 18 48 14 50 6 Z"
      />
      <circle cx="50" cy="47" r="5" fill="#fff" fill-opacity="0.3" />
      <path d="M47 88 L53 88 L51 98 L49 98 Z" />
    </g>

    <g v-else>
      <path
        d="M45 10 H55 V35 H80 V45 H90 V55 H80 V65 H55 V90 H45 V65 H20 V55 H10 V45 H20 V35 H45 Z"
      />
      <circle cx="50" cy="50" r="6" fill="#fff" fill-opacity="0.35" />
      <rect x="48" y="2" width="4" height="6" />
      <rect x="48" y="92" width="4" height="6" />
      <rect x="2" y="48" width="6" height="4" />
      <rect x="92" y="48" width="6" height="4" />
    </g>
  </svg>
</template>

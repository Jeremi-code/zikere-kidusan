<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: number | string
    class?: string
    variant?: 'icon' | 'badge'
  }>(),
  {
    size: 24,
    variant: 'icon'
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
    viewBox="0 0 512 512"
    :class="props.class"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect
      v-if="variant === 'badge'"
      width="512"
      height="512"
      rx="115"
      fill="currentColor"
      class="text-stone-900 dark:text-stone-950"
    />
    <g :transform="variant === 'badge' ? 'translate(256 256) scale(0.74) translate(-256 -256)' : undefined">
      <circle cx="256" cy="256" r="30" class="fill-[#c0322a] dark:fill-[#e0493d]" />
      <circle cx="256" cy="176" r="26" class="fill-current" />
      <circle cx="336" cy="256" r="26" class="fill-current" />
      <circle cx="256" cy="336" r="26" class="fill-current" />
      <circle cx="176" cy="256" r="26" class="fill-current" />
      <circle cx="256" cy="100" r="22" class="fill-current" />
      <circle cx="412" cy="256" r="22" class="fill-current" />
      <circle cx="256" cy="412" r="22" class="fill-current" />
      <circle cx="100" cy="256" r="22" class="fill-current" />
    </g>
  </svg>
</template>

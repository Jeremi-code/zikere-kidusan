<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    forceReplay?: boolean
  }>(),
  {
    forceReplay: false
  }
)

const emit = defineEmits<{
  (e: 'complete'): void
}>()

const isVisible = ref(true)
const isExit = ref(false)
const titleLetters = [...'ዝክረ ቅዱሳን']

const DOTS = [
  { dx: 0, dy: 0, r: 30, d: 0, day: 0, red: true },
  { dx: 0, dy: -80, r: 26, d: 0.07, day: -1 },
  { dx: 80, dy: 0, r: 26, d: 0.092, day: 1 },
  { dx: 0, dy: 80, r: 26, d: 0.114, day: 2 },
  { dx: -80, dy: 0, r: 26, d: 0.136, day: -2 },
  { dx: 0, dy: -156, r: 22, d: 0.158, day: -3 },
  { dx: 156, dy: 0, r: 22, d: 0.18, day: 3 },
  { dx: 0, dy: 156, r: 22, d: 0.202, day: 4 },
  { dx: -156, dy: 0, r: 22, d: 0.224, day: -4 },
]

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) {
    isVisible.value = false
    emit('complete')
    return
  }

  const exitDelay = 850
  const completeDelay = 1250

  setTimeout(() => {
    isExit.value = true
  }, exitDelay)

  setTimeout(() => {
    isVisible.value = false
    emit('complete')
  }, completeDelay)
})
</script>

<template>
  <div
    v-if="isVisible"
    class="splash-container fixed inset-0 z-50 overflow-hidden pointer-events-none select-none transition-opacity duration-300"
    :class="{ 'opacity-0': isExit }"
  >
    <div class="veil absolute inset-0"></div>

    <div class="brand absolute inset-x-0 top-[calc(50%+44px)] text-center transition-opacity duration-200">
      <div class="word font-bold text-3xl sm:text-4xl leading-tight font-ethiopic-serif tracking-wider text-[var(--fg,#1b130b)] dark:text-[#efe4cf]">
        <span
          v-for="(ch, i) in titleLetters"
          :key="i"
          class="word-char inline-block"
          :style="{ '--i': i }"
        >
          {{ ch }}
        </span>
      </div>
      <div class="latin-sub mt-2.5 font-bold text-[11px] font-latin-body uppercase tracking-[0.45em] indent-[0.45em] text-[#8b765e] dark:text-[#85715a]">
        Zikere · Kidusan
      </div>
    </div>

    <div class="dots-layer absolute inset-0">
      <div
        v-for="(p, idx) in DOTS"
        :key="idx"
        class="slot absolute -translate-x-1/2 -translate-y-1/2"
        :class="{ red: p.red }"
        :style="{
          width: `${(p.r * 2 * 148) / 512}px`,
          height: `${(p.r * 2 * 148) / 512}px`,
          left: `calc(50% + ${(p.dx * 148) / 512}px)`,
          top: `calc(50% - 48px + ${(p.dy * 148) / 512}px)`,
          '--d': `${p.d}s`
        }"
      >
        <span class="bleed absolute inset-0 rounded-full"></span>
        <span class="ink absolute inset-0 rounded-full"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.splash-container {
  background: var(--bg-app);
}

.veil {
  background: radial-gradient(120% 80% at 50% 42%, var(--bg-app) 40%, color-mix(in oklab, var(--bg-app) 85%, #000) 100%);
}

.veil::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background: repeating-linear-gradient(transparent 0 33px, currentColor 33px 34px);
  mask: linear-gradient(90deg, transparent 6%, #000 14% 86%, transparent 94%);
}

.word-char {
  opacity: 0;
  filter: blur(5px);
  transform: translateY(4px);
  animation: write 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(0.12s + var(--i) * 26ms);
}

.latin-sub {
  opacity: 0;
  animation: fade 0.3s 0.28s ease-out forwards;
}

.ink,
.bleed {
  background: #1b130b;
}

:global(.dark) .ink,
:global(.dark) .bleed {
  background: #d9a54a;
}

.slot.red .ink,
.slot.red .bleed {
  background: #c0322a !important;
}

:global(.dark) .slot.red .ink,
:global(.dark) .slot.red .bleed {
  background: #e0493d !important;
}

.ink {
  opacity: 0;
  transform: scale(0.2);
  animation: drop 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
  animation-delay: var(--d);
}

.bleed {
  opacity: 0;
  filter: blur(5px);
  animation: soak 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--d);
}

@keyframes drop {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  55% {
    opacity: 1;
    transform: scale(1.14);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes soak {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  25% {
    opacity: 0.22;
  }
  100% {
    opacity: 0;
    transform: scale(2.1);
  }
}

@keyframes write {
  to {
    opacity: 1;
    filter: blur(0);
    transform: none;
  }
}

@keyframes fade {
  to {
    opacity: 1;
  }
}
</style>

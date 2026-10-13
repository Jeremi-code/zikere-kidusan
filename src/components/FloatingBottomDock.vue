<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Search } from 'lucide-vue-next'

defineProps<{
  isBookmarked: boolean
  currentLanguage: 'am' | 'en'
  isCopied: boolean
}>()

const emit = defineEmits<{
  (e: 'jump-today'): void
  (e: 'open-calendar'): void
  (e: 'open-bookmarks'): void
  (e: 'open-search'): void
  (e: 'open-settings'): void
}>()

const activeTab = ref(0)
const isSmall = ref(false)
const isSearchActive = ref(false)

function selectTab(i: number) {
  isSmall.value = false
  isSearchActive.value = false
  activeTab.value = i

  if (i === 0) {
    emit('jump-today')
  } else if (i === 1) {
    emit('open-calendar')
  } else if (i === 2) {
    emit('open-bookmarks')
  }
}

function handleTabClick(i: number) {
  if (isSmall.value) {
    isSmall.value = false
    return
  }
  selectTab(i)
}

function toggleSearch() {
  isSearchActive.value = !isSearchActive.value
  emit('open-search')
}

let lastScroll = 0
function onScroll() {
  const y = window.scrollY || document.documentElement.scrollTop
  if (Math.abs(y - lastScroll) < 6) return
  isSmall.value = y > lastScroll && y > 48
  lastScroll = y
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <nav
    class="fixed left-3.5 right-3.5 bottom-[max(14px,env(safe-area-inset-bottom))] z-40 max-w-md mx-auto flex items-end justify-between gap-2.5 pointer-events-none"
    aria-label="ዋና"
  >
    <div
      class="glass capsule pointer-events-auto"
      :class="{ small: isSmall, off: isSearchActive }"
      @click="isSmall = false"
    >
      <span
        class="pill"
        :style="{
          transform: `translateX(${activeTab * 100}%)`,
          opacity: isSmall || isSearchActive ? 0 : 1
        }"
      ></span>

      <div class="tabs">
        <button
          class="tab"
          :class="{ on: activeTab === 0 && !isSearchActive }"
          @click="handleTabClick(0)"
          aria-label="ዛሬ"
        >
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3v18M6 9h12" />
            <path d="M10 3h4M10 21h4M6 7.5v3M18 7.5v3" />
          </svg>
          <span class="text-[10px] font-medium font-ethiopic-serif">ዛሬ</span>
        </button>

        <button
          class="tab"
          :class="{ on: activeTab === 1 && !isSearchActive }"
          @click="handleTabClick(1)"
          aria-label="ቀን መቁጠሪያ"
        >
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 10a7 7 0 0 1 14 0v9a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19z" />
            <g fill="currentColor" stroke="none">
              <circle cx="9" cy="12.2" r="0.78" />
              <circle cx="9" cy="15" r="0.78" />
              <circle cx="9" cy="17.8" r="0.78" />
              <circle cx="12" cy="12.2" r="0.78" />
              <circle cx="12" cy="15" r="1.2" />
              <circle cx="12" cy="17.8" r="0.78" />
              <circle cx="15" cy="12.2" r="0.78" />
              <circle cx="15" cy="15" r="0.78" />
              <circle cx="15" cy="17.8" r="0.78" />
            </g>
          </svg>
          <span class="text-[10px] font-medium font-ethiopic-serif">ቀን መቁጠሪያ</span>
        </button>

        <button
          class="tab"
          :class="{ on: activeTab === 2 && !isSearchActive }"
          @click="handleTabClick(2)"
          aria-label="የተቀመጡ"
        >
          <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="3.5" width="13.5" height="15.5" rx="1.8" />
            <path d="M8.2 3.5V19M13.35 7.3v7.4M11.1 9.7h4.5" />
            <path d="M13.6 19h2.6v2.9l-1.3-1-1.3 1z" />
          </svg>
          <span class="text-[10px] font-medium font-ethiopic-serif">የተቀመጡ</span>
        </button>
      </div>
    </div>

    <button
      class="glass search pointer-events-auto"
      :class="{ on: isSearchActive }"
      @click="toggleSearch"
      aria-label="ፍለጋ"
    >
      <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="10.5" cy="10.5" r="6.3" />
        <path d="M15.1 15.1l3.2 3.2" />
        <g fill="currentColor" stroke="none">
          <circle cx="10.5" cy="7.6" r="0.68" />
          <circle cx="10.5" cy="13.4" r="0.68" />
          <circle cx="7.6" cy="10.5" r="0.68" />
          <circle cx="13.4" cy="10.5" r="0.68" />
          <circle cx="10.5" cy="10.5" r="1.05" />
          <path d="M19.6 17.9l1.7 1.7-1.7 1.7-1.7-1.7z" />
        </g>
      </svg>
    </button>
  </nav>
</template>

<style scoped>
.glass {
  position: relative;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in oklab, var(--bg) 62%, transparent);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px var(--glass-shadow);
  -webkit-backdrop-filter: blur(22px) saturate(180%);
  backdrop-filter: blur(22px) saturate(180%);
  transform: translateZ(0);
}

.glass::before,
.glass::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}

.glass::before {
  background: linear-gradient(135deg, rgba(255, 255, 255, var(--sheen)) 0%, transparent 50%, rgba(255, 255, 255, calc(var(--sheen) / 3)) 100%);
}

.glass::after {
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, var(--rim)), inset 0 -1px 1px rgba(255, 255, 255, calc(var(--rim) / 3));
}

.capsule {
  height: 62px;
  width: 100%;
  max-width: calc(100% - 72px);
  padding: 4px;
  transition: max-width 0.5s var(--ease-spring);
}

.capsule.small {
  max-width: 62px;
}

.pill {
  position: absolute;
  top: 4px;
  left: 4px;
  height: 52px;
  width: calc((100% - 8px) / 3);
  border-radius: 999px;
  background: color-mix(in oklab, var(--rubric) 13%, transparent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, var(--rim));
  transition: transform 0.42s var(--ease-spring), opacity 0.3s ease;
}

.tabs {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 100%;
}

.tab {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 2px;
  border-radius: 999px;
  cursor: pointer;
  color: var(--text-3);
  transition: color 0.2s, opacity 0.2s;
  background: none;
  border: none;
}

.tab.on {
  color: var(--text);
}

.capsule.small .tab:not(.on) {
  opacity: 0;
  pointer-events: none;
}

.capsule.small .tab.on {
  position: absolute;
  inset: 0;
}

.capsule.small .tab span {
  display: none;
}

.search {
  width: 62px;
  height: 62px;
  flex: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--text-2);
  transition: transform 0.2s;
  border: 1px solid var(--glass-border);
}

.search:active {
  transform: scale(0.9);
}

.ic {
  width: 22px;
  height: 22px;
  transition: transform 0.25s var(--ease-spring);
}

.on > .ic,
.search.on .ic {
  color: var(--rubric);
}

.tab:active .ic {
  transform: scale(0.88);
}
</style>

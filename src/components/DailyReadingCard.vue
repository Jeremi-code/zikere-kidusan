<script setup lang="ts">
import { computed } from 'vue'
import type { SynaxariumEntry } from '../lib/types'
import { currentLanguage, currentFontSize } from '../lib/preferences'
import { BookOpen } from 'lucide-vue-next'
import EthiopianCross from './EthiopianCross.vue'
import HaragDivider from './HaragDivider.vue'

const props = defineProps<{
  entry?: SynaxariumEntry
  dateLabel: string
}>()

const fontSizeClass = computed(() => {
  switch (currentFontSize.value) {
    case 'sm':
      return 'text-sm sm:text-base leading-relaxed sm:leading-loose'
    case 'lg':
      return 'text-lg sm:text-xl leading-loose'
    case 'xl':
      return 'text-xl sm:text-2xl leading-loose'
    default:
      return 'text-base sm:text-lg leading-loose'
  }
})

const displayTitle = computed(() => {
  if (!props.entry) return ''
  return currentLanguage.value === 'en' && props.entry.titleEn ? props.entry.titleEn : props.entry.title
})

const displaySubtitle = computed(() => {
  if (!props.entry) return ''
  return currentLanguage.value === 'en' && props.entry.subtitleEn ? props.entry.subtitleEn : props.entry.subtitle
})

const displayStory = computed(() => {
  if (!props.entry) return ''
  return currentLanguage.value === 'en' && props.entry.storyEn ? props.entry.storyEn : props.entry.story
})

const storyDropCap = computed(() => {
  const story = displayStory.value.trim()
  if (!story) return { initial: '', rest: '' }
  return {
    initial: story.charAt(0),
    rest: story.slice(1)
  }
})

const displayScripture = computed(() => {
  if (!props.entry) return undefined
  if (currentLanguage.value === 'en') {
    return props.entry.scriptureEn || props.entry.scripture
  }
  return props.entry.scripture || props.entry.scriptureEn
})

const displayAnnualFeasts = computed(() => {
  if (!props.entry) return []
  const feasts = currentLanguage.value === 'en' && props.entry.annualFeastsEn?.length
    ? props.entry.annualFeastsEn
    : props.entry.annualFeasts
  return feasts || []
})
</script>

<template>
  <div v-if="entry" class="space-y-4 sm:space-y-5">
    <section class="hero-spotlight rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-lg border-2 transition-all">
      <div class="relative z-10 space-y-3.5">
        <div class="flex items-center">
          <div class="hero-pill-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-2xs font-ethiopic-serif">
            <EthiopianCross variant="lalibela" :size="14" />
            <span>{{ dateLabel }}</span>
          </div>
        </div>

        <div class="space-y-1.5 pt-1">
          <h2 class="hero-title text-xl sm:text-3xl font-bold font-ethiopic-serif leading-snug tracking-tight">
            {{ displayTitle }}
          </h2>
          <p v-if="displaySubtitle" class="hero-subtitle text-xs sm:text-sm font-medium font-ethiopic-serif italic">
            — {{ displaySubtitle }} —
          </p>
          <div v-if="displayAnnualFeasts.length" class="flex flex-wrap gap-1.5 pt-2">
            <span
              v-for="(feast, idx) in displayAnnualFeasts"
              :key="idx"
              class="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full border bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200 font-ethiopic-serif font-medium"
            >
              {{ feast }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <article class="reading-folio rounded-3xl p-5 sm:p-7 manuscript-card border-2 transition-all space-y-4">
      <div class="pb-3 border-b folio-header-border">
        <h3 class="text-sm font-bold font-ethiopic-serif rubric-text flex items-center gap-1.5">
          <BookOpen class="w-4 h-4" />
          <span>{{ currentLanguage === 'am' ? 'ዜና ቅዱሳን (መጽሐፈ ስንክሳር)' : 'Lives of the Saints (Synaxarium)' }}</span>
        </h3>
      </div>

      <div class="font-ethiopic-serif story-text whitespace-pre-line text-justify leading-loose" :class="fontSizeClass">
        <span class="float-left text-4xl sm:text-5xl font-bold rubric-text mr-2.5 leading-none font-ethiopic-serif">
          {{ storyDropCap.initial }}
        </span>
        <span>{{ storyDropCap.rest }}</span>
      </div>

      <div 
        v-if="displayScripture" 
        class="scripture-card rounded-2xl p-4 sm:p-5 border shadow-2xs mt-4"
      >
        <p class="font-ethiopic-serif text-sm sm:text-base leading-relaxed italic">
          «{{ displayScripture.verse }}»
        </p>
        <p class="text-xs sm:text-sm font-bold rubric-text mt-2 text-right font-ethiopic-serif">
          — {{ displayScripture.reference }}
        </p>
      </div>

      <HaragDivider variant="divider" />
    </article>
  </div>
</template>

<style scoped>
.hero-spotlight {
  background: var(--bg-hero) !important;
  border-color: var(--border-hero) !important;
  color: var(--text-primary) !important;
}

.hero-title {
  color: var(--text-primary) !important;
}

.hero-subtitle {
  color: var(--text-secondary) !important;
}

.hero-pill-badge {
  background-color: var(--badge-bg) !important;
  border-color: var(--badge-border) !important;
  color: var(--badge-text) !important;
}

.reading-folio {
  background-color: var(--bg-card) !important;
  color: var(--text-primary) !important;
  border-color: var(--border-card) !important;
}

.folio-header-border {
  border-color: var(--border-divider) !important;
}

.folio-meta {
  color: var(--text-secondary) !important;
}

.story-text {
  color: var(--text-primary) !important;
}

.rubric-text {
  color: var(--rubric-color) !important;
}
</style>

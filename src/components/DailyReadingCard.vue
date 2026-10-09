<script setup lang="ts">
import { computed } from 'vue'
import type { SynaxariumEntry } from '../lib/types'
import { currentLanguage, currentFontSize } from '../lib/preferences'
import EthiopianCross from './EthiopianCross.vue'
import HaragDivider from './HaragDivider.vue'

const props = defineProps<{
  entry?: SynaxariumEntry
  dateLabel?: string
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
  const val = currentLanguage.value === 'en' && props.entry.storyEn ? props.entry.storyEn : props.entry.story
  if (!val) return ''
  if (Array.isArray(val)) {
    return (val as string[]).filter(Boolean).join('\n\n')
  }
  return String(val)
})

const storyDropCap = computed(() => {
  const story = (displayStory.value || '').trim()
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

const displayMonthlyFeasts = computed(() => {
  if (!props.entry) return []
  const feasts = currentLanguage.value === 'en' && props.entry.monthlyFeastsEn?.length
    ? props.entry.monthlyFeastsEn
    : props.entry.monthlyFeasts
  return feasts || []
})
</script>

<template>
  <div v-if="entry" class="space-y-4 sm:space-y-5">
    <div v-if="displayAnnualFeasts.length || displayMonthlyFeasts.length" class="space-y-4 sm:space-y-5">
      <section 
        v-if="displayAnnualFeasts.length" 
        class="annual-card rounded-3xl p-5 sm:p-6 border-2 shadow-xs space-y-3 transition-all"
      >
        <div class="flex items-center justify-between pb-2.5 border-b border-rose-900/10 dark:border-rose-800/20">
          <h3 class="text-sm sm:text-base font-bold font-ethiopic-serif flex items-center gap-2 text-rose-950 dark:text-rose-100">
            <EthiopianCross variant="lalibela" :size="16" class="text-rose-700 dark:text-rose-400" />
            <span>{{ currentLanguage === 'am' ? 'ዓመታዊ በዓላት' : 'Annual Feasts' }}</span>
          </h3>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-rose-600/10 dark:bg-rose-400/10 text-rose-900 dark:text-rose-300 font-ethiopic-serif font-semibold border border-rose-900/10 dark:border-rose-700/20">
            {{ displayAnnualFeasts.length }} {{ currentLanguage === 'am' ? 'በዓላት' : 'Feasts' }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <div
            v-for="(feast, idx) in displayAnnualFeasts"
            :key="idx"
            class="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-white/70 dark:bg-stone-900/40 border border-rose-900/10 dark:border-rose-800/20 text-xs sm:text-sm font-ethiopic-serif shadow-2xs"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 shrink-0" />
            <span class="font-medium text-stone-900 dark:text-stone-100">{{ feast }}</span>
          </div>
        </div>
      </section>

      <section 
        v-if="displayMonthlyFeasts.length" 
        class="monthly-card rounded-3xl p-5 sm:p-6 border-2 shadow-xs space-y-3 transition-all"
      >
        <div class="flex items-center justify-between pb-2.5 border-b border-amber-900/10 dark:border-amber-800/25">
          <h3 class="text-sm sm:text-base font-bold font-ethiopic-serif flex items-center gap-2 text-amber-950 dark:text-amber-100">
            <EthiopianCross variant="lalibela" :size="16" class="text-amber-700 dark:text-amber-400" />
            <span>{{ currentLanguage === 'am' ? `የዕለቱ ወርሃዊ በዓላት (${entry.day} ቀን)` : `Monthly Feasts of Day ${entry.day}` }}</span>
          </h3>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-600/10 dark:bg-amber-400/10 text-amber-900 dark:text-amber-300 font-ethiopic-serif font-semibold border border-amber-900/10 dark:border-amber-700/20">
            {{ displayMonthlyFeasts.length }} {{ currentLanguage === 'am' ? 'በዓላት' : 'Feasts' }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <div
            v-for="(feast, idx) in displayMonthlyFeasts"
            :key="idx"
            class="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-white/70 dark:bg-stone-900/40 border border-amber-900/10 dark:border-amber-800/20 text-xs sm:text-sm font-ethiopic-serif shadow-2xs"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 shrink-0" />
            <span class="font-medium text-stone-900 dark:text-stone-100">{{ feast }}</span>
          </div>
        </div>
      </section>
    </div>

    <article class="reading-folio rounded-3xl p-5 sm:p-8 manuscript-card border-2 transition-all space-y-5">
      <header class="space-y-3 text-center pb-4 border-b folio-header-border">
        <div class="flex items-center justify-center gap-2 text-amber-800 dark:text-amber-400 opacity-80">
          <EthiopianCross variant="lalibela" :size="16" />
          <span class="text-xs font-semibold tracking-wider font-ethiopic-serif">
            {{ currentLanguage === 'am' ? 'መጽሐፈ ስንክሳር' : 'The Synaxarium' }}
          </span>
          <EthiopianCross variant="lalibela" :size="16" />
        </div>

        <div class="space-y-1.5 max-w-xl mx-auto">
          <h2 class="text-xl sm:text-3xl font-bold font-ethiopic-serif leading-snug tracking-tight folio-title">
            {{ displayTitle }}
          </h2>
          <p v-if="displaySubtitle" class="text-xs sm:text-sm font-medium font-ethiopic-serif italic folio-subtitle">
            — {{ displaySubtitle }} —
          </p>
        </div>

        <HaragDivider variant="compact" />
      </header>

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
.folio-title {
  color: var(--text-primary) !important;
}

.folio-subtitle {
  color: var(--text-secondary) !important;
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

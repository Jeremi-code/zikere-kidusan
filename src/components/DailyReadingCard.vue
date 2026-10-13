<script setup lang="ts">
import { computed } from 'vue'
import type { SynaxariumEntry } from '../lib/types'
import { currentLanguage, currentFontSize } from '../lib/preferences'
import { numberToGeez } from '../lib/ethiopianCalendar'

const props = defineProps<{
  entry?: SynaxariumEntry
  dateLabel?: string
}>()

const displayTitle = computed(() => {
  if (!props.entry) return ''
  return currentLanguage.value === 'en' && props.entry.titleEn ? props.entry.titleEn : props.entry.title
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

const storyParagraphs = computed(() => {
  const story = displayStory.value.trim()
  if (!story) return []
  return story.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
})

const readingMinutes = computed(() => {
  const text = displayStory.value
  const words = text.split(/\s+/).filter(Boolean).length
  const mins = Math.max(1, Math.round(words / 130))
  return `${numberToGeez(mins)} ደቂቃ ንባብ`
})

const bodyParagraphs = computed(() => {
  if (storyParagraphs.value.length <= 1) return storyParagraphs.value
  return storyParagraphs.value.slice(0, storyParagraphs.value.length - 1)
})

const blessingText = computed(() => {
  if (storyParagraphs.value.length <= 1) return ''
  return storyParagraphs.value[storyParagraphs.value.length - 1]
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
  return (currentLanguage.value === 'en' && props.entry.annualFeastsEn?.length
    ? props.entry.annualFeastsEn
    : props.entry.annualFeasts) || []
})

const displayMonthlyFeasts = computed(() => {
  if (!props.entry) return []
  return (currentLanguage.value === 'en' && props.entry.monthlyFeastsEn?.length
    ? props.entry.monthlyFeastsEn
    : props.entry.monthlyFeasts) || []
})
</script>

<template>
  <div v-if="entry" class="w-full pt-4 pb-12">
    <article>
      <div class="text-center pt-2 pb-4">
        <div class="text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--accent)] font-latin-body">
          {{ currentLanguage === 'am' ? 'መጽሐፈ ስንክሳር' : 'The Synaxarium' }}
        </div>
        <h1 class="text-2xl sm:text-[27px] font-bold tracking-tight text-[var(--text)] mt-2 font-ethiopic-serif leading-snug">
          {{ displayTitle }}
        </h1>
        <div class="text-xs font-medium text-[var(--text-3)] mt-2 font-latin-body">
          {{ readingMinutes }}
        </div>

        <blockquote v-if="displayScripture" class="mt-4 px-4 text-center">
          <p class="text-stone-700 dark:text-stone-300 font-light text-[15.5px] leading-relaxed italic font-ethiopic-serif">
            «{{ displayScripture.verse }}»
          </p>
          <cite class="block mt-1 font-semibold text-xs tracking-wider not-italic text-[var(--rubric)] font-ethiopic-serif">
            — {{ displayScripture.reference }}
          </cite>
        </blockquote>
      </div>

      <div class="flex items-center justify-center gap-1.5 my-5">
        <i class="w-1 h-1 rounded-full bg-[var(--ink)] opacity-55"></i>
        <i class="w-1 h-1 rounded-full bg-[var(--ink)] opacity-55"></i>
        <i class="w-1.5 h-1.5 rounded-full bg-[var(--rubric)]"></i>
        <i class="w-1 h-1 rounded-full bg-[var(--ink)] opacity-55"></i>
        <i class="w-1 h-1 rounded-full bg-[var(--ink)] opacity-55"></i>
      </div>

      <div class="story-body space-y-3.5 text-[var(--text)] text-[17px] sm:text-[17.5px] leading-[1.95] font-ethiopic-serif">
        <p
          v-for="(para, idx) in bodyParagraphs"
          :key="idx"
          :class="{ 'first-drop': idx === 0 }"
        >
          {{ para }}
        </p>
      </div>

      <template v-if="blessingText">
        <div class="flex items-center justify-center gap-1.5 my-5">
          <i class="w-1 h-1 rounded-full bg-[var(--ink)] opacity-55"></i>
          <i class="w-1 h-1 rounded-full bg-[var(--ink)] opacity-55"></i>
          <i class="w-1.5 h-1.5 rounded-full bg-[var(--rubric)]"></i>
          <i class="w-1 h-1 rounded-full bg-[var(--ink)] opacity-55"></i>
          <i class="w-1 h-1 rounded-full bg-[var(--ink)] opacity-55"></i>
        </div>
        <p class="text-center font-medium text-[15.5px] leading-relaxed text-[var(--rubric)] font-ethiopic-serif">
          {{ blessingText }}
        </p>
      </template>
    </article>

    <section v-if="displayAnnualFeasts.length || displayMonthlyFeasts.length" class="mt-8 pt-2 border-t border-[var(--line)]">
      <div v-if="displayAnnualFeasts.length" class="mb-5">
        <h4 class="mt-4 mb-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--accent)] font-latin-body">
          {{ currentLanguage === 'am' ? `ዓመታዊ በዓላት · ${numberToGeez(displayAnnualFeasts.length)}` : `Annual Feasts · ${displayAnnualFeasts.length}` }}
        </h4>
        <ul class="divide-y divide-[var(--line)]">
          <li
            v-for="(feast, idx) in displayAnnualFeasts"
            :key="idx"
            class="flex items-baseline gap-2.5 py-2 text-[15px] font-medium text-[var(--text)] font-ethiopic-serif"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-[var(--rubric)] -translate-y-0.5 shrink-0"></span>
            <span>{{ feast }}</span>
          </li>
        </ul>
      </div>

      <div v-if="displayMonthlyFeasts.length">
        <h4 class="mt-4 mb-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--accent)] font-latin-body">
          {{ currentLanguage === 'am' ? `ወርኃዊ በዓላት · ${numberToGeez(displayMonthlyFeasts.length)}` : `Monthly Feasts · ${displayMonthlyFeasts.length}` }}
        </h4>
        <ul class="divide-y divide-[var(--line)]">
          <li
            v-for="(feast, idx) in displayMonthlyFeasts"
            :key="idx"
            class="flex items-baseline gap-2.5 py-2 text-[15px] font-medium text-[var(--text)] font-ethiopic-serif"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-[var(--ink)] opacity-60 -translate-y-0.5 shrink-0"></span>
            <span>{{ feast }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.first-drop::first-letter {
  float: left;
  font-size: 3.2em;
  line-height: 0.82;
  font-weight: 700;
  color: var(--rubric);
  margin: 7px 10px 0 0;
  font-family: inherit;
}
</style>

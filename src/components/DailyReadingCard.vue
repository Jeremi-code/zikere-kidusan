<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SynaxariumEntry } from '../lib/types'
import { currentLanguage, currentFontSize, isBookmarked, toggleBookmarkItem } from '../lib/preferences'
import { Bookmark, Share2, Check, ScrollText, Sparkles, Globe, CalendarDays, Clock, BookOpen } from 'lucide-vue-next'

const props = defineProps<{
  entry?: SynaxariumEntry
  dateLabel: string
}>()

const isCopied = ref(false)

const bookmarked = computed(() => {
  if (!props.entry) return false
  return isBookmarked(props.entry.month, props.entry.day)
})

const fontSizeClass = computed(() => {
  switch (currentFontSize.value) {
    case 'sm':
      return 'text-sm'
    case 'lg':
      return 'text-lg'
    case 'xl':
      return 'text-xl'
    default:
      return 'text-base'
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

const displayScripture = computed(() => {
  if (!props.entry) return null
  return currentLanguage.value === 'en' && props.entry.scriptureEn ? props.entry.scriptureEn : props.entry.scripture
})

const annualFeastsList = computed(() => {
  if (!props.entry) return []
  return currentLanguage.value === 'en' && props.entry.annualFeastsEn ? props.entry.annualFeastsEn : props.entry.annualFeasts
})

const monthlyFeastsList = computed(() => {
  if (!props.entry) return []
  return currentLanguage.value === 'en' && props.entry.monthlyFeastsEn ? props.entry.monthlyFeastsEn : props.entry.monthlyFeasts
})

const hymnMeaning = computed(() => {
  if (!props.entry?.hymn) return ''
  return currentLanguage.value === 'en' && props.entry.hymn.meaningEn ? props.entry.hymn.meaningEn : props.entry.hymn.meaning
})

function copyReading() {
  if (!props.entry) return
  const text = `${props.dateLabel}\n\n${displayTitle.value}\n\n${displayStory.value}`
  navigator.clipboard.writeText(text)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}

function handleToggleBookmark() {
  if (!props.entry) return
  toggleBookmarkItem({
    id: props.entry.id,
    month: props.entry.month,
    day: props.entry.day,
    title: props.entry.title,
    titleEn: props.entry.titleEn,
    dateLabel: props.dateLabel
  })
}
</script>

<template>
  <div v-if="entry" class="space-y-4">
    <article class="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-amber-200/80 transition-colors">
      <div class="flex items-center justify-between pb-4 border-b border-stone-200/70">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
          <Sparkles class="w-3.5 h-3.5 text-amber-700" />
          {{ dateLabel }}
        </span>

        <div class="flex items-center gap-1.5">
          <button
            @click="currentLanguage = currentLanguage === 'am' ? 'en' : 'am'"
            class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all"
            :class="currentLanguage === 'en' ? 'bg-amber-800 text-white border-amber-800' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'"
          >
            <Globe class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'am' ? 'English' : 'አማርኛ' }}</span>
          </button>

          <button
            @click="handleToggleBookmark"
            class="p-2 rounded-lg hover:bg-stone-100 active:scale-95 transition-all text-stone-600"
            :title="bookmarked ? 'አስቀምጥ ተሰርዟል' : 'አስቀምጥ'"
          >
            <Bookmark class="w-4 h-4" :class="{ 'fill-amber-600 text-amber-600': bookmarked }" />
          </button>

          <button
            @click="copyReading"
            class="p-2 rounded-lg hover:bg-stone-100 active:scale-95 transition-all text-stone-600"
            title="ጽሑፉን ቅዳ"
          >
            <Check v-if="isCopied" class="w-4 h-4 text-emerald-600" />
            <Share2 v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="mt-4 space-y-2">
        <h2 class="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
          {{ displayTitle }}
        </h2>
        <p v-if="displaySubtitle" class="text-sm font-medium text-amber-800">
          {{ displaySubtitle }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
        <div v-if="annualFeastsList.length" class="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70">
          <div class="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wide mb-2">
            <CalendarDays class="w-4 h-4 text-amber-700" />
            <span>{{ currentLanguage === 'am' ? 'ዓመታዊ በዓላት' : 'Annual Feasts' }}</span>
          </div>
          <ul class="space-y-1">
            <li
              v-for="(feast, idx) in annualFeastsList"
              :key="idx"
              class="text-xs sm:text-sm text-stone-800 flex items-start gap-1.5"
            >
              <span class="text-amber-700 font-bold">•</span>
              <span>{{ feast }}</span>
            </li>
          </ul>
        </div>

        <div v-if="monthlyFeastsList.length" class="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/70">
          <div class="flex items-center gap-1.5 text-xs font-bold text-sky-950 uppercase tracking-wide mb-2">
            <Clock class="w-4 h-4 text-sky-700" />
            <span>{{ currentLanguage === 'am' ? 'ወርሃዊ በዓላት' : 'Monthly Feasts' }}</span>
          </div>
          <ul class="space-y-1">
            <li
              v-for="(feast, idx) in monthlyFeastsList"
              :key="idx"
              class="text-xs sm:text-sm text-stone-800 flex items-start gap-1.5"
            >
              <span class="text-sky-700 font-bold">•</span>
              <span>{{ feast }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="entry.hymn" class="mt-5 p-5 rounded-xl bg-gradient-to-br from-amber-100/70 to-orange-50 border border-amber-300/80 shadow-inner">
        <div class="flex items-center gap-2 mb-2 text-amber-900">
          <ScrollText class="w-4 h-4 text-amber-800" />
          <h3 class="text-sm font-bold">
            {{ currentLanguage === 'en' && entry.hymn.titleEn ? entry.hymn.titleEn : entry.hymn.title }}
          </h3>
        </div>
        <p class="text-base sm:text-lg font-serif font-medium text-stone-900 leading-relaxed italic">
          « {{ entry.hymn.geezText }} »
        </p>
        <p v-if="hymnMeaning" class="text-xs text-stone-600 mt-3 pt-2.5 border-t border-amber-300/50 leading-relaxed">
          <strong class="text-stone-800">{{ currentLanguage === 'am' ? 'ትርጉም፦' : 'Translation:' }}</strong> {{ hymnMeaning }}
        </p>
      </div>

      <div class="mt-6 pt-5 border-t border-stone-100">
        <h3 class="text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5">
          <span>{{ currentLanguage === 'am' ? 'ዜና ቅዱሳን (ገድል)' : 'Lives of the Saints (Synaxarium)' }}</span>
        </h3>
        <p 
          class="text-stone-700 leading-relaxed whitespace-pre-line text-justify transition-all"
          :class="fontSizeClass"
        >
          {{ displayStory }}
        </p>
      </div>

      <div v-if="displayScripture" class="mt-6 p-4 rounded-xl bg-amber-50/60 border border-amber-200/70">
        <div class="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
          <BookOpen class="w-4 h-4 text-amber-700" />
          <span>{{ currentLanguage === 'am' ? 'የዕለቱ የወንጌል ቃል' : 'Daily Scripture Reading' }}</span>
        </div>
        <p class="text-sm sm:text-base text-stone-800 font-serif italic leading-relaxed">
          « {{ displayScripture.verse }} »
        </p>
        <p class="text-xs font-semibold text-amber-800 mt-2 text-right">
          — ({{ displayScripture.reference }})
        </p>
      </div>
    </article>
  </div>
</template>

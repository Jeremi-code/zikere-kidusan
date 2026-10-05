<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SynaxariumEntry } from '../lib/types'
import { currentLanguage, currentFontSize } from '../lib/preferences'
import { Sparkles, CalendarDays, Clock, BookOpen, Volume2, Maximize2 } from 'lucide-vue-next'
import ReadingTabBar, { type ReadingTab } from './ReadingTabBar.vue'
import EthiopianCross from './EthiopianCross.vue'
import HaragDivider from './HaragDivider.vue'

const props = defineProps<{
  entry?: SynaxariumEntry
  dateLabel: string
}>()

const activeTab = ref<ReadingTab>('story')
const isIconExpanded = ref(false)
const selectedImage = ref<string | null>(null)
const isAudioPlaying = ref(false)

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

const totalFeastsCount = computed(() => {
  return annualFeastsList.value.length + monthlyFeastsList.value.length
})

const hymnMeaning = computed(() => {
  if (!props.entry?.hymn) return ''
  return currentLanguage.value === 'en' && props.entry.hymn.meaningEn ? props.entry.hymn.meaningEn : props.entry.hymn.meaning
})

const readingTimeEstimate = computed(() => {
  const words = displayStory.value.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 130))
  return `${minutes} ደቂቃ ንባብ`
})

function toggleAudio() {
  isAudioPlaying.value = !isAudioPlaying.value
}

function openLightbox(imgSrc: string) {
  selectedImage.value = imgSrc
  isIconExpanded.value = true
}
</script>

<template>
  <div v-if="entry" class="space-y-4 sm:space-y-5">
    <section class="hero-spotlight rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-lg border-2 transition-all">
      <div class="relative z-10 space-y-3.5">
        <div class="flex items-center justify-between">
          <div class="hero-pill-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-2xs font-ethiopic-serif">
            <EthiopianCross variant="lalibela" :size="14" />
            <span>{{ dateLabel }}</span>
          </div>

          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full hero-pill-badge border font-ethiopic-sans">
            {{ readingTimeEstimate }}
          </span>
        </div>

        <div class="space-y-1.5 pt-1">
          <h2 class="hero-title text-xl sm:text-3xl font-bold font-ethiopic-serif leading-snug tracking-tight">
            {{ displayTitle }}
          </h2>
          <p v-if="displaySubtitle" class="hero-subtitle text-xs sm:text-sm font-medium font-ethiopic-serif italic">
            — {{ displaySubtitle }} —
          </p>
        </div>

        <div class="pt-2 flex flex-wrap items-center gap-2">
          <button
            @click="activeTab = 'story'"
            class="hero-btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer font-ethiopic-serif"
          >
            <BookOpen class="w-4 h-4" />
            <span>አንብብ (Read)</span>
          </button>

          <button
            @click="toggleAudio"
            class="hero-btn-secondary flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer font-ethiopic-serif"
          >
            <Volume2 class="w-4 h-4" :class="{ 'animate-pulse text-amber-500': isAudioPlaying }" />
            <span>{{ isAudioPlaying ? 'ድምጽ በማጫወት ላይ...' : 'የዕለቱ ዜማ' }}</span>
          </button>
        </div>
      </div>
    </section>

    <ReadingTabBar
      v-model:active-tab="activeTab"
      :has-hymn="Boolean(entry.hymn)"
      :has-scripture="Boolean(displayScripture)"
      :feasts-count="totalFeastsCount"
    />

    <article class="reading-folio rounded-3xl p-5 sm:p-7 manuscript-card border-2 transition-all">
      <div v-if="activeTab === 'story'" class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-amber-800/20">
          <h3 class="text-sm font-bold font-ethiopic-serif rubric-text uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen class="w-4 h-4" />
            <span>{{ currentLanguage === 'am' ? 'ዜና ቅዱሳን (ስንክሳር)' : 'Lives of the Saints' }}</span>
          </h3>
          <span class="text-xs text-stone-500 dark:text-stone-400 font-latin-display">Folio Reading</span>
        </div>

        <div class="font-ethiopic-serif text-stone-900 dark:text-stone-100 whitespace-pre-line text-justify leading-loose" :class="fontSizeClass">
          <span class="float-left text-4xl sm:text-5xl font-bold rubric-text mr-2.5 leading-none font-ethiopic-serif">
            {{ storyDropCap.initial }}
          </span>
          <span>{{ storyDropCap.rest }}</span>
        </div>

        <HaragDivider variant="divider" />
      </div>

      <div v-else-if="activeTab === 'feasts'" class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-amber-800/20">
          <h3 class="text-sm font-bold font-ethiopic-serif rubric-text uppercase tracking-wider flex items-center gap-1.5">
            <CalendarDays class="w-4 h-4" />
            <span>{{ currentLanguage === 'am' ? 'የዕለቱ በዓላት ዝርዝር' : 'Daily Commemorations' }}</span>
          </h3>
          <span class="text-xs text-stone-500 dark:text-stone-400 font-latin-display">{{ totalFeastsCount }} Feasts</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div v-if="annualFeastsList.length" class="annual-card p-4 sm:p-5 rounded-2xl border shadow-2xs">
            <div class="flex items-center gap-2 text-xs font-bold rubric-text uppercase tracking-wide mb-3 font-ethiopic-serif">
              <CalendarDays class="w-4 h-4" />
              <span>{{ currentLanguage === 'am' ? 'ዓመታዊ በዓላት' : 'Annual Feasts' }}</span>
            </div>
            <ul class="space-y-2 font-ethiopic-serif">
              <li
                v-for="(feast, idx) in annualFeastsList"
                :key="idx"
                class="text-xs sm:text-sm text-stone-900 dark:text-stone-100 flex items-start gap-2"
              >
                <span class="rubric-text font-bold">፨</span>
                <span>{{ feast }}</span>
              </li>
            </ul>
          </div>

          <div v-if="monthlyFeastsList.length" class="monthly-card p-4 sm:p-5 rounded-2xl border shadow-2xs">
            <div class="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide mb-3 font-ethiopic-serif">
              <Clock class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{{ currentLanguage === 'am' ? 'ወርሃዊ በዓላት' : 'Monthly Feasts' }}</span>
            </div>
            <ul class="space-y-2 font-ethiopic-serif">
              <li
                v-for="(feast, idx) in monthlyFeastsList"
                :key="idx"
                class="text-xs sm:text-sm text-stone-900 dark:text-stone-100 flex items-start gap-2"
              >
                <span class="text-indigo-600 dark:text-indigo-400 font-bold">፨</span>
                <span>{{ feast }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'hymn'" class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-amber-800/20">
          <h3 class="text-sm font-bold font-ethiopic-serif rubric-text uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles class="w-4 h-4" />
            <span>{{ currentLanguage === 'am' ? 'የማሕሌት ዜማ (ስብሐት)' : 'Liturgical Hymn' }}</span>
          </h3>
          <span class="text-xs gold-accent font-ethiopic-serif font-bold">ግዕዝ</span>
        </div>

        <div v-if="entry.hymn" class="hymn-card p-5 sm:p-7 rounded-2xl border shadow-2xs space-y-4">
          <div class="text-center font-ethiopic-serif">
            <span class="text-xs font-bold rubric-text uppercase tracking-widest">
              {{ currentLanguage === 'en' && entry.hymn.titleEn ? entry.hymn.titleEn : entry.hymn.title }}
            </span>
          </div>

          <p class="text-lg sm:text-2xl font-ethiopic-serif font-bold text-stone-900 dark:text-amber-100 leading-loose italic text-center px-2 py-2">
            « {{ entry.hymn.geezText }} »
          </p>

          <div v-if="hymnMeaning" class="pt-4 border-t border-amber-300/50 dark:border-amber-800/40 font-ethiopic-serif">
            <h4 class="text-xs font-bold text-amber-950 dark:text-amber-200 mb-1.5">
              {{ currentLanguage === 'am' ? 'ትርጉም፦' : 'Translation:' }}
            </h4>
            <p class="text-xs sm:text-sm text-stone-800 dark:text-stone-300 leading-relaxed">
              {{ hymnMeaning }}
            </p>
          </div>
        </div>

        <div v-else class="py-12 text-center text-stone-400 font-ethiopic-serif">
          <p>ለዚህ ዕለት የተለየ የማሕሌት ዜማ አልተመዘገበም</p>
        </div>
      </div>

      <div v-else-if="activeTab === 'scripture'" class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-amber-800/20">
          <h3 class="text-sm font-bold font-ethiopic-serif rubric-text uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen class="w-4 h-4" />
            <span>{{ currentLanguage === 'am' ? 'የዕለቱ የወንጌል ቃል' : 'Daily Gospel Reading' }}</span>
          </h3>
          <span class="text-xs text-stone-500 dark:text-stone-400 font-latin-display">Lectionary</span>
        </div>

        <div v-if="displayScripture" class="scripture-card p-5 sm:p-7 rounded-2xl border shadow-2xs space-y-4">
          <p class="text-base sm:text-xl text-stone-900 dark:text-stone-100 font-ethiopic-serif italic leading-loose text-center px-2">
            « {{ displayScripture.verse }} »
          </p>

          <div class="text-right border-t border-amber-200/70 dark:border-stone-800 pt-3">
            <span class="text-xs sm:text-sm font-bold rubric-text font-ethiopic-serif">
              — {{ displayScripture.reference }}
            </span>
          </div>
        </div>

        <div v-else class="py-12 text-center text-stone-400 font-ethiopic-serif">
          <p>የወንጌል ንባብ በቅርቡ ይቀርባል</p>
        </div>
      </div>

      <div v-else-if="activeTab === 'art'" class="space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-amber-800/20">
          <h3 class="text-sm font-bold font-ethiopic-serif rubric-text uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles class="w-4 h-4" />
            <span>{{ currentLanguage === 'am' ? 'ጥንታዊ የኢትዮጵያ ሥነ-ሥዕል' : 'Ancient Sacred Art Gallery' }}</span>
          </h3>
          <span class="text-xs text-stone-500 dark:text-stone-400 font-latin-display">17th C. Gondar</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            @click="openLightbox('/assets/art/mary_christ_icon.jpg')"
            class="group rounded-2xl overflow-hidden border-2 border-amber-700/40 bg-stone-900 shadow-md cursor-pointer relative"
          >
            <img 
              src="/assets/art/mary_christ_icon.jpg" 
              alt="Virgin Mary with Christ Child Icon" 
              class="w-full h-56 object-cover object-top group-hover:scale-103 transition-transform duration-300"
            />
            <div class="p-3 bg-gradient-to-t from-black via-black/80 to-transparent absolute bottom-0 inset-x-0 text-white font-ethiopic-serif">
              <h4 class="text-sm font-bold text-amber-200 flex items-center justify-between">
                <span>ማርያም ፡ ምስለ ፡ ወልዳ ፡ ፍቁር</span>
                <Maximize2 class="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </h4>
              <p class="text-[11px] text-stone-300 font-latin-display mt-0.5">17th C. Gondarine Manuscript Miniature</p>
            </div>
          </div>

          <div 
            @click="openLightbox('/assets/art/harag_header.jpg')"
            class="group rounded-2xl overflow-hidden border-2 border-amber-700/40 bg-stone-900 shadow-md cursor-pointer relative"
          >
            <img 
              src="/assets/art/harag_header.jpg" 
              alt="16th C. Biranna Harag Illumination" 
              class="w-full h-56 object-cover object-center group-hover:scale-103 transition-transform duration-300"
            />
            <div class="p-3 bg-gradient-to-t from-black via-black/80 to-transparent absolute bottom-0 inset-x-0 text-white font-ethiopic-serif">
              <h4 class="text-sm font-bold text-amber-200 flex items-center justify-between">
                <span>የብራና ሐረግ ወመስቀል</span>
                <Maximize2 class="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </h4>
              <p class="text-[11px] text-stone-300 font-latin-display mt-0.5">16th C. Lalibela Cross & Interlaced Ribbons</p>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-2xl annual-card border font-ethiopic-serif text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
          <strong class="rubric-text">የሥነ-ሥዕል ትውፊት፦</strong> በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ሥርዓት ቅዱሳን ሁለቱም ዓይኖቻቸው በቅንነት እና በፍጹም መንፈሳዊ ንቃት ወደ አማኙ ትኩር ብለው እንደሚመለከቱ ሆነው ይሳላሉ።
        </div>
      </div>
    </article>

    <div 
      v-if="isIconExpanded && selectedImage"
      @click="isIconExpanded = false"
      class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
    >
      <div class="max-w-md w-full bg-stone-900 rounded-3xl p-3 border-2 border-amber-500/50 shadow-2xl space-y-3" @click.stop>
        <img 
          :src="selectedImage" 
          alt="Expanded Sacred Art" 
          class="w-full h-auto rounded-2xl"
        />
        <div class="text-center font-ethiopic-serif p-2">
          <button 
            @click="isIconExpanded = false"
            class="px-5 py-2 rounded-xl bg-amber-900 text-amber-100 text-xs font-bold cursor-pointer hover:bg-amber-800 shadow-sm transition-colors"
          >
            ዝጋ (Close)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { 
  getTodayEthiopian, 
  numberToGeez, 
  ethiopianToJDN, 
  jdnToEthiopian, 
  getWeekdayFromJDN,
  type EthiopianDate 
} from './lib/ethiopianCalendar'
import { synaxariumData } from './lib/synaxariumData'
import type { SynaxariumEntry } from './lib/types'
import { 
  currentTheme, 
  applyThemeToDocument,
  isBookmarked,
  toggleBookmarkItem
} from './lib/preferences'
import { Bookmark } from 'lucide-vue-next'
import EthiopianDatePicker from './components/EthiopianDatePicker.vue'
import SearchModal from './components/SearchModal.vue'
import BookmarksView from './components/BookmarksView.vue'
import SettingsView from './components/SettingsView.vue'

const allReadings = synaxariumData as SynaxariumEntry[]
const currentDate = ref<EthiopianDate>(getTodayEthiopian())

const isDatePickerOpen = ref(false)
const isSearchOpen = ref(false)

const activeTabIndex = ref(0)
const isCapsuleSmall = ref(false)
const isSearchActive = ref(false)

const isExit = ref(false)
const isLanded = ref(false)

const scroller = ref<HTMLElement | null>(null)
const stripRow = ref<HTMLElement | null>(null)
const dotsLayer = ref<HTMLElement | null>(null)

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

const titleLetters = [...'ዝክረ ቅዱሳን']

const gregorianDateString = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('en-GB', { weekday: 'long' }) + ' · ' +
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const curJdn = ethiopianToJDN(currentDate.value.year, currentDate.value.month, currentDate.value.day)
  const list = []
  for (let k = -4; k <= 4; k++) {
    const jdn = curJdn + k
    const eth = jdnToEthiopian(jdn)
    const wd = getWeekdayFromJDN(jdn)
    list.push({
      k,
      year: eth.year,
      month: eth.month,
      day: eth.day,
      geezDay: numberToGeez(eth.day),
      weekdayShort: wd.shortAm,
      isToday: k === 0,
      isPeek: Math.abs(k) === 4
    })
  }
  return list
})

const currentReading = computed(() => {
  return allReadings.find(
    (e) => e.month === currentDate.value.month && e.day === currentDate.value.day
  )
})

const storyParagraphs = computed(() => {
  if (!currentReading.value) return []
  const val = currentReading.value.story
  if (!val) return []
  const text = Array.isArray(val) ? val.filter(Boolean).join('\n\n') : String(val)
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
})

const storyBodyParagraphs = computed(() => {
  if (storyParagraphs.value.length <= 1) return storyParagraphs.value
  return storyParagraphs.value.slice(0, -1)
})

const storyBlessing = computed(() => {
  if (storyParagraphs.value.length <= 1) return ''
  return storyParagraphs.value[storyParagraphs.value.length - 1]
})

function handleSelectDate({ year, month, day }: { year?: number; month: number; day: number }) {
  const targetYear = year ?? currentDate.value.year
  const jdn = ethiopianToJDN(targetYear, month, day)
  const eth = jdnToEthiopian(jdn)
  const wd = getWeekdayFromJDN(jdn)
  currentDate.value = {
    year: eth.year,
    month: eth.month,
    day: eth.day,
    monthName: eth.monthNameAm,
    monthNameEn: eth.monthNameEn,
    geezDay: numberToGeez(eth.day),
    geezYear: numberToGeez(eth.year),
    formatted: `${eth.monthNameAm} ${numberToGeez(eth.day)} ቀን ${eth.year} ዓ.ም`,
    weekdayNameAm: wd.nameAm,
    weekdayNameEn: wd.nameEn,
    weekdayShortAm: wd.shortAm,
    weekdayShortEn: wd.shortEn
  }
}

function handlePickDay(k: number) {
  const curJdn = ethiopianToJDN(currentDate.value.year, currentDate.value.month, currentDate.value.day)
  const targetJdn = curJdn + k
  const eth = jdnToEthiopian(targetJdn)
  handleSelectDate({ year: eth.year, month: eth.month, day: eth.day })
}

function flyDots() {
  if (!dotsLayer.value || !stripRow.value) return
  const slots = dotsLayer.value.querySelectorAll<HTMLElement>('.slot')
  slots.forEach((slot) => {
    const k = slot.dataset.day
    const mk = stripRow.value?.querySelector<HTMLElement>(`.day[data-k="${k}"] .mk`)
    if (mk) {
      const a = slot.getBoundingClientRect()
      const b = mk.getBoundingClientRect()
      const tx = b.left + b.width / 2 - (a.left + a.width / 2)
      const ty = b.top + b.height / 2 - (a.top + a.height / 2)
      slot.style.transform = `translate(${tx}px, ${ty}px) scale(${b.width / a.width})`
      if (Math.abs(Number(k)) === 4) slot.style.opacity = '0.3'
    }
  })
}

const isCurrentSaved = computed(() => {
  return isBookmarked(currentDate.value.month, currentDate.value.day)
})

function toggleCurrentReadingBookmark() {
  if (!currentReading.value) return
  toggleBookmarkItem({
    id: `${currentDate.value.month}_${currentDate.value.day}`,
    month: currentDate.value.month,
    day: currentDate.value.day,
    year: currentDate.value.year,
    title: currentReading.value.title,
    titleEn: currentReading.value.titleEn,
    dateLabel: `${currentDate.value.monthName} ${currentDate.value.geezDay}`
  })
}

function handleTabClick(idx: number) {
  if (isCapsuleSmall.value) {
    isCapsuleSmall.value = false
    return
  }
  isSearchActive.value = false
  if (activeTabIndex.value === idx && idx === 0) {
    currentDate.value = getTodayEthiopian()
  } else {
    activeTabIndex.value = idx
  }
  if (scroller.value) {
    scroller.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function handleSelectBookmark(date: { month: number; day: number; year?: number }) {
  handleSelectDate(date)
  activeTabIndex.value = 0
  if (scroller.value) {
    scroller.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function handleSelectFromSearch(date: { month: number; day: number; year?: number }) {
  handleSelectDate(date)
  activeTabIndex.value = 0
  isSearchOpen.value = false
  isSearchActive.value = false
  if (scroller.value) {
    scroller.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function toggleSearch() {
  isSearchActive.value = !isSearchActive.value
  isSearchOpen.value = isSearchActive.value
}

let lastScroll = 0
function handleScroll() {
  if (!scroller.value) return
  const y = scroller.value.scrollTop
  if (Math.abs(y - lastScroll) < 6) return
  isCapsuleSmall.value = y > lastScroll && y > 48
  lastScroll = y
}

onMounted(() => {
  applyThemeToDocument(currentTheme.value)

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const exitAt = reduced ? 0 : 500

  setTimeout(() => {
    isExit.value = true
    nextTick(flyDots)
  }, exitAt)

  setTimeout(() => {
    isLanded.value = true
  }, exitAt + (reduced ? 50 : 560))
})
</script>

<template>
  <div class="run" :class="{ 'is-exit': isExit, 'is-landed': isLanded }">
    <!-- Home Layer -->
    <main class="home">
      <div ref="scroller" class="scroll" @scroll="handleScroll">
        <div class="scroll-content">
          <header class="h-top rv" style="--rd:.2s">
          <div class="h-brand">
            <svg viewBox="0 0 512 512" class="w-6 h-6">
              <circle
                v-for="(p, i) in DOTS"
                :key="i"
                :cx="256 + p.dx"
                :cy="256 + p.dy"
                :r="p.r"
                :fill="p.red ? 'var(--rubric)' : 'var(--ink)'"
              />
            </svg>
            <span>ዝክረ ቅዱሳን</span>
          </div>
        </header>

        <template v-if="activeTabIndex === 0">
          <section 
            class="h-hero rv cursor-pointer hover:opacity-90 transition-opacity" 
            style="--rd:.12s"
            @click="isDatePickerOpen = true"
            title="የቀን መቁጠሪያ ይክፈቱ (Open Calendar)"
          >
            <div class="h-day">{{ currentDate.geezDay }}</div>
            <div>
              <div class="h-wd">{{ currentDate.weekdayNameAm }}</div>
              <div class="h-mo">{{ currentDate.monthName }} {{ currentDate.geezYear }}</div>
              <div class="h-gr">{{ gregorianDateString }}</div>
            </div>
          </section>

          <nav class="strip" aria-label="ሳምንት">
            <div ref="stripRow" class="strip-row">
              <button
                v-for="d in calendarDays"
                :key="d.k"
                :data-k="d.k"
                class="day"
                :class="{ today: d.isToday, peek: d.isPeek }"
                @click="handlePickDay(d.k)"
              >
                <span class="wd rv" :style="{ '--rd': `${0.22 + Math.abs(d.k) * 0.015}s` }">{{ d.weekdayShort }}</span>
                <span class="n rv" :style="{ '--rd': `${0.24 + Math.abs(d.k) * 0.015}s` }">{{ d.geezDay }}</span>
                <span class="mk"></span>
              </button>
            </div>
          </nav>

          <template v-if="currentReading">
            <article class="h-read rv" style="--rd:.28s">
              <div class="h-read-header">
                <div class="k">መጽሐፈ ስንክሳር</div>
                <button
                  type="button"
                  class="h-bookmark-btn"
                  :class="{ active: isCurrentSaved }"
                  @click="toggleCurrentReadingBookmark"
                  :title="isCurrentSaved ? 'ከዕልባት አስወግድ' : 'በዕልባት አስቀምጥ'"
                  aria-label="ዕልባት"
                >
                  <Bookmark class="w-3.5 h-3.5" :fill="isCurrentSaved ? 'currentColor' : 'none'" />
                  <span>{{ isCurrentSaved ? 'ተቀምጧል' : 'አስቀምጥ' }}</span>
                </button>
              </div>
              <h2>{{ currentReading.title }}</h2>

              <blockquote v-if="currentReading.scripture" class="verse">
                {{ currentReading.scripture.verse }}
                <cite>{{ currentReading.scripture.reference }}</cite>
              </blockquote>

              <p 
                v-for="(para, idx) in storyBodyParagraphs" 
                :key="idx"
                :class="{ drop: idx === 0 }"
              >
                {{ para }}
              </p>

              <template v-if="storyBlessing">
                <div class="sep">
                  <i></i><i></i><i class="r"></i><i></i><i></i>
                </div>
                <p class="blessing">{{ storyBlessing }}</p>
              </template>
            </article>

            <div v-if="currentReading.annualFeasts?.length" class="h-label rv" style="--rd:.34s">
              ዓመታዊ በዓላት · {{ numberToGeez(currentReading.annualFeasts.length) }}
            </div>
            <ul v-if="currentReading.annualFeasts?.length" class="h-list rv" style="--rd:.37s">
              <li v-for="(f, i) in currentReading.annualFeasts" :key="i">
                <div>{{ f }}<small v-if="currentReading.annualFeastsEn?.[i]">{{ currentReading.annualFeastsEn[i] }}</small></div>
              </li>
            </ul>

            <div v-if="currentReading.monthlyFeasts?.length" class="h-label rv" style="--rd:.4s">
              ወርኃዊ በዓላት · {{ numberToGeez(currentReading.monthlyFeasts.length) }}
            </div>
            <ul v-if="currentReading.monthlyFeasts?.length" class="h-list monthly rv" style="--rd:.43s">
              <li v-for="(f, i) in currentReading.monthlyFeasts" :key="i">
                <div>{{ f }}<small v-if="currentReading.monthlyFeastsEn?.[i]">{{ currentReading.monthlyFeastsEn[i] }}</small></div>
              </li>
            </ul>
          </template>
          <template v-else>
            <div class="py-12 text-center text-[var(--text-3)] rv">
              የዚህ ዕለት ንባብ አልተገኘም።
            </div>
          </template>
        </template>

        <template v-else-if="activeTabIndex === 1">
          <BookmarksView
            @select="handleSelectBookmark"
            @go-to-today="handleTabClick(0)"
          />
        </template>

        <template v-else-if="activeTabIndex === 2">
          <SettingsView />
        </template>
        </div>
      </div>

      <!-- Navigation Dock -->
      <nav class="nav" style="--rd:.3s" aria-label="ዋና">
        <div
          class="glass capsule"
          :class="{ small: isCapsuleSmall, off: isSearchActive }"
          @click="isCapsuleSmall = false"
        >
          <span
            class="pill"
            :style="{
              transform: `translateX(${activeTabIndex * 100}%)`,
              opacity: isCapsuleSmall || isSearchActive ? 0 : 1
            }"
          ></span>
          <div class="tabs">
            <button
              class="tab"
              :class="{ on: activeTabIndex === 0 && !isSearchActive }"
              @click="handleTabClick(0)"
              aria-label="ዛሬ"
            >
              <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3v18M6 9h12" />
                <path d="M10 3h4M10 21h4M6 7.5v3M18 7.5v3" />
              </svg>
              <span>ዛሬ</span>
            </button>
            <button
              class="tab"
              :class="{ on: activeTabIndex === 1 && !isSearchActive }"
              @click="handleTabClick(1)"
              aria-label="የተቀመጡ"
            >
              <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="3.5" width="13.5" height="15.5" rx="1.8" />
                <path d="M8.2 3.5V19M13.35 7.3v7.4M11.1 9.7h4.5" />
                <g class="acc"><path d="M13.6 19h2.6v2.9l-1.3-1-1.3 1z" /></g>
              </svg>
              <span>የተቀመጡ</span>
            </button>
            <button
              class="tab"
              :class="{ on: activeTabIndex === 2 && !isSearchActive }"
              @click="handleTabClick(2)"
              aria-label="ቅንብር"
            >
              <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>ቅንብር</span>
            </button>
          </div>
        </div>
        <button
          class="glass search"
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
    </main>

    <!-- Splash Layer -->
    <div class="veil"></div>
    <div class="brand" aria-hidden="true">
      <div class="word">
        <span
          v-for="(ch, idx) in titleLetters"
          :key="idx"
          :style="{ '--i': idx }"
        >{{ ch }}</span>
      </div>
      <div class="latin">Zikere · Kidusan</div>
    </div>
    <div ref="dotsLayer" class="dots">
      <div
        v-for="(p, idx) in DOTS"
        :key="idx"
        class="slot"
        :class="{ red: p.red }"
        :data-day="p.day"
        :style="{
          width: `${(p.r * 2 * 148) / 512}px`,
          height: `${(p.r * 2 * 148) / 512}px`,
          left: `calc(50% + ${(p.dx * 148) / 512}px - ${((p.r * 2 * 148) / 512) / 2}px)`,
          top: `calc(50% - 52px + ${(p.dy * 148) / 512}px - ${((p.r * 2 * 148) / 512) / 2}px)`,
          '--d': `${p.d}s`,
          '--fly-d': `${0.02 + (p.day + 4) * 0.014}s`
        }"
      >
        <span class="bleed"></span>
        <span class="ink"></span>
      </div>
    </div>

    <!-- Modals -->
    <EthiopianDatePicker
      :is-open="isDatePickerOpen"
      :current-date="currentDate"
      @close="isDatePickerOpen = false"
      @select="handleSelectDate"
    />

    <SearchModal
      :is-open="isSearchOpen"
      :all-readings="allReadings"
      @close="isSearchOpen = false; isSearchActive = false"
      @select="handleSelectFromSearch"
    />
  </div>
</template>

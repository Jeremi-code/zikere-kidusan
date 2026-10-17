<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SynaxariumEntry } from '../lib/types'
import { t, pick, formatNumber, monthName } from '../lib/i18n'
import { Search, X } from 'lucide-vue-next'
import ZikereLogo from './ZikereLogo.vue'

const props = defineProps<{
  isOpen: boolean
  allReadings: SynaxariumEntry[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', date: { month: number; day: number }): void
}>()

const searchQuery = ref('')
const searchFilter = ref<'all' | 'annual' | 'monthly'>('all')

interface SearchResultItem {
  entry: SynaxariumEntry
  matchedFeast?: string
  feastType?: 'annual' | 'monthly'
  secondaryText?: string
}

// Matches a feast in either language, but returns it in the display language.
function findFeast(q: string, amList: string[] = [], enList: string[] = []): string | undefined {
  let idx = amList.findIndex((f) => f.toLowerCase().includes(q))
  if (idx < 0) idx = enList.findIndex((f) => f.toLowerCase().includes(q))
  if (idx < 0) return undefined
  return pick(amList[idx] ?? enList[idx], enList[idx])
}

const filteredResults = computed<SearchResultItem[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []

  const results: SearchResultItem[] = []

  for (const entry of props.allReadings) {
    const title = pick(entry.title, entry.titleEn)
    const matchedAnnual = findFeast(q, entry.annualFeasts, entry.annualFeastsEn)
    const matchedMonthly = findFeast(q, entry.monthlyFeasts, entry.monthlyFeastsEn)

    const titleMatch = entry.title?.toLowerCase().includes(q) || entry.titleEn?.toLowerCase().includes(q)
    const storyMatch = entry.story?.toLowerCase().includes(q) || entry.storyEn?.toLowerCase().includes(q)
    const scriptureMatch = entry.scripture?.verse?.toLowerCase().includes(q) ||
                           entry.scriptureEn?.verse?.toLowerCase().includes(q) ||
                           entry.scripture?.reference?.toLowerCase().includes(q) ||
                           entry.scriptureEn?.reference?.toLowerCase().includes(q)

    if (searchFilter.value === 'annual') {
      if (!matchedAnnual) continue
      results.push({
        entry,
        matchedFeast: matchedAnnual,
        feastType: 'annual',
        secondaryText: title !== matchedAnnual ? title : undefined
      })
    } else if (searchFilter.value === 'monthly') {
      if (!matchedMonthly) continue
      results.push({
        entry,
        matchedFeast: matchedMonthly,
        feastType: 'monthly',
        secondaryText: title
      })
    } else {
      // In "All", match against feasts or main title (not hidden body text)
      if (!matchedAnnual && !matchedMonthly && !titleMatch) {
        continue
      }
      
      const matchedFeast = matchedAnnual || matchedMonthly
      const feastType = matchedAnnual ? 'annual' : (matchedMonthly ? 'monthly' : undefined)
      const secondaryText = matchedFeast 
        ? (title !== matchedFeast ? title : undefined)
        : undefined

      results.push({
        entry,
        matchedFeast,
        feastType,
        secondaryText
      })
    }

    if (results.length >= 40) break
  }

  return results
})

function handleSelect(entry: SynaxariumEntry) {
  emit('select', { month: entry.month, day: entry.day })
  emit('close')
}

function clearQuery() {
  searchQuery.value = ''
}
</script>

<template>
  <Teleport to="body">
    <Transition name="search">
      <div v-if="isOpen" class="search-backdrop" @click="emit('close')">
        <div class="search-panel" @click.stop>
          <header class="search-header">
            <div class="brand-row">
              <ZikereLogo :size="24" />
              <div>
                <h2 class="title">{{ t('search.title') }}</h2>
                <span class="sub">{{ t('search.subtitle') }}</span>
              </div>
            </div>
            <button @click="emit('close')" class="close-btn" :aria-label="t('common.close')">
              <X class="w-5 h-5" />
            </button>
          </header>

          <div class="search-input-wrap">
            <div class="input-box">
              <Search class="search-ic" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('search.placeholder')"
                class="search-input"
                autofocus
              />
              <button 
                v-if="searchQuery" 
                @click="clearQuery" 
                class="clear-btn"
                :title="t('common.clear')"
                :aria-label="t('common.clear')"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="filter-tabs">
              <div class="tab-group">
                <button
                  @click="searchFilter = 'all'"
                  class="filter-btn"
                  :class="{ active: searchFilter === 'all' }"
                >
                  {{ t('search.filterAll') }}
                </button>
                <button
                  @click="searchFilter = 'annual'"
                  class="filter-btn"
                  :class="{ active: searchFilter === 'annual' }"
                >
                  {{ t('search.filterAnnual') }}
                </button>
                <button
                  @click="searchFilter = 'monthly'"
                  class="filter-btn"
                  :class="{ active: searchFilter === 'monthly' }"
                >
                  {{ t('search.filterMonthly') }}
                </button>
              </div>

              <span v-if="searchQuery" class="results-count">
                {{ t('search.results', { n: filteredResults.length }) }}
              </span>
            </div>
          </div>

          <div class="search-results">
            <div v-if="!searchQuery" class="state-empty">
              <div class="empty-mark">፨</div>
              <p class="state-title">{{ t('search.promptTitle') }}</p>
              <p class="state-sub">{{ t('search.promptSub') }}</p>
            </div>

            <div v-else-if="filteredResults.length === 0" class="state-empty">
              <p class="state-title">{{ t('search.noResultsTitle') }}</p>
              <p class="state-sub">{{ t('search.noResultsSub') }}</p>
            </div>

            <button
              v-for="item in filteredResults"
              :key="item.entry.id + (item.matchedFeast || '')"
              @click="handleSelect(item.entry)"
              class="result-item"
            >
              <div class="date-badge">
                <span class="badge-month">{{ monthName(item.entry.month) }}</span>
                <span class="badge-day">{{ formatNumber(item.entry.day) }}</span>
              </div>

              <div class="entry-details">
                <div class="entry-meta">
                  <span class="entry-chip">
                    {{ monthName(item.entry.month) }} {{ formatNumber(item.entry.day) }}<template v-if="formatNumber(item.entry.day) !== String(item.entry.day)"> ({{ item.entry.day }})</template>
                  </span>
                  <span v-if="item.feastType === 'monthly'" class="feast-pill monthly">
                    {{ t('search.monthlyFeast') }}
                  </span>
                  <span v-else-if="item.feastType === 'annual'" class="feast-pill annual">
                    {{ t('search.annualFeast') }}
                  </span>
                  <span v-else-if="item.entry.annualFeasts?.length" class="feast-pill">
                    {{ t('search.feastCount', { n: item.entry.annualFeasts.length }) }}
                  </span>
                </div>
                <h4 class="entry-title">{{ item.matchedFeast || pick(item.entry.title, item.entry.titleEn) }}</h4>
                <p v-if="item.secondaryText" class="entry-feasts">
                  {{ item.secondaryText }}
                </p>
              </div>
            </button>
          </div>

          <footer class="search-footer">
            <button @click="emit('close')" class="done-btn">
              {{ t('common.close') }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.search-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.55);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.search-panel {
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--line);
  border-radius: 26px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-header {
  padding: 22px 24px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--line);
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
}

.sub {
  display: block;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-top: 2px;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--text-3);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.close-btn:hover {
  background: var(--line);
  color: var(--text);
}

.search-input-wrap {
  padding: 16px 22px 14px;
  border-bottom: 1px solid var(--line);
  background: color-mix(in oklab, var(--surface) 60%, var(--bg));
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-ic {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--accent);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 38px 12px 42px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  font: 500 15px/1.4 var(--font);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 15%, transparent);
}

.search-input::placeholder {
  color: var(--text-3);
  opacity: 0.8;
}

.clear-btn {
  position: absolute;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--text-3);
  cursor: pointer;
  background: var(--line);
}

.filter-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.tab-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-btn {
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-3);
  border: 1px solid transparent;
  transition: all 0.15s;
}

.filter-btn:hover {
  background: var(--surface);
  color: var(--text);
}

.filter-btn.active {
  background: color-mix(in oklab, var(--rubric) 12%, var(--surface));
  border-color: var(--rubric);
  color: var(--rubric);
}

.results-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
}

.search-results {
  padding: 12px 16px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.state-empty {
  padding: 48px 16px;
  text-align: center;
  color: var(--text-3);
}

.empty-mark {
  font-size: 32px;
  color: var(--rubric);
  opacity: 0.45;
  margin-bottom: 8px;
}

.state-title {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--text);
}

.state-sub {
  font-size: 11.5px;
  margin-top: 4px;
  color: var(--text-3);
}

.result-item {
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border-radius: 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.result-item:hover {
  border-color: var(--accent);
  background: color-mix(in oklab, var(--accent) 5%, var(--surface));
}

.date-badge {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: var(--bg);
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge-month {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--rubric);
}

.badge-day {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-top: 1px;
}

.entry-details {
  flex: 1;
  min-width: 0;
}

.entry-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.entry-chip {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--accent);
}

.feast-pill {
  font-size: 9.5px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--text-3);
}

.feast-pill.annual {
  border-color: var(--rubric);
  color: var(--rubric);
  background: color-mix(in oklab, var(--rubric) 10%, var(--bg));
}

.feast-pill.monthly {
  border-color: var(--accent);
  color: var(--accent);
  background: color-mix(in oklab, var(--accent) 10%, var(--bg));
}

.entry-title {
  margin-top: 4px;
  font-size: 14.5px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.entry-feasts {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--line);
  text-align: right;
}

.done-btn {
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.done-btn:hover {
  border-color: var(--rubric);
  color: var(--rubric);
}

/* ═══ Transitions ═══ */
.search-enter-active,
.search-leave-active {
  transition: opacity 0.25s ease;
}

.search-enter-active .search-panel,
.search-leave-active .search-panel {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.search-enter-from,
.search-leave-to {
  opacity: 0;
}

.search-enter-from .search-panel,
.search-leave-to .search-panel {
  transform: scale(0.95) translateY(8px);
}
</style>

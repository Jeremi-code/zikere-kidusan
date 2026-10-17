<script setup lang="ts">
import { ref, computed } from 'vue'
import { ETHIOPIAN_MONTHS, numberToGeez, type EthiopianDate, getTodayEthiopian } from '../lib/ethiopianCalendar'
import { X, RotateCcw } from 'lucide-vue-next'
import ZikereLogo from './ZikereLogo.vue'
import { t, pick, formatNumber, monthName } from '../lib/i18n'

const props = defineProps<{
  isOpen: boolean
  currentDate: EthiopianDate
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', date: { month: number; day: number }): void
}>()

const selectedMonth = ref(props.currentDate.month)

const currentMonthInfo = computed(() => {
  return ETHIOPIAN_MONTHS[selectedMonth.value - 1]
})

const daysInSelectedMonth = computed(() => {
  return currentMonthInfo.value.totalDays(props.currentDate.year)
})

function pickDay(day: number) {
  emit('select', { month: selectedMonth.value, day })
  emit('close')
}

function jumpToToday() {
  const today = getTodayEthiopian()
  emit('select', { month: today.month, day: today.day })
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="picker">
      <div v-if="isOpen" class="picker-backdrop" @click="emit('close')">
        <div class="picker-panel" @click.stop>
          <header class="picker-header">
            <div class="brand-row">
              <ZikereLogo :size="24" />
              <div>
                <h2 class="title">{{ t('picker.title') }}</h2>
                <span class="sub">{{ t('picker.subtitle') }}</span>
              </div>
            </div>
            <button @click="emit('close')" class="close-btn" :aria-label="t('common.close')">
              <X class="w-5 h-5" />
            </button>
          </header>

          <div class="picker-body">
            <!-- Month selector -->
            <div>
              <span class="section-label">{{ t('picker.month') }}</span>
              <div class="month-grid">
                <button
                  v-for="m in ETHIOPIAN_MONTHS"
                  :key="m.id"
                  @click="selectedMonth = m.id"
                  class="month-btn"
                  :class="{ active: selectedMonth === m.id }"
                >
                  <span class="m-am">{{ pick(m.nameAm, m.nameEn) }}</span>
                  <span class="m-en">{{ pick(m.nameEn, m.nameAm) }}</span>
                </button>
              </div>
            </div>

            <!-- Day selector -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="section-label">{{ t('picker.days', { month: monthName(selectedMonth) }) }}</span>
                <span class="text-xs text-[var(--text-3)] font-latin-body">{{ t('picker.dayCount', { n: daysInSelectedMonth }) }}</span>
              </div>
              <div class="days-grid">
                <button
                  v-for="d in daysInSelectedMonth"
                  :key="d"
                  @click="pickDay(d)"
                  class="day-btn"
                  :class="{
                    active: selectedMonth === currentDate.month && d === currentDate.day
                  }"
                >
                  <span class="d-geez">{{ formatNumber(d) }}</span>
                  <span class="d-num">{{ pick(String(d), numberToGeez(d)) }}</span>
                </button>
              </div>
            </div>
          </div>

          <footer class="picker-footer">
            <button @click="jumpToToday" class="today-btn">
              <RotateCcw class="w-3.5 h-3.5" />
              <span>{{ t('picker.today') }}</span>
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.picker-backdrop {
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

.picker-panel {
  width: 100%;
  max-width: 480px;
  max-height: 88vh;
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--line);
  border-radius: 26px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.picker-header {
  padding: 22px 24px 18px;
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

.picker-body {
  padding: 22px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-label {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 10px;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.month-btn {
  padding: 10px 6px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.month-btn:hover {
  border-color: var(--accent);
}

.month-btn.active {
  background: color-mix(in oklab, var(--rubric) 12%, var(--surface));
  border-color: var(--rubric);
  color: var(--rubric);
  font-weight: 700;
}

.m-am {
  font-size: 13px;
  font-weight: 600;
}

.m-en {
  font-size: 9.5px;
  opacity: 0.75;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.day-btn {
  aspect-ratio: 1;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.day-btn:hover {
  border-color: var(--accent);
}

.day-btn.active {
  background: var(--rubric);
  border-color: var(--rubric);
  color: #fff;
  font-weight: 700;
}

.d-geez {
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
}

.d-num {
  font-size: 9.5px;
  opacity: 0.7;
  line-height: 1;
  margin-top: 3px;
}

.picker-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--line);
  background: var(--surface);
  display: flex;
  justify-content: center;
}

.today-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.today-btn:hover {
  border-color: var(--rubric);
  color: var(--rubric);
}

/* ═══ Transitions ═══ */
.picker-enter-active,
.picker-leave-active {
  transition: opacity 0.25s ease;
}

.picker-enter-active .picker-panel,
.picker-leave-active .picker-panel {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.picker-enter-from,
.picker-leave-to {
  opacity: 0;
}

.picker-enter-from .picker-panel,
.picker-leave-to .picker-panel {
  transform: scale(0.95) translateY(8px);
}
</style>

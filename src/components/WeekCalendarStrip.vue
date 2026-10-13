<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { 
  numberToGeez, 
  ethiopianToJDN, 
  jdnToEthiopian, 
  getWeekdayFromJDN,
  type EthiopianDate 
} from '../lib/ethiopianCalendar'

const props = defineProps<{
  currentDate: EthiopianDate
}>()

const emit = defineEmits<{
  (e: 'select-date', date: { year: number; month: number; day: number }): void
}>()

const stripEl = ref<HTMLElement | null>(null)
const rowEl = ref<HTMLElement | null>(null)

const SPAN = 10
const daysList = computed(() => {
  const currentJdn = ethiopianToJDN(props.currentDate.year, props.currentDate.month, props.currentDate.day)
  const today = new Date()
  const todayEth = jdnToEthiopian(Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 864e5) + 2440588)
  const todayJdn = ethiopianToJDN(todayEth.year, todayEth.month, todayEth.day)

  const items = []
  for (let k = -SPAN; k <= SPAN; k++) {
    const targetJdn = currentJdn + k
    const eth = jdnToEthiopian(targetJdn)
    const weekday = getWeekdayFromJDN(targetJdn)
    items.push({
      k,
      year: eth.year,
      month: eth.month,
      day: eth.day,
      geezDay: numberToGeez(eth.day),
      weekdayShort: weekday.shortAm,
      isToday: targetJdn === todayJdn,
      isSel: k === 0
    })
  }
  return items
})

let x = 0
let anim = 0

function getColWidth() {
  const firstChild = rowEl.value?.firstElementChild as HTMLElement
  return firstChild ? firstChild.getBoundingClientRect().width : 44
}

function paint() {
  if (!rowEl.value) return
  rowEl.value.style.transform = `translateX(${x}px)`
  const w = getColWidth()
  const days = rowEl.value.children
  for (let i = 0; i < days.length; i++) {
    const el = days[i] as HTMLElement
    const kVal = Number(el.dataset.k || 0)
    const d = Math.abs(kVal * w + x) / w
    el.style.setProperty('--t', Math.max(0, 1 - d).toFixed(3))
  }
}

function settleTo(k: number, ms = 380) {
  cancelAnimationFrame(anim)
  const from = x
  const to = -k * getColWidth()
  const t0 = performance.now()
  const ease = (t: number) => 1 - Math.pow(1 - t, 4)

  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / ms)
    x = from + (to - from) * ease(t)
    paint()
    if (t < 1) {
      anim = requestAnimationFrame(step)
    } else if (k !== 0) {
      const target = daysList.value.find((d) => d.k === k)
      if (target) {
        emit('select-date', { year: target.year, month: target.month, day: target.day })
      }
      x = 0
      paint()
    }
  }
  anim = requestAnimationFrame(step)
}

function setupStrip() {
  const strip = stripEl.value
  if (!strip) return

  let start: { x: number; y: number; base: number; id: number; drag: boolean } | null = null
  let samples: { x: number; t: number }[] = []

  strip.addEventListener('pointerdown', (e: PointerEvent) => {
    cancelAnimationFrame(anim)
    start = { x: e.clientX, y: e.clientY, base: x, id: e.pointerId, drag: false }
    samples = []
  })

  strip.addEventListener('pointermove', (e: PointerEvent) => {
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (!start.drag) {
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return
      start.drag = true
      strip.setPointerCapture(start.id)
      strip.classList.add('dragging')
    }
    x = start.base + dx
    paint()
    samples.push({ x, t: e.timeStamp })
    if (samples.length > 5) samples.shift()
  })

  const end = (e: PointerEvent) => {
    if (!start) return
    const wasDrag = start.drag
    start = null
    strip.classList.remove('dragging')
    if (!wasDrag) {
      const el = (e.target as HTMLElement).closest('.day') as HTMLElement
      if (el && el.dataset.k) {
        const kVal = Number(el.dataset.k)
        if (kVal !== 0) settleTo(Math.max(-7, Math.min(7, kVal)))
      }
      return
    }
    const a = samples[0]
    const b = samples[samples.length - 1]
    const v = a && b && b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0
    const col = getColWidth()
    settleTo(Math.max(-7, Math.min(7, Math.round(-(x + v * 160) / col))))
  }

  strip.addEventListener('pointerup', end)
  strip.addEventListener('pointercancel', end)
}

watch(() => props.currentDate, () => {
  x = 0
  requestAnimationFrame(paint)
})

onMounted(() => {
  setupStrip()
  paint()
})
</script>

<template>
  <nav
    ref="stripEl"
    class="strip -mx-5 px-0 py-2.5 border-y border-[var(--line)] overflow-hidden select-none cursor-grab touch-pan-y"
    aria-label="ቀናት"
  >
    <div
      ref="rowEl"
      class="strip-row flex justify-center will-change-transform"
      style="gap: 0;"
    >
      <button
        v-for="d in daysList"
        :key="`${d.year}-${d.month}-${d.day}`"
        :data-k="d.k"
        class="day flex-none flex flex-col items-center justify-start cursor-pointer transition-transform duration-100"
        :class="{
          'today': d.isToday,
          'sel': d.isSel
        }"
        :style="{
          width: 'clamp(40px, calc(100vw / 8.4), 68px)',
          '--t': d.isSel ? '1' : '0'
        }"
      >
        <span
          class="wd text-[10.5px] font-medium"
          :style="{
            color: `color-mix(in oklab, var(--rubric) calc(var(--t) * 100%), var(--text-3))`
          }"
        >
          {{ d.weekdayShort }}
        </span>
        <span
          class="n text-base font-semibold transition-transform"
          :style="{
            transform: `scale(calc(1 + var(--t) * 0.34))`,
            color: `color-mix(in oklab, var(--text) calc(var(--t) * 100%), var(--text-2))`
          }"
        >
          {{ d.geezDay }}
        </span>
        <span
          class="mk rounded-full transition-transform"
          :class="{
            'today-ring': d.isToday && !d.isSel
          }"
          :style="{
            width: '5px',
            height: '5px',
            marginTop: 'calc(3px + var(--t) * 4px)',
            transform: `scale(calc(1 + var(--t) * 0.9))`,
            background: d.isToday && !d.isSel
              ? 'transparent'
              : `color-mix(in oklab, var(--rubric) calc(var(--t) * 100%), var(--ink))`
          }"
        ></span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.strip {
  -webkit-mask: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}

.strip.dragging {
  cursor: grabbing;
}

.today-ring {
  box-shadow: inset 0 0 0 1.4px var(--rubric) !important;
}
</style>

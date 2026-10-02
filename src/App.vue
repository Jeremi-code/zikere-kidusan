<script setup lang="ts">
import { ref } from 'vue'
import { getTodayEthiopian, ETHIOPIAN_MONTHS, numberToGeez, type EthiopianDate } from './lib/ethiopianCalendar'
import CalendarHeader from './components/CalendarHeader.vue'
import { BookOpen, Sparkles, Heart } from 'lucide-vue-next'

const currentDate = ref<EthiopianDate>(getTodayEthiopian())

function handleSelectDate({ month, day }: { month: number; day: number }) {
  const monthInfo = ETHIOPIAN_MONTHS[month - 1]
  currentDate.value = {
    ...currentDate.value,
    month,
    day,
    monthName: monthInfo.nameAm,
    monthNameEn: monthInfo.nameEn,
    geezDay: numberToGeez(day),
    formatted: `${monthInfo.nameAm} ${numberToGeez(day)} (${day}) ቀን ${currentDate.value.year} ዓ.ም`
  }
}
</script>

<template>
  <div class="min-h-screen bg-amber-50/40 text-stone-900 flex flex-col font-sans">
    <CalendarHeader 
      :current-date="currentDate" 
      @select-date="handleSelectDate"
    />

    <main class="flex-1 max-w-2xl w-full mx-auto p-4 space-y-4">
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-amber-200/70">
        <div class="flex items-center justify-between text-xs text-amber-800 font-medium mb-2">
          <span class="flex items-center gap-1.5">
            <Sparkles class="w-4 h-4 text-amber-600" />
            የዕለቱ መታሰቢያ
          </span>
          <span class="bg-amber-100/80 px-2 py-0.5 rounded-full text-amber-900">
            {{ currentDate.formatted }}
          </span>
        </div>

        <h2 class="text-xl font-bold text-stone-900 mb-2">
          እንኳን ለቅዱሳን አበው ዓመታዊና ወርሃዊ መታሰቢያ በዓል በሰላም አደረሳችሁ!
        </h2>

        <p class="text-stone-600 text-sm leading-relaxed">
          በዚህ ዕለት የሚታሰቡ የቅዱሳን፣ የጻድቃን፣ የሰማዕታትና የመላእክት ዝክረ ታሪክ እና ምስባክ በቅርቡ ይቀርባል።
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3 text-stone-700">
        <div class="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex items-start gap-3">
          <BookOpen class="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h3 class="text-sm font-semibold text-stone-800">ዜና ቅዱሳን</h3>
            <p class="text-xs text-stone-500 mt-0.5">ገድላትና የህይወት ታሪክ</p>
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex items-start gap-3">
          <Heart class="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h3 class="text-sm font-semibold text-stone-800">ሰላምታና ምስባክ</h3>
            <p class="text-xs text-stone-500 mt-0.5">የዕለቱ የግዕዝ ማሕሌት</p>
          </div>
        </div>
      </div>
    </main>

    <footer class="py-4 text-center text-xs text-stone-500 border-t border-amber-200/40">
      መጽሐፈ ስንክሳር — ዝክረ ቅዱሳን ዘኦርቶዶክስ ተዋሕዶ
    </footer>
  </div>
</template>

<script setup lang="ts">
import { currentTheme, currentFontSize, type AppTheme, type FontSize } from '../lib/preferences'
import { Sun, Moon, Type, Sparkles } from 'lucide-vue-next'

const themes: { id: AppTheme; label: string; sub: string; icon: any }[] = [
  { id: 'light', label: 'የብርሃን ብራና', sub: 'Light Vellum', icon: Sun },
  { id: 'dark', label: 'የማሕሌት ሌሊት', sub: 'Monastic Dark', icon: Moon }
]

const fontSizes: { id: FontSize; label: string; sub: string; sampleClass: string }[] = [
  { id: 'sm', label: 'ትንሽ', sub: 'Small', sampleClass: 'text-[15px]' },
  { id: 'base', label: 'መደበኛ', sub: 'Medium', sampleClass: 'text-[17px]' },
  { id: 'lg', label: 'ትልቅ', sub: 'Large', sampleClass: 'text-[19px]' },
  { id: 'xl', label: 'በጣም ትልቅ', sub: 'Extra Large', sampleClass: 'text-[21px]' }
]
</script>

<template>
  <div class="settings-page rv" style="--rd:.1s">
    <header class="page-header">
      <h1 class="page-title">የአነባበብ ማስተካከያ</h1>
      <p class="page-sub">ለዓይን ምቹ የሆነ የንባብ ገጽታና የፊደላት መጠን ምርጫዎች</p>
    </header>

    <div class="settings-sections">
      <section class="settings-group">
        <div class="group-title">
          <Sparkles class="w-4 h-4 text-[var(--accent)]" />
          <h2>ገጽታ (Theme)</h2>
        </div>
        <div class="theme-grid">
          <button
            v-for="t in themes"
            :key="t.id"
            type="button"
            class="theme-card"
            :class="{ active: currentTheme === t.id }"
            @click="currentTheme = t.id"
          >
            <div class="card-icon-wrap">
              <component :is="t.icon" class="w-5 h-5" />
            </div>
            <div class="theme-info">
              <span class="theme-name">{{ t.label }}</span>
              <span class="theme-sub">{{ t.sub }}</span>
            </div>
          </button>
        </div>
      </section>

      <section class="settings-group">
        <div class="group-title">
          <Type class="w-4 h-4 text-[var(--accent)]" />
          <h2>የፊደል መጠን (Font Size)</h2>
        </div>
        <div class="font-grid">
          <button
            v-for="f in fontSizes"
            :key="f.id"
            type="button"
            class="font-card"
            :class="{ active: currentFontSize === f.id }"
            @click="currentFontSize = f.id"
          >
            <span class="font-sample" :class="f.sampleClass">ሀ ለ ሐ</span>
            <div class="font-meta">
              <span class="font-name">{{ f.label }}</span>
              <span class="font-sub">{{ f.sub }}</span>
            </div>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  padding: 18px 0 60px;
}

.page-header {
  margin-bottom: 28px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line);
}

.page-title {
  font-family: var(--font-ethiopic-serif, serif);
  font-size: 26px;
  font-weight: 800;
  line-height: 1.3;
  color: var(--text);
  margin: 0;
}

.page-sub {
  margin-top: 6px;
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.6;
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-title h2 {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--text);
  margin: 0;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.theme-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--text);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.theme-card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.theme-card.active {
  border-color: var(--rubric);
  background: color-mix(in oklab, var(--rubric) 10%, var(--surface));
  box-shadow: 0 4px 16px color-mix(in oklab, var(--rubric) 15%, transparent);
}

.card-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--text-2);
  flex-shrink: 0;
}

.theme-card.active .card-icon-wrap {
  color: var(--rubric);
  border-color: color-mix(in oklab, var(--rubric) 30%, transparent);
}

.theme-info {
  display: flex;
  flex-direction: column;
}

.theme-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.theme-sub {
  font-size: 11px;
  color: var(--text-3);
  margin-top: 2px;
}

.font-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 640px) {
  .font-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.font-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 14px;
  border-radius: 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.font-card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.font-card.active {
  border-color: var(--rubric);
  background: color-mix(in oklab, var(--rubric) 10%, var(--surface));
  box-shadow: 0 4px 16px color-mix(in oklab, var(--rubric) 15%, transparent);
}

.font-sample {
  font-family: var(--font-ethiopic-serif, serif);
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--text);
}

.font-card.active .font-sample {
  color: var(--rubric);
}

.font-meta {
  display: flex;
  flex-direction: column;
}

.font-name {
  font-size: 13px;
  font-weight: 700;
}

.font-sub {
  font-size: 10.5px;
  color: var(--text-3);
  margin-top: 1px;
}
</style>

<script setup lang="ts">
import { currentTheme, currentFontSize, type AppTheme, type FontSize } from '../lib/preferences'
import { Sun, Moon, Type, Sparkles, ExternalLink } from 'lucide-vue-next'

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

      <section class="credit-card">
        <div class="credit-header">
          <div class="credit-badge">ምስጋና እና ምንጭ</div>
          <h2 class="credit-title">ዲ/ን ዮርዳኖስ አበበ</h2>
          <p class="credit-desc">
            የዝክረ ቅዱሳን ዕለታዊ ንባባት፣ የቅዱሳን ታሪክ እና መንፈሳዊ ትምህርቶች ምንጭ
          </p>
        </div>
        <a
          href="https://t.me/zikrekidusan23"
          target="_blank"
          rel="noopener noreferrer"
          class="telegram-link"
        >
          <div class="telegram-icon-wrap">
            <svg viewBox="0 0 24 24" class="w-5 h-5 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
          </div>
          <div class="telegram-info">
            <span class="telegram-label">የቴሌግራም ቻናል</span>
            <span class="telegram-handle">@zikrekidusan23</span>
          </div>
          <ExternalLink class="w-4 h-4 telegram-arrow" />
        </a>
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

.credit-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px;
  border-radius: 22px;
  background: var(--surface);
  border: 1px solid var(--line);
}

.credit-badge {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 6px;
}

.credit-title {
  font-family: var(--font-ethiopic-serif, serif);
  font-size: 19px;
  font-weight: 800;
  line-height: 1.35;
  color: var(--text);
  margin: 0;
}

.credit-desc {
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-3);
  margin-top: 4px;
}

.telegram-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 16px;
  background: color-mix(in oklab, var(--accent) 8%, var(--bg));
  border: 1px solid var(--line);
  color: var(--text);
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.telegram-link:hover {
  border-color: var(--accent);
  background: color-mix(in oklab, var(--accent) 14%, var(--bg));
  transform: translateY(-1px);
}

.telegram-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #229ED9;
  color: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(34, 158, 217, 0.28);
}

.telegram-info {
  display: flex;
  flex-direction: column;
}

.telegram-label {
  font-size: 11px;
  color: var(--text-3);
}

.telegram-handle {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-top: 1px;
}

.telegram-arrow {
  margin-left: auto;
  color: var(--text-3);
  transition: transform 0.15s;
}

.telegram-link:hover .telegram-arrow {
  transform: translateX(2px) translateY(-2px);
  color: var(--text);
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  currentTheme, 
  currentFontSize, 
  currentLanguage,
  type AppTheme, 
  type FontSize,
  type SupportedLanguage
} from '../lib/preferences'
import { t, type MessageKey } from '../lib/i18n'
import { Sun, Moon, ExternalLink, Bell, BellRing } from 'lucide-vue-next'
import { 
  isNotificationSupported, 
  getNotificationPermission, 
  requestNotificationPermission, 
  isNotificationsEnabled, 
  setNotificationsEnabled,
  sendSynaxariumNotification,
  scheduleDaily6AMNotification,
  cancelDaily6AMNotification
} from '../lib/notifications'
import { getTodayEthiopian } from '../lib/ethiopianCalendar'
import { synaxariumData } from '../lib/synaxariumData'

const isSendingTest = ref(false)
const testFeedback = ref('')

async function handleToggleNotifications() {
  if (!isNotificationSupported()) {
    testFeedback.value = t('settings.notifNotSupported')
    return
  }

  if (!isNotificationsEnabled.value) {
    const perm = await requestNotificationPermission()
    if (perm === 'granted') {
      setNotificationsEnabled(true)
      scheduleDaily6AMNotification(currentLanguage.value)
      testFeedback.value = ''
    } else {
      setNotificationsEnabled(false)
      cancelDaily6AMNotification()
      testFeedback.value = t('settings.notifBlocked')
    }
  } else {
    setNotificationsEnabled(false)
    cancelDaily6AMNotification()
    testFeedback.value = ''
  }
}

async function handleTestNotification() {
  if (!isNotificationSupported()) {
    testFeedback.value = t('settings.notifNotSupported')
    return
  }

  isSendingTest.value = true
  testFeedback.value = ''

  const today = getTodayEthiopian()
  const todayEntry = synaxariumData.find(
    (e) => e.month === today.month && e.day === today.day
  ) || synaxariumData[0]

  const sent = await sendSynaxariumNotification(todayEntry, currentLanguage.value)
  isSendingTest.value = false

  if (sent) {
    testFeedback.value = t('settings.notifSent')
    setTimeout(() => {
      testFeedback.value = ''
    }, 4000)
  } else {
    const perm = getNotificationPermission()
    if (perm === 'denied') {
      testFeedback.value = t('settings.notifBlocked')
    }
  }
}

const themes: { id: AppTheme; label: MessageKey; sub: MessageKey; icon: any }[] = [
  { id: 'light', label: 'settings.themeLight', sub: 'settings.themeLightSub', icon: Sun },
  { id: 'dark', label: 'settings.themeDark', sub: 'settings.themeDarkSub', icon: Moon }
]

// Language names stay in their own script so each is recognisable from the other language.
const languages: { id: SupportedLanguage; label: string; sub: MessageKey; symbol: string }[] = [
  { id: 'am', label: 'አማርኛ', sub: 'settings.langAmSub', symbol: 'አማ' },
  { id: 'en', label: 'English', sub: 'settings.langEnSub', symbol: 'EN' }
]

const fontSizes: { id: FontSize; label: MessageKey; sub: string; sampleSize: string }[] = [
  { id: 'sm', label: 'settings.fontSm', sub: 'S', sampleSize: '14px' },
  { id: 'base', label: 'settings.fontBase', sub: 'M', sampleSize: '17px' },
  { id: 'lg', label: 'settings.fontLg', sub: 'L', sampleSize: '20px' },
  { id: 'xl', label: 'settings.fontXl', sub: 'XL', sampleSize: '23px' }
]
</script>

<template>
  <div class="settings-page rv" style="--rd:.1s">
    <header class="page-header">
      <div class="k">{{ t('settings.kicker') }}</div>
      <h2 class="page-title">{{ t('settings.title') }}</h2>
    </header>

    <div class="sep">
      <i></i><i></i><i class="r"></i><i></i><i></i>
    </div>

    <div class="settings-sections">
      <section class="settings-group">
        <div class="h-label">{{ t('settings.theme') }}</div>
        <div class="theme-grid">
          <button
            v-for="theme in themes"
            :key="theme.id"
            type="button"
            class="theme-card"
            :class="{ active: currentTheme === theme.id }"
            @click="currentTheme = theme.id"
          >
            <div class="theme-sample-box" :class="theme.id">
              <span class="sample-rubric"></span>
              <span class="sample-line"></span>
              <span class="sample-line sample-short"></span>
            </div>
            <div class="theme-card-body">
              <div class="theme-meta">
                <span class="theme-name">{{ t(theme.label) }}</span>
                <span class="theme-sub">{{ t(theme.sub) }}</span>
              </div>
              <div class="theme-icon-wrap">
                <component :is="theme.icon" class="w-4 h-4" />
              </div>
            </div>
          </button>
        </div>
      </section>

      <section class="settings-group">
        <div class="h-label">{{ t('settings.language') }}</div>
        <div class="lang-grid">
          <button
            v-for="l in languages"
            :key="l.id"
            type="button"
            class="lang-card"
            :class="{ active: currentLanguage === l.id }"
            @click="currentLanguage = l.id"
          >
            <div class="lang-symbol-box" :class="l.id">
              <span class="lang-symbol">{{ l.symbol }}</span>
            </div>
            <div class="lang-card-body">
              <div class="lang-meta">
                <span class="lang-name">{{ l.label }}</span>
                <span class="lang-sub">{{ t(l.sub) }}</span>
              </div>
              <div class="lang-indicator">
                <span class="indicator-dot"></span>
              </div>
            </div>
          </button>
        </div>
      </section>

      <section class="settings-group">
        <div class="h-label">{{ t('settings.textSize') }}</div>
        <div class="font-grid">
          <button
            v-for="f in fontSizes"
            :key="f.id"
            type="button"
            class="font-card"
            :class="{ active: currentFontSize === f.id }"
            @click="currentFontSize = f.id"
          >
            <span class="font-letter" :style="{ fontSize: f.sampleSize }">{{ t('settings.fontSample') }}</span>
            <span class="font-name">{{ t(f.label) }}</span>
            <span class="font-sub">{{ f.sub }}</span>
          </button>
        </div>
      </section>

      <section class="settings-group">
        <div class="h-label">{{ t('settings.notifications') }}</div>
        <div class="notif-card">
          <div class="notif-row">
            <div class="notif-meta">
              <div class="notif-icon-wrap" :class="{ active: isNotificationsEnabled }">
                <component :is="isNotificationsEnabled ? BellRing : Bell" class="w-4 h-4" />
              </div>
              <div class="notif-text">
                <span class="notif-title">{{ t('settings.notifEnable') }}</span>
                <span class="notif-sub">{{ t('settings.notifEnableSub') }}</span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="isNotificationsEnabled"
              class="notif-switch"
              :class="{ enabled: isNotificationsEnabled }"
              @click="handleToggleNotifications"
            >
              <span class="switch-handle"></span>
            </button>
          </div>

          <div v-if="testFeedback" class="notif-feedback">
            {{ testFeedback }}
          </div>

          <div class="notif-action-row">
            <button
              type="button"
              class="test-notif-btn"
              :disabled="isSendingTest"
              @click="handleTestNotification"
            >
              <Bell class="w-4 h-4 mr-2" />
              <span>{{ t('settings.notifTest') }}</span>
            </button>
          </div>
        </div>
      </section>

      <section class="settings-group">
        <div class="h-label">{{ t('settings.credit') }}</div>
        <div class="credit-card">
          <div class="credit-header">
            <span class="credit-k">{{ t('settings.creditKicker') }}</span>
            <h3 class="credit-title">{{ t('settings.creditName') }}</h3>
            <p class="credit-desc">
              {{ t('settings.creditDesc') }}
            </p>
          </div>
          <a
            href="https://t.me/zikrekidusan23"
            target="_blank"
            rel="noopener noreferrer"
            class="telegram-link"
          >
            <div class="telegram-icon-wrap">
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            </div>
            <div class="telegram-info">
              <span class="telegram-label">{{ t('settings.telegram') }}</span>
              <span class="telegram-handle">@zikrekidusan23</span>
            </div>
            <ExternalLink class="w-4 h-4 telegram-arrow" />
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  padding: 16px 0 60px;
}

.page-header {
  text-align: center;
}

.k {
  font: 600 11px var(--font);
  letter-spacing: .2em;
  color: var(--accent);
  text-transform: uppercase;
}

.page-title {
  font: 700 16px/1.25 var(--font);
  color: var(--text);
  margin-top: 6px;
  letter-spacing: .02em;
}

.sep {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  margin: 18px 0 20px;
}

.sep i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--ink);
  opacity: .55;
}

.sep i.r {
  background: var(--rubric);
  width: 6px;
  height: 6px;
  opacity: 1;
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.settings-group {
  display: flex;
  flex-direction: column;
}

.theme-grid,
.lang-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.theme-card,
.lang-card {
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 20px;
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--text);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.theme-card:hover,
.lang-card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.theme-card.active,
.lang-card.active {
  border-color: var(--rubric);
  background: color-mix(in oklab, var(--rubric) 6%, var(--surface));
  box-shadow: 0 4px 16px color-mix(in oklab, var(--rubric) 12%, transparent);
}

.theme-sample-box {
  height: 52px;
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  margin-bottom: 10px;
  border: 1px solid var(--line);
}

.theme-sample-box.light {
  background: #f5ecdb;
}

.theme-sample-box.dark {
  background: #110c07;
}

.sample-rubric {
  width: 28px;
  height: 4px;
  border-radius: 2px;
  background: #c0322a;
}

.theme-sample-box.dark .sample-rubric {
  background: #e0493d;
}

.sample-line {
  width: 100%;
  height: 3px;
  border-radius: 1.5px;
  background: rgba(27, 19, 11, 0.35);
}

.theme-sample-box.dark .sample-line {
  background: rgba(217, 165, 74, 0.35);
}

.sample-short {
  width: 60%;
}

.lang-symbol-box {
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border: 1px solid var(--line);
  background: var(--bg);
}

.lang-symbol {
  font: 700 16px var(--font);
  color: var(--text);
  letter-spacing: .04em;
}

.lang-card.active .lang-symbol {
  color: var(--rubric);
}

.theme-card-body,
.lang-card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.theme-meta,
.lang-meta {
  display: flex;
  flex-direction: column;
}

.theme-name,
.lang-name {
  font: 600 13px var(--font);
  color: var(--text);
}

.theme-sub,
.lang-sub {
  font: 400 10.5px var(--font);
  color: var(--text-3);
  margin-top: 1px;
}

.theme-icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--text-2);
}

.theme-card.active .theme-icon-wrap {
  color: var(--rubric);
  border-color: color-mix(in oklab, var(--rubric) 25%, transparent);
}

.lang-indicator {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1.5px solid var(--line);
  background: var(--bg);
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: transparent;
  transition: background-color 0.15s, transform 0.15s;
}

.lang-card.active .lang-indicator {
  border-color: var(--rubric);
}

.lang-card.active .indicator-dot {
  background: var(--rubric);
  transform: scale(1.1);
}

.font-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.font-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 14px 8px;
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
  background: color-mix(in oklab, var(--rubric) 6%, var(--surface));
  box-shadow: 0 4px 14px color-mix(in oklab, var(--rubric) 12%, transparent);
}

.font-letter {
  font-family: var(--font);
  font-weight: 700;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
  margin-bottom: 6px;
}

.font-card.active .font-letter {
  color: var(--rubric);
}

.font-name {
  font: 600 12px var(--font);
  color: var(--text);
}

.font-sub {
  font: 400 9.5px var(--font);
  color: var(--text-3);
  margin-top: 1px;
}

.credit-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 20px;
  background: var(--surface);
  border: 1px solid var(--line);
}

.credit-k {
  display: block;
  font: 600 10.5px var(--font);
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 4px;
}

.credit-title {
  font: 700 15.5px var(--font);
  color: var(--text);
  margin: 0;
}

.credit-desc {
  font: 400 12.5px/1.6 var(--font);
  color: var(--text-3);
  margin-top: 3px;
}

.telegram-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 14px;
  background: color-mix(in oklab, var(--accent) 7%, var(--bg));
  border: 1px solid var(--line);
  color: var(--text);
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.telegram-link:hover {
  border-color: var(--accent);
  background: color-mix(in oklab, var(--accent) 12%, var(--bg));
  transform: translateY(-1px);
}

.telegram-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #229ED9;
  color: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(34, 158, 217, 0.25);
}

.telegram-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.telegram-label {
  font: 500 10.5px var(--font);
  color: var(--text-3);
}

.telegram-handle {
  font: 700 13px var(--font);
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

.notif-card {
  display: flex;
  flex-direction: column;
  padding: 14px 16px;
  border-radius: 20px;
  background: var(--surface);
  border: 1px solid var(--line);
  gap: 14px;
}

.notif-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.notif-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.notif-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: color-mix(in oklab, var(--ink) 6%, transparent);
  color: var(--text-2);
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.notif-icon-wrap.active {
  background: color-mix(in oklab, var(--rubric) 12%, transparent);
  color: var(--rubric);
}

.notif-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.notif-title {
  font: 600 14px var(--font);
  color: var(--text);
}

.notif-sub {
  font: 400 12px/1.4 var(--font);
  color: var(--text-3);
  margin-top: 2px;
}

.notif-switch {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: color-mix(in oklab, var(--ink) 18%, transparent);
  position: relative;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  padding: 2px;
  transition: background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.notif-switch.enabled {
  background: var(--rubric);
}

.switch-handle {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.notif-switch.enabled .switch-handle {
  transform: translateX(20px);
}

.notif-feedback {
  font: 500 12px var(--font);
  color: var(--rubric);
  padding: 6px 12px;
  border-radius: 8px;
  background: color-mix(in oklab, var(--rubric) 8%, transparent);
}

.notif-action-row {
  display: flex;
}

.test-notif-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border-radius: 12px;
  background: color-mix(in oklab, var(--accent) 8%, var(--bg));
  border: 1px solid var(--line);
  color: var(--text);
  font: 600 12.5px var(--font);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.test-notif-btn:hover:not(:disabled) {
  border-color: var(--rubric);
  background: color-mix(in oklab, var(--rubric) 8%, var(--bg));
  color: var(--rubric);
  transform: translateY(-1px);
}

.test-notif-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

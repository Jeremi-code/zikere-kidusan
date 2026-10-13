<script setup lang="ts">
import { currentTheme, currentFontSize, type AppTheme, type FontSize } from '../lib/preferences'
import { X, Sun, BookOpen, Moon } from 'lucide-vue-next'
import ZikereLogo from './ZikereLogo.vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const fontSizes: { id: FontSize; label: string; preview: string }[] = [
  { id: 'sm', label: 'ትንሽ (Small)', preview: 'text-sm' },
  { id: 'base', label: 'መደበኛ (Medium)', preview: 'text-base' },
  { id: 'lg', label: 'ትልቅ (Large)', preview: 'text-lg' },
  { id: 'xl', label: 'በጣም ትልቅ (XL)', preview: 'text-xl' }
]

const themes: { id: AppTheme; label: string; sub: string; icon: any }[] = [
  { id: 'light', label: 'የብርሃን ብራና', sub: 'Light Vellum', icon: Sun },
  { id: 'dark', label: 'የማሕሌት ሌሊት', sub: 'Monastic Dark', icon: Moon }
]
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-backdrop" @click="emit('close')">
        <div class="modal-panel" @click.stop>
          <header class="modal-header">
            <div class="brand-row">
              <ZikereLogo :size="24" />
              <div>
                <h2 class="title">የአነባበብ ማስተካከያ</h2>
                <span class="sub">Settings</span>
              </div>
            </div>
            <button @click="emit('close')" class="close-btn" aria-label="Close">
              <X class="w-5 h-5" />
            </button>
          </header>

          <div class="modal-body">
            <section>
              <label class="section-label">ገጽታ (Theme)</label>
              <div class="theme-grid">
                <button
                  v-for="t in themes"
                  :key="t.id"
                  @click="currentTheme = t.id"
                  class="theme-btn"
                  :class="{ active: currentTheme === t.id }"
                >
                  <component :is="t.icon" class="w-5 h-5 mb-1" />
                  <span class="theme-name">{{ t.label }}</span>
                  <span class="theme-sub">{{ t.sub }}</span>
                </button>
              </div>
            </section>

            <section>
              <label class="section-label">የፊደል መጠን (Font Size)</label>
              <div class="font-grid">
                <button
                  v-for="f in fontSizes"
                  :key="f.id"
                  @click="currentFontSize = f.id"
                  class="font-btn"
                  :class="{ active: currentFontSize === f.id }"
                >
                  <span class="font-label">{{ f.label }}</span>
                  <span class="font-preview mt-1 font-bold">ሀ ለ ሐ</span>
                </button>
              </div>
            </section>
          </div>

          <footer class="modal-footer">
            <button @click="emit('close')" class="done-btn">
              ተጠናቋል (Done)
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
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

.modal-panel {
  width: 100%;
  max-width: 440px;
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--line);
  border-radius: 26px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
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

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 22px;
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

.theme-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.theme-btn {
  padding: 16px 12px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-btn.active {
  border-color: var(--rubric);
  color: var(--rubric);
  background: color-mix(in oklab, var(--rubric) 10%, var(--surface));
  font-weight: 700;
}

.theme-name {
  font-size: 12.5px;
  font-weight: 600;
}

.theme-sub {
  font-size: 10px;
  opacity: 0.75;
}

.font-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.font-btn {
  padding: 14px 12px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.font-btn.active {
  border-color: var(--rubric);
  color: var(--rubric);
  background: color-mix(in oklab, var(--rubric) 10%, var(--surface));
  font-weight: 700;
}

.font-label {
  font-size: 11.5px;
}

.font-preview {
  font-size: 14px;
}

.modal-footer {
  padding: 18px 24px;
  border-top: 1px solid var(--line);
  background: var(--surface);
  text-align: right;
}

.done-btn {
  padding: 10px 22px;
  border-radius: 999px;
  background: var(--text);
  color: var(--bg);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.done-btn:hover {
  opacity: 0.9;
}

/* ═══ Transitions ═══ */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  transform: scale(0.95) translateY(8px);
}
</style>

<script setup lang="ts">
import { bookmarks, toggleBookmarkItem } from '../lib/preferences'
import { X, Bookmark, Trash2 } from 'lucide-vue-next'
import ZikereLogo from './ZikereLogo.vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', date: { month: number; day: number }): void
}>()

function handleSelect(item: { month: number; day: number }) {
  emit('select', { month: item.month, day: item.day })
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="isOpen"
        class="drawer-backdrop"
        @click="emit('close')"
      >
        <aside
          class="drawer-panel"
          @click.stop
        >
          <!-- Header -->
          <header class="drawer-header">
            <div class="brand-box">
              <ZikereLogo :size="24" />
              <div>
                <h2 class="title">የተቀመጡ ንባቦች</h2>
                <span class="sub">Bookmarks</span>
              </div>
            </div>
            <button
              @click="emit('close')"
              class="close-btn"
              aria-label="ዝጋ (Close)"
            >
              <X class="w-5 h-5" />
            </button>
          </header>

          <!-- Bookmarks List -->
          <div class="drawer-content">
            <div v-if="bookmarks.length === 0" class="empty-box">
              <Bookmark class="empty-icon" />
              <p class="empty-text">ምንም የተቀመጠ ንባብ የለም</p>
              <p class="empty-sub">በቀኑ ንባብ ላይ የዕልባት ምልክቱን ተጭነው ያስቀምጡ</p>
            </div>

            <div
              v-for="item in bookmarks"
              :key="item.id"
              class="bookmark-card"
            >
              <button
                @click="handleSelect(item)"
                class="card-click"
              >
                <div class="card-chip">
                  <span>{{ item.dateLabel }}</span>
                </div>
                <h4 class="card-title">
                  {{ item.title }}
                </h4>
                <p v-if="item.titleEn" class="card-sub">
                  {{ item.titleEn }}
                </p>
              </button>

              <button
                @click="toggleBookmarkItem(item)"
                class="delete-btn"
                title="አስወግድ (Remove)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Footer -->
          <footer class="drawer-footer">
            {{ bookmarks.length }} የተቀመጡ ቀናት
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.55);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.drawer-panel {
  width: 100%;
  max-width: 380px;
  height: 100%;
  background: var(--bg);
  color: var(--text);
  border-left: 1px solid var(--line);
  box-shadow: -14px 0 38px rgba(0, 0, 0, 0.28);
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 24px 22px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--line);
}

.brand-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
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
  transition: background-color 0.15s, color 0.15s;
}

.close-btn:hover {
  background: var(--line);
  color: var(--text);
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.empty-box {
  padding: 80px 20px;
  text-align: center;
  color: var(--text-3);
}

.empty-icon {
  width: 44px;
  height: 44px;
  margin: 0 auto 12px;
  opacity: 0.35;
  color: var(--rubric);
}

.empty-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.empty-sub {
  font-size: 12px;
  margin-top: 6px;
  color: var(--text-3);
}

.bookmark-card {
  padding: 16px 18px;
  border-radius: 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.bookmark-card:hover {
  border-color: var(--accent);
}

.card-click {
  flex: 1;
  text-align: left;
  cursor: pointer;
}

.card-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--bg);
  border: 1px solid var(--line);
  font-size: 11px;
  font-weight: 600;
  color: var(--rubric);
}

.card-title {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-title:hover {
  color: var(--rubric);
}

.card-sub {
  margin-top: 4px;
  font-size: 11.5px;
  color: var(--text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-btn {
  padding: 8px;
  border-radius: 10px;
  color: var(--text-3);
  cursor: pointer;
  transition: color 0.15s, background-color 0.15s;
  margin-top: 2px;
}

.delete-btn:hover {
  color: var(--rubric);
  background: var(--line);
}

.drawer-footer {
  padding: 16px 22px;
  border-top: 1px solid var(--line);
  background: var(--surface);
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-2);
}

/* ═══ Transitions ═══ */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}
</style>

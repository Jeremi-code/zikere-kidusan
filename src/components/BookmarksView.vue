<script setup lang="ts">
import { bookmarks, toggleBookmarkItem, type BookmarkItem } from '../lib/preferences'
import { t, pick, formatNumber, monthName } from '../lib/i18n'
import { Trash2, BookOpen } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'select', date: { month: number; day: number; year?: number }): void
  (e: 'goToToday'): void
}>()

function handleSelect(item: BookmarkItem) {
  emit('select', { month: item.month, day: item.day, year: item.year })
}
</script>

<template>
  <div class="bookmarks-page rv" style="--rd:.1s">
    <header class="page-header">
      <div class="k">{{ t('bookmarks.kicker') }}</div>
      <div class="header-main">
        <h2 class="page-title">{{ t('bookmarks.title') }}</h2>
        <span v-if="bookmarks.length > 0" class="header-count">
          {{ t('bookmarks.count', { n: formatNumber(bookmarks.length) }) }}
        </span>
      </div>
    </header>

    <div class="sep">
      <i></i><i></i><i class="r"></i><i></i><i></i>
    </div>

    <div v-if="bookmarks.length === 0" class="empty-state">
      <div class="empty-ornament">
        <svg viewBox="0 0 24 24" class="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" stroke-width="1.6">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          <circle cx="12" cy="12" r="8" stroke-dasharray="1 3" />
        </svg>
      </div>
      <p class="empty-verse">{{ t('bookmarks.emptyVerse') }}</p>
      <h3 class="empty-title">{{ t('bookmarks.emptyTitle') }}</h3>
      <p class="empty-desc">
        {{ t('bookmarks.emptyDesc') }}
      </p>
      <button class="action-btn" @click="emit('goToToday')">
        <BookOpen class="w-4 h-4" />
        <span>{{ t('bookmarks.backToToday') }}</span>
      </button>
    </div>

    <div v-else class="bookmarks-list">
      <article
        v-for="item in bookmarks"
        :key="item.id"
        class="bookmark-card"
      >
        <button
          type="button"
          class="card-main"
          @click="handleSelect(item)"
        >
          <div class="card-lead">
            <span class="lead-dot"></span>
          </div>
          <div class="card-body">
            <div class="card-meta">
              <span class="date-chip">{{ monthName(item.month) }} {{ formatNumber(item.day) }}</span>
            </div>
            <h3 class="card-title">{{ pick(item.title, item.titleEn) }}</h3>
            <p v-if="item.titleEn" class="card-sub">{{ pick(item.titleEn, item.title) }}</p>
          </div>
          <span class="read-chevron" aria-hidden="true">›</span>
        </button>

        <button
          type="button"
          class="remove-btn"
          :title="t('reading.removeBookmark')"
          :aria-label="t('reading.removeBookmark')"
          @click="toggleBookmarkItem(item)"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </article>
    </div>
  </div>
</template>

<style scoped>
.bookmarks-page {
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

.header-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 6px;
}

.page-title {
  font: 700 16px/1.25 var(--font);
  color: var(--text);
  margin: 0;
  letter-spacing: .02em;
}

.header-count {
  font: 700 11.5px var(--font);
  padding: 2px 9px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--rubric) 10%, var(--surface));
  color: var(--rubric);
  border: 1px solid color-mix(in oklab, var(--rubric) 22%, transparent);
}

.sep {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  margin: 18px 0 24px;
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

.empty-state {
  margin: 32px auto;
  padding: 36px 20px;
  text-align: center;
  border-radius: 24px;
  background: var(--surface);
  border: 1px dashed var(--line);
  max-width: 440px;
}

.empty-ornament {
  width: 52px;
  height: 52px;
  margin: 0 auto 14px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: color-mix(in oklab, var(--accent) 12%, var(--surface));
  border: 1px solid var(--line);
}

.empty-verse {
  font: 600 13.5px var(--font);
  color: var(--rubric);
  margin-bottom: 8px;
  letter-spacing: .04em;
}

.empty-title {
  font: 700 15.5px var(--font);
  color: var(--text);
  margin-bottom: 6px;
}

.empty-desc {
  font: 400 13px/1.7 var(--font);
  color: var(--text-3);
  max-width: 340px;
  margin: 0 auto 20px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 20px;
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--line);
  font: 600 12.5px var(--font);
  cursor: pointer;
  transition: all .2s;
}

.action-btn:hover {
  border-color: var(--accent);
  color: var(--rubric);
  transform: translateY(-1px);
}

.bookmarks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bookmark-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 20px;
  background: var(--surface);
  border: 1px solid var(--line);
  transition: all .2s cubic-bezier(0.16, 1, 0.3, 1);
}

.bookmark-card:hover {
  border-color: var(--accent);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.card-main {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  min-width: 0;
}

.card-lead {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lead-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--rubric);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--rubric) 18%, transparent);
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-meta {
  margin-bottom: 4px;
}

.date-chip {
  font: 600 11px var(--font);
  color: var(--rubric);
  letter-spacing: .02em;
}

.card-title {
  font: 600 15px/1.4 var(--font);
  color: var(--text);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color .15s;
}

.card-main:hover .card-title {
  color: var(--rubric);
}

.card-sub {
  margin-top: 2px;
  font: 400 11px var(--font);
  color: var(--text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.read-chevron {
  font: 300 18px var(--font);
  color: var(--text-3);
  margin-left: 8px;
  transition: transform .15s, color .15s;
}

.card-main:hover .read-chevron {
  color: var(--rubric);
  transform: translateX(2px);
}

.remove-btn {
  padding: 8px;
  border-radius: 10px;
  color: var(--text-3);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color .15s, background-color .15s;
  margin-left: 6px;
  flex-shrink: 0;
}

.remove-btn:hover {
  color: var(--rubric);
  background: var(--line);
}
</style>

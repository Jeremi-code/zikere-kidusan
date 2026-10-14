<script setup lang="ts">
import { bookmarks, toggleBookmarkItem, type BookmarkItem } from '../lib/preferences'
import { numberToGeez } from '../lib/ethiopianCalendar'
import { Bookmark, Trash2, BookOpen } from 'lucide-vue-next'

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
      <div class="header-main">
        <h1 class="page-title">የተቀመጡ ንባቦች</h1>
        <span v-if="bookmarks.length > 0" class="header-count">
          {{ numberToGeez(bookmarks.length) }} ቀናት
        </span>
      </div>
      <p class="page-sub">ለተመስጦና ለጸሎት ያስቀመጧቸው የዕለት ንባባት ስብስብ</p>
    </header>

    <div v-if="bookmarks.length === 0" class="empty-state">
      <div class="empty-icon-wrap">
        <Bookmark class="empty-icon" />
      </div>
      <h2 class="empty-title">ምንም የተቀመጠ ንባብ የለም</h2>
      <p class="empty-desc">
        በንባብ ገጽ ላይ የዕልባት ምልክቷን በመንካት የሚወዷቸውን የቅዱሳን ታሪኮች እዚህ ማስቀመጥ ይችላሉ።
      </p>
      <button class="action-btn" @click="emit('goToToday')">
        <BookOpen class="w-4 h-4" />
        <span>የዕለቱን ንባብ አንብብ</span>
      </button>
    </div>

    <div v-else class="bookmarks-list">
      <article
        v-for="item in bookmarks"
        :key="item.id"
        class="bookmark-card group"
      >
        <button
          type="button"
          class="card-main"
          @click="handleSelect(item)"
        >
          <div class="card-meta">
            <span class="date-chip">{{ item.dateLabel }}</span>
          </div>
          <h2 class="card-title">{{ item.title }}</h2>
          <p v-if="item.titleEn" class="card-sub">{{ item.titleEn }}</p>
        </button>

        <button
          type="button"
          class="remove-btn"
          title="ከዕልባት አስወግድ"
          aria-label="ከዕልባት አስወግድ"
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
  padding: 18px 0 60px;
}

.page-header {
  margin-bottom: 26px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line);
}

.header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.header-count {
  font-size: 11.5px;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--rubric) 12%, var(--surface));
  color: var(--rubric);
  border: 1px solid color-mix(in oklab, var(--rubric) 25%, transparent);
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

.empty-state {
  margin: 48px auto;
  padding: 44px 24px;
  text-align: center;
  border-radius: 24px;
  background: var(--surface);
  border: 1px dashed var(--line);
  max-width: 480px;
}

.empty-icon-wrap {
  width: 58px;
  height: 58px;
  margin: 0 auto 16px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: color-mix(in oklab, var(--rubric) 10%, var(--surface));
  color: var(--rubric);
  border: 1px solid color-mix(in oklab, var(--rubric) 22%, transparent);
}

.empty-icon {
  width: 26px;
  height: 26px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-3);
  max-width: 380px;
  margin: 0 auto 24px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 999px;
  background: var(--ink);
  color: var(--bg);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}

.action-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.bookmarks-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bookmark-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px 20px;
  border-radius: 20px;
  background: var(--surface);
  border: 1px solid var(--line);
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.bookmark-card:hover {
  border-color: var(--accent);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.card-main {
  flex: 1;
  text-align: left;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.card-meta {
  margin-bottom: 8px;
}

.date-chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--bg);
  border: 1px solid var(--line);
  font-size: 11.5px;
  font-weight: 700;
  color: var(--rubric);
}

.card-title {
  font-family: var(--font-ethiopic-serif, serif);
  font-size: 17.5px;
  font-weight: 700;
  line-height: 1.45;
  color: var(--text);
  margin: 0;
  transition: color 0.15s;
}

.card-main:hover .card-title {
  color: var(--rubric);
}

.card-sub {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-3);
  line-height: 1.4;
}

.remove-btn {
  padding: 9px;
  border-radius: 12px;
  color: var(--text-3);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s, background-color 0.15s;
  margin-left: 10px;
}

.remove-btn:hover {
  color: var(--rubric);
  background: var(--line);
}
</style>

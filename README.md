# ዝክረ ቅዱሳን (Zikere Kidusan) — Ethiopian Orthodox Synaxarium

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

**ዝክረ ቅዱሳን (Zikere Kidusan)** is a modern, contemplative web application and liturgical companion dedicated to the daily commemoration of the saints, martyrs, and feast days of the Ethiopian Orthodox Tewahedo Church (*የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን*).

Rooted in ancient Ethiopian manuscript illumination (*ብራና / Biranna*) and calligraphic traditions, the application provides an ergonomic, distraction-free reading experience for both spiritual devotion and historical study.

---

## ✨ Features

- **📖 Bilingual Synaxarium (ስንክሳር)**
  - Full daily commemorations, hagiographies, and holy lives in both **Amharic (አማርኛ)** and **English**.
  - Daily liturgical scripture reading with chapter and verse citations.
  - Comprehensive annual and monthly feast rosters (*ዓመታዊና ወርሃዊ በዓላት*) for each day.

- **🎨 Sacred Manuscript Aesthetics & Typography**
  - Designed around ancient Ethiopian codex principles, incorporating dual-color rubrication (*ቀይ ቀለም* reserved for holy names, incipits, and feast markers).
  - Dedicated Ethiopic calligraphy font (*Menbere*) paired with the classical Latin companion *Cormorant Garamond*.
  - Dual liturgical themes:
    - **ብራና (Vellum)**: Warm, parchment-tinted daylight reading.
    - **ጽልመት (Dark / Obsidian)**: Night-mode illumination with deep charcoal contrast.

- **🔍 Full-Text Search**
  - Instantaneous search across saints' names, feast commemorations, and scripture readings in both languages.

- **🔖 Bookmarks & Personal Library (የተቀመጡ)**
  - Save meaningful daily readings with one tap for offline reflection.
  - Dedicated bookmarks library view with direct jump-to-reading capability.

- **⚙️ Ergonomic Customization (ቅንብር)**
  - 4-level dynamic font sizing (Small, Normal, Large, Extra Large) scaling Amharic and English texts in unison.
  - Instant language switcher between Amharic and English without reloading.
  - Persistent user preferences stored locally.

- **⚡ Offline First & PWA Ready**
  - Zero external server dependencies for core reading content.
  - Fully responsive across desktop, tablet, and mobile devices with iOS/Android safe area support.

---

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`, TypeScript)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS custom design tokens
- **Type Checking**: [vue-tsc](https://github.com/vuejs/language-tools)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- [pnpm](https://pnpm.io/) (or `npm` / `yarn`)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Jeremi-code/Synaxarium.git
cd Synaxarium
pnpm install
```

### Development

Start the local development server with Hot Module Replacement (HMR):

```bash
pnpm dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production

Compile TypeScript types and build minified production bundles:

```bash
pnpm run build
```

Preview the production build locally:

```bash
pnpm run preview
```

---

## 📁 Project Structure

```text
Synaxarium/
├── public/                 # Static assets, fonts, icons, manifest
├── src/
│   ├── assets/             # Brand logos and iconography
│   ├── components/         # Vue UI components
│   │   ├── BookmarksView.vue         # Dedicated bookmarks page
│   │   ├── EthiopianDatePicker.vue   # Ethiopian calendar selector modal
│   │   ├── FloatingBottomDock.vue    # Floating capsule navigation dock
│   │   ├── SearchModal.vue           # Full-text search modal
│   │   ├── SettingsView.vue          # Theme, language & typography settings
│   │   └── ZikereLogo.vue            # Cross-pattern SVG brand emblem
│   ├── lib/                # Core domain logic
│   │   ├── ethiopianCalendar.ts      # JDN & Ethiopian calendar math
│   │   ├── i18n.ts                   # Internationalization helper
│   │   ├── preferences.ts            # Local storage preferences
│   │   ├── synaxariumData.ts         # Complete 365-day liturgical entries
│   │   └── types.ts                  # TypeScript models
│   ├── locales/            # Translation catalogs
│   │   ├── am.ts                     # Amharic strings
│   │   └── en.ts                     # English strings
│   ├── App.vue             # Main shell & reading view
│   ├── main.ts             # Application entrypoint
│   └── style.css           # Global liturgical theme tokens & typography
├── index.html              # HTML entrypoint with font preloads
├── package.json
└── vite.config.ts
```

---

## 📜 Liturgical Content & Attribution

- **Synaxarium Data & Curation**: Gratitude is extended to **ዲ/ን ዮርዳኖስ አበበ (D/n Yordanos Abebe)** for curating the daily commemorations of the saints ([Telegram Channel @zikrekidusan23](https://t.me/zikrekidusan23)).
- **Liturgical Texts**: Based on the Holy Synaxarium (*መጽሐፈ ስንክሳር*) of the Ethiopian Orthodox Tewahedo Church.

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).

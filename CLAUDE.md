# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Vite HMR)
npm run build     # Type-check then build for production (tsc -b && vite build)
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

## Architecture

This is a **Telegram Mini App** — a single-page React + TypeScript + Vite app designed to run inside the Telegram client.

**Key integration point:** `index.html` loads the Telegram Web App SDK (`telegram-web-app.js`) before the React app, making `window.Telegram.WebApp` available globally.

**Data flow:**
1. On mount, `App.tsx` calls `window.Telegram?.WebApp?.ready()` to signal readiness to the Telegram client.
2. User data is read from `window.Telegram.WebApp.initDataUnsafe.user` (client-side only — not verified).
3. Theme colors are pulled from `window.Telegram.WebApp.themeParams` to match the Telegram client's color scheme.

**TypeScript types** for the Telegram SDK are declared in `src/types/telegram.d.ts` as a global `Window` augmentation — no npm package, hand-rolled interface.

**Styling:** Tailwind CSS v4 (imported via `@import "tailwindcss"` in `index.css`), with inline styles used for dynamic Telegram theme colors that aren't known at build time.

All UI lives in a single component (`src/App.tsx`) — no routing, no backend, no state management library.

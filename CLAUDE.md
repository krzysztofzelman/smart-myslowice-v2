# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# From repo root
npm run install:all   # install all dependencies (backend + frontend)
npm run dev           # start backend (port 3001) + frontend (port 5173) concurrently
npm run build         # production build of frontend only

# From frontend/
npm run dev           # Vite dev server only
npm run preview       # preview production build

# From backend/
npm run dev           # node --watch server.js (hot-reload)
npm run start         # production start
```

There are no tests or linters configured.

## Environment

Create `backend/.env` with:
```
OWM_API_KEY=<your OpenWeatherMap API key>
```

This is required for the `/api/weather` endpoint. All other endpoints use hardcoded static data.

## Architecture

**Monorepo** with two packages: `backend/` (Express) and `frontend/` (React + Vite).

### Backend (`backend/server.js`)

Single-file Express API, ESM modules, port 3001. Six endpoints:
- `GET /api/aed` — 14 defibrillator locations (static Mysłowice data)
- `GET /api/toilets` — 3 public toilets (static)
- `GET /api/eco` — 4 recycling points (static)
- `GET /api/air` — 6 air quality sensors (mock PM2.5/PM10 data)
- `GET /api/weather` — proxies OpenWeatherMap, converts timestamps to ms, translates to Polish
- `GET /api/health` — health check

No database, no middleware beyond CORS. Static data is hardcoded arrays in `server.js`.

### Frontend (`frontend/src/`)

React 18 functional components with CSS Modules. No state management library.

**Routing**: Tab-based navigation in `App.jsx` via `activePage` state — no React Router. Five pages: `AedPage`, `AirPage`, `WeatherPage`, `ToiletsPage`, `EcoPage`.

**Theme system** (`hooks/useTheme.js`): Automatic day/night/dusk switching using OpenWeatherMap sunrise/sunset times for Mysłowice. Sets `data-theme` attribute on `<html>` (`light` | `dusk` | `dark`). Refreshes sun times every hour, checks current theme every minute. Components that need to react to theme changes (e.g. map tile layers) use `MutationObserver` on `document.documentElement`.

**Data fetching** (`hooks/useFetch.js`): Generic hook returning `{ data, loading, error }`. Uses `AbortController` for cleanup.

**Maps** (`AedPage.jsx`): react-leaflet with tile layer switching — CartoDB Voyager (light/dusk) vs CartoDB Dark Matter (dark). Custom red circle markers. `L.Icon.Default` prototype is patched to use CDN icons.

**Vite proxy**: All `/api/*` requests in dev are proxied to backend via `VITE_API_URL` env var (defaults to `http://localhost:3001`).

### Styling conventions

- Every component has a paired `.module.css` file
- Theme-aware styles use `[data-theme="dark"]` selectors on `:root` or component roots
- Google Fonts: Space Grotesk (UI), DM Serif Display (accents)
- CSS custom properties drive colors; transitions are 2s for theme changes

# Smart Mysłowice — Dashboard miejski

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5-000?logo=express)](https://expressjs.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com)
[![Testy](https://img.shields.io/badge/Testy-43_passing-22d3a5)](#testy)
[![Audit](https://img.shields.io/badge/Audit-0_vulnerabilities-22d3a5)](#bezpieczeństwo)
[![Licencja](https://img.shields.io/badge/Licencja-MIT-green)](LICENSE)

**Smart Mysłowice** to nowoczesny, responsywny dashboard agregujący dane miejskie dla Mysłowic w czasie rzeczywistym — jakość powietrza, pogodę, stan wód, defibrylatory AED, toalety publiczne i punkty selektywnej zbiórki odpadów. Aplikacja dostępna jest w języku **polskim i angielskim**.

🌐 **[smart-myslowice.pl](https://smart-myslowice.pl)**

---

## Funkcje

| Moduł | Opis | Źródło danych |
|---|---|---|
| 🌫️ **Jakość powietrza** | Stacje GIOŚ i Airly z PM2.5, PM10, indeksem CAQI oraz 24-godzinną historią (wykres Chart.js) | [GIOŚ](https://powietrze.gios.gov.pl) + [Airly](https://airly.org) |
| 🌤️ **Pogoda** | Temperatura, wilgotność, wiatr, odczucie termiczne, ciśnienie, UV, wschód/zachód słońca — z automatycznym motywem dnia/zmierzchu/nocy | [OpenWeatherMap](https://openweathermap.org) |
| 💧 **Stan wód** | Mapa Leaflet + lista stacji IMGW z klasyfikacją (bezpieczny / ostrzegawczy / alarmowy), geolokalizacją najbliższej stacji | [IMGW](https://danepubliczne.imgw.pl) |
| 📍 **Defibrylatory AED** | Mapa + lista 14 urządzeń z lokalizacją, godzinami dostępności, geolokalizacją najbliższego i przyciskiem 112 | Dane statyczne |
| 🚻 **Toalety publiczne** | Lista toalet miejskich z informacją o opłatach i dostępie | Dane statyczne |
| ♻️ **Eko-punkty** | PSZOK, zbiórka leków, elektrośmieci, baterii, tekstyliów — posegregowane według kategorii | Dane statyczne |
| 🤖 **Asystent AI** | Czat w prawym dolnym rogu. Rozumie pytania w języku naturalnym o wszystkie moduły. Działa offline (rules-based) lub z LLM (OpenAI/Anthropic/Ollama) | Silnik reguł + opcjonalny LLM |

### Cechy przekrojowe

- 🌓 **Automatyczny motyw** (light → dusk → dark) na podstawie rzeczywistego wschodu/zachodu słońca. Ręczne przełączanie dostępne.
- 🌐 **Dwujęzyczność** — pełne tłumaczenie PL/EN. Wykrywanie z przeglądarki, zapis w `localStorage`. Dynamiczne meta tagi SEO.
- 🗺️ **Mapy Leaflet** z warstwą CartoDB (dostosowują się do motywu) i granicą miasta z Nominatim.
- 📱 **PWA** — instalowalna, service worker (stale-while-revalidate), offline dla odwiedzonych zasobów.
- 📐 **Responsywność** — desktop (mapa + lista obok siebie), mobile (stack).
- 🧭 **Geolokalizacja** — znajdź najbliższy AED / stację wodowskazową (wzór haversine).
- 🔒 **Bezpieczeństwo** — Helmet (CSP, X-Frame-Options), rate limiting (60/min API, 200/min ogólny).
- 🧪 **43 testy** — hooki, komponenty, strony, API.

---

## Stack technologiczny

| Warstwa | Technologia | Wersja |
|---|---|---|
| UI | [React](https://react.dev) | ^19.0.0 |
| Bundler | [Vite](https://vitejs.dev) | ^6.3.0 |
| Język | [TypeScript](https://www.typescriptlang.org) | ^6.0.3 |
| Routing | [React Router](https://reactrouter.com) | ^7.15.0 |
| Mapy | [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org) | ^1.9.4 / ^5.0.0 |
| Wykresy | [Chart.js](https://www.chartjs.org) + [react-chartjs-2](https://react-chartjs-2.js.org) | ^4.5.1 / ^5.3.1 |
| Backend | [Express](https://expressjs.com) | ^5.2.1 |
| Bezpieczeństwo | [Helmet](https://helmetjs.github.io) + [express-rate-limit](https://express-rate-limit.mintlify.app) | ^8.2.0 / ^8.5.2 |
| Testy | [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com) | ^4.1.5 / ^16.3.2 |
| Linter | [ESLint](https://eslint.org) (flat config) + [typescript-eslint](https://typescript-eslint.io) | ^10.3.0 / ^8.59.2 |
| Formatter | [Prettier](https://prettier.io) | ^3.8.3 |
| Git hooks | [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) | ^9.1.7 / ^17.0.4 |
| Monitoring błędów | [Sentry](https://sentry.io) (opcjonalnie) | ^10.52.0 |
| Proces manager | [PM2](https://pm2.keymetrics.io) | ^5.x |
| Reverse proxy | [Nginx](https://nginx.org) + Certbot (SSL) | Ubuntu 22.04 |
| Stylowanie | CSS Modules + CSS Custom Properties | — |

---

## Wymagania wstępne

- **Node.js** 18.x+ (zalecane 22.x LTS)
- **npm** 9.x+
- Klucze API — **opcjonalne** (aplikacja działa w pełni na danych mockowych)

---

## Instalacja i uruchomienie lokalnie

```bash
# 1. Sklonuj
git clone https://github.com/krzysztofzelman/smart-myslowice-v2.git
cd smart-myslowice-v2/frontend

# 2. Zainstaluj zależności
npm install

# 3. Uruchom (frontend Vite + API lokalnie)
npm run dev:all
```

> `npm run dev:all` uruchamia jednocześnie:
> - Vite dev server na `http://localhost:5173` (frontend z HMR)
> - Lokalny serwer API na `http://localhost:3001` (Express, dynamicznie ładuje `api/*.js`)
>
> Vite proxy automatycznie kieruje `/api/*` na lokalny serwer API.

Aplikacja dostępna pod **http://localhost:5173**.

### Inne tryby

```bash
npm run dev          # Tylko frontend (API niedostępne)
npm run dev:api      # Tylko serwer API
npm run build        # Budowa produkcyjna (dist/)
node server.js       # Serwer produkcyjny (wymaga dist/)
```

---

## Zmienne środowiskowe

Plik `.env` w `frontend/` (skopiuj z `.env.example`). Wszystkie klucze są opcjonalne.

| Zmienna | Wymagany | Źródło | Opis |
|---|---|---|---|
| `OWM_API_KEY` | ❌ (mock) | [OpenWeatherMap](https://openweathermap.org/api) | Aktualna pogoda |
| `AIRLY_API_KEY` | ❌ (mock) | [Airly](https://developer.airly.org) | Jakość powietrza |
| `VITE_SENTRY_DSN` | ❌ | [Sentry](https://sentry.io) | Monitoring błędów |
| `AI_API_KEY` | ❌ (rules) | OpenAI / Anthropic | Asystent AI (LLM) |
| `AI_MODEL` | ❌ | — | Np. `gpt-4`, `claude-3-haiku` |
| `AI_API_URL` | ❌ | — | Endpoint LLM |
| `PORT` | ❌ | — | Port Express (domyślnie 3001) |

---

## Deployment (VPS Ubuntu 22.04)

```bash
# Na serwerze
cd /var/www/smart-myslowice/frontend
git pull
npm install
npm run build
pm2 restart smart-myslowice
```

Szczegółowa instrukcja: **[frontend/DEPLOY.md](frontend/DEPLOY.md)**

| Element | Szczegóły |
|---|---|
| Proces manager | PM2 (fork, 1 instancja, max 512 MB) |
| Reverse proxy | Nginx (port 80/443 → 3001) |
| SSL | Let's Encrypt (Certbot) |
| Domena | [smart-myslowice.pl](https://smart-myslowice.pl) |

---

## Struktura projektu

```
smart-myslowice/
├── frontend/
│   ├── api/                        # Endpointy API (Node.js ESM)
│   │   ├── aed.js                  #   AED (statyczne)
│   │   ├── ai-assistant.js         #   Asystent AI (rules + LLM)
│   │   ├── air.js                  #   Jakość powietrza (GIOŚ + Airly)
│   │   ├── air-history.js          #   Historia 24h (Airly)
│   │   ├── eco.js                  #   Eko-punkty (statyczne)
│   │   ├── toilets.js              #   Toalety (statyczne)
│   │   ├── transit-stops.js        #   ⛔ Przystanki GTFS (wyłączone)
│   │   ├── transit-vehicles.js     #   ⛔ Pojazdy GTFS-RT (wyłączone)
│   │   ├── water-level.js          #   Stan wód (IMGW)
│   │   └── weather.js              #   Pogoda (OpenWeatherMap)
│   ├── public/                     # Pliki statyczne, PWA
│   │   ├── manifest.json           # Manifest PWA
│   │   ├── sw.js                   # Service Worker
│   │   ├── icon-*.svg              # Ikony PWA
│   │   └── robots.txt / sitemap.xml
│   ├── src/
│   │   ├── main.tsx                # Entry point
│   │   ├── App.tsx                 # Routing + layout
│   │   ├── index.css               # Style globalne + motywy
│   │   ├── ThemeContext.tsx         # Kontekst motywu
│   │   ├── i18n/                   # 🌐 Internacjonalizacja
│   │   │   ├── translations.ts     #   Słownik PL/EN (200+ kluczy)
│   │   │   └── LanguageContext.tsx  #   Provider + useLanguage hook
│   │   ├── types/api.ts            # Typy TypeScript
│   │   ├── hooks/
│   │   │   ├── useFetch.ts         #   Fetch z timeoutem i abortem
│   │   │   ├── useTheme.ts         #   Automatyczny motyw
│   │   │   └── useAIAssistant.ts   #   Komunikacja z asystentem
│   │   ├── utils/
│   │   │   ├── geo.ts              #   Haversine
│   │   │   └── waterStatus.ts      #   Klasyfikacja stanu wód
│   │   ├── data/
│   │   │   └── stationCoordinates.ts # Współrzędne stacji (fallback)
│   │   ├── components/
│   │   │   ├── Header.tsx          # Nagłówek + przełącznik języka/motywy
│   │   │   ├── Nav.tsx             # Nawigacja kart
│   │   │   ├── Card.tsx            # Komponent karty
│   │   │   ├── Badge.tsx           # Komponent znaczka statusu
│   │   │   ├── CityBorder.tsx      # Granica miasta (Nominatim GeoJSON)
│   │   │   ├── WaterMap.tsx        # Mapa Leaflet (stan wód)
│   │   │   ├── AirHistoryModal.tsx # Modal z wykresem 24h
│   │   │   ├── AIAssistant.tsx     # Asystent AI (czat)
│   │   │   └── ErrorBoundary.tsx   # Granica błędu React
│   │   ├── pages/
│   │   │   ├── AirPage.tsx         # Jakość powietrza
│   │   │   ├── AedPage.tsx         # Defibrylatory AED
│   │   │   ├── WeatherPage.tsx     # Pogoda
│   │   │   ├── ToiletsPage.tsx     # Toalety
│   │   │   ├── EcoPage.tsx         # Eko-punkty
│   │   │   └── WaterPage.tsx       # Stan wód
│   │   └── tests/                  # Testy (Vitest)
│   │       ├── setup.js
│   │       ├── useFetch.test.jsx   # 6 testów
│   │       ├── Card.test.jsx       # 5 testów
│   │       ├── Badge.test.jsx      # 3 testy
│   │       ├── ErrorBoundary.test.jsx # 3 testy
│   │       ├── AedPage.test.jsx    # 1 test
│   │       ├── AirPage.test.jsx    # 1 test
│   │       ├── AIAssistant.test.tsx # 10 testów
│   │       └── api/
│   │           └── ai-assistant.test.js # 14 testów
│   ├── server.js                   # Serwer produkcyjny Express
│   ├── dev-api-server.mjs          # Lokalny serwer API (dev)
│   ├── ecosystem.config.cjs        # PM2 config
│   ├── eslint.config.js            # Flat config ESLint v10
│   ├── tsconfig.json               # Strict mode
│   ├── vite.config.js
│   ├── vitest.config.js
│   ├── DEPLOY.md                   # Instrukcja deploymentu
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json
├── LICENSE
└── README.md
```

---

## API Endpoints

| Endpoint | Metoda | Źródło | Klucz | Cache | Opis |
|---|---|---|---|---|---|
| `/api/air` | GET | GIOŚ + Airly | Opcjonalny | 30 min | Sensory w promieniu 20 km od Mysłowic |
| `/api/air-history` | GET | Airly | Opcjonalny | — | Historia PM2.5/PM10 (`?installationId=`) |
| `/api/weather` | GET | OpenWeatherMap | Opcjonalny | — | Aktualna pogoda dla Mysłowic |
| `/api/water-level` | GET | IMGW | Nie | 15 min | Stacje hydrologiczne w promieniu 50 km |
| `/api/aed` | GET | Statyczne | Nie | — | 14 defibrylatorów AED |
| `/api/toilets` | GET | Statyczne | Nie | — | 8 toalet publicznych |
| `/api/eco` | GET | Statyczne | Nie | — | Punkty selektywnej zbiórki |
| `/api/ai-assistant` | POST | Rules + LLM | Opcjonalny | IP rate 10/min | Asystent AI w języku naturalnym |
| `/api/transit-stops` | GET | GTFS | Nie | 24h | ⛔ **Wyłączone** (HTTP 410) |
| `/api/transit-vehicles` | GET | GTFS-RT | Nie | 15s | ⛔ **Wyłączone** (HTTP 410) |

---

## Testy

```bash
cd frontend
npm test              # Uruchom wszystkie (CI mode)
npx vitest --ui       # UI w przeglądarce
```

43 testy w 8 plikach:

| Plik | Testy | Zakres |
|---|---|---|
| `useFetch.test.jsx` | 6 | Hook fetch: loading, dane, błędy, timeout, cleanup |
| `Card.test.jsx` | 5 | Renderowanie, akcent, klasy |
| `Badge.test.jsx` | 3 | Treść, warianty, klasy CSS |
| `ErrorBoundary.test.jsx` | 3 | Łapanie błędów, fallback |
| `AedPage.test.jsx` | 1 | Renderowanie strony AED |
| `AirPage.test.jsx` | 1 | Renderowanie strony powietrza |
| `AIAssistant.test.tsx` | 10 | Interfejs, wysyłanie, odpowiedzi, dostępność |
| `api/ai-assistant.test.js` | 14 | Walidacja, intencje, rate limiting |

---

## Bezpieczeństwo

- **Helmet** — nagłówki CSP, X-Frame-Options, X-Content-Type-Options
- **Rate limiting** — 60 żądań/min na API, 200/min ogólnie
- **Express** — limit JSON body 10 KB
- **npm audit** — 0 podatności
- **.env** — chroniony przez `.gitignore`, `chmod 600` na serwerze
- **SSL** — Let's Encrypt, automatyczne odnowienie

---

## Źródła danych

| Źródło | Typ danych | Licencja |
|---|---|---|
| [GIOŚ](https://powietrze.gios.gov.pl) | Jakość powietrza | Otwarte dane publiczne |
| [Airly](https://developer.airly.org) | Jakość powietrza (API) | API dla deweloperów |
| [OpenWeatherMap](https://openweathermap.org) | Pogoda | CC BY-SA 4.0 |
| [IMGW-PIB](https://danepubliczne.imgw.pl) | Stany wód | Otwarte dane publiczne |
| [OpenStreetMap](https://www.openstreetmap.org) | Granica miasta, podkład map | ODbL |
| [CartoDB](https://carto.com/attributions) | Kafelki map | CC BY |
| [Transport GZM](https://www.metropoliaztm.pl) | GTFS (wyłączone) | Otwarte dane |

---

## Wkład w projekt

### Możliwe kierunki rozwoju

- **TypeScript** — konwersja pozostałych plików `.jsx` na `.tsx`
- **Transport** — przywrócenie GTFS-RT (aktualnie zwraca 410)
- **Optymalizacja** — lazy loading dla CityBorder (155 KB GeoJSON)
- **PWA** — rozszerzenie cache'owania offline
- **Testy** — testy dla WeatherPage, ToiletsPage, EcoPage, WaterPage
- **Asystent AI** — nowe intencje (transport, wydarzenia, zabytki)

### Jak zacząć

```bash
git clone https://github.com/krzysztofzelman/smart-myslowice-v2.git
cd smart-myslowice-v2/frontend
npm install
npm run dev:all

# Przed PR:
npm run lint && npm test && npx tsc --noEmit
```

---

## Licencja

MIT — zobacz [LICENSE](LICENSE).

Dane zewnętrzne podlegają odrębnym licencjom ich dostawców (patrz sekcja [Źródła danych](#źródła-danych)).

---

## O projekcie

Dashboard miejski agregujący otwarte dane publiczne dla Mysłowic. Projekt edukacyjny łączący nowoczesny frontend (React 19, Vite 6, TypeScript 6) z backendem Express i deploymentem na VPS Ubuntu przez PM2 + Nginx.

**[smart-myslowice.pl](https://smart-myslowice.pl)** — Twoje miasto w zasięgu kliknięcia.

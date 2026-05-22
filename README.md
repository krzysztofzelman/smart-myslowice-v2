# Smart Mysłowice — Dashboard miejski

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5-000?logo=express)](https://expressjs.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint)](https://eslint.org)
[![PM2](https://img.shields.io/badge/PM2-5-2B037A?logo=pm2)](https://pm2.keymetrics.io)
[![Testy](https://img.shields.io/badge/Testy-43_passing-22d3a5)](#testy)
[![Licencja](https://img.shields.io/badge/Licencja-MIT-green)](LICENSE)

**Smart Mysłowice** to nowoczesna, responsywna aplikacja webowa typu dashboard, agregująca dane miejskie dla **Mysłowic** w czasie rzeczywistym. Łączy informacje z otwartych źródeł publicznych — GIOŚ, Airly, OpenWeatherMap, IMGW, OpenStreetMap oraz zbiory statyczne — w jednym, przejrzystym interfejsie z mapami, wykresami i automatycznym motywem dnia/zmierzchu/nocy.

Aplikacja dostępna jest pod adresem **[smart-myslowice.pl](https://smart-myslowice.pl)**.

---

## Funkcje aplikacji

| # | Moduł | Opis | Źródło danych |
|---|---|---|---|
| 🌫️ | **Jakość powietrza** | Stacje pomiarowe GIOŚ i Airly z PM2.5, PM10, indeksem jakości oraz 24-godzinną historią (wykres Chart.js) | [GIOŚ](https://powietrze.gios.gov.pl) + [Airly](https://airly.org) |
| 💧 | **Stan wód** | Mapa Leaflet + lista stacji hydrologicznych IMGW z klasyfikacją stanu (bezpieczny / ostrzegawczy / alarmowy), geolokalizacją najbliższej stacji, możliwością kliknięcia w punkt na mapie | [IMGW](https://danepubliczne.imgw.pl) |
| 🌤️ | **Pogoda** | Aktualna temperatura, wilgotność, wiatr, odczucie termiczne, wschód/zachód słońca (wykorzystywane też do automatycznego motywu) | [OpenWeatherMap](https://openweathermap.org) |
| 📍 | **Defibrylatory AED** | Mapa Leaflet + lista urządzeń AED z lokalizacją, godzinami dostępności i geolokalizacją najbliższego urządzenia | Dane statyczne |
| 🚻 | **Toalety publiczne** | Lista toalet miejskich z informacją o dostępie i opłatach | Dane statyczne |
| ♻️ | **Eko-punkty (PSZOK)** | Punkty selektywnej zbiórki odpadów pogrupowane według typu, z godzinami otwarcia i listą przyjmowanych materiałów | Dane statyczne |
| 🚌 | **Transport** | (W przygotowaniu) Przystanki i pojazdy komunikacji miejskiej na żywo z GTFS-RT | [Transport GZM](https://www.metropoliaztm.pl) |
| 🤖 | **Asystent AI** | Asystent odpowiadający na pytania w języku naturalnym o dane miejskie. Rozumie pytania o jakość powietrza, AED, pogodę, toalety, PSZOK, stan wód. Działa w trybie rules-based (offline) lub z integracją zewnętrznego modelu LLM (OpenAI, Anthropic, Ollama). Zwijany czat w prawym dolnym rogu, z historią konwersacji i linkami do szczegółów. | Wbudowany silnik reguł + opcjonalnie zewnętrzny LLM |

### Cechy przekrojowe

- 🌓 **Automatyczny motyw** — płynne przejścia między motywem jasnym, zmierzchowym i ciemnym, wyznaczane na podstawie rzeczywistych godzin wschodu i zachodu słońca (API OpenWeatherMap). Użytkownik może ręcznie przełączać motyw (cykl: light → dusk → dark).
- 🗺️ **Mapy Leaflet** — interaktywne mapy CartoDB (dark_all / voyager) dostosowujące się do motywu, z warstwą granicy miasta Mysłowice pobieraną z Nominatim (OpenStreetMap).
- 📱 **Progressive Web App (PWA)** — aplikację można zainstalować na urządzeniu jako aplikację natywną. Service worker w strategii `stale-while-revalidate` zapewnia działanie offline dla odwiedzonych wcześniej zasobów.
- 📐 **Responsywność** — w pełni responsywny układ: na desktopie mapa + lista obok siebie, na mobile jeden pod drugim.
- 🧭 **Geolokalizacja** — strony AED i stanu wód umożliwiają znalezienie najbliższego punktu względem aktualnej lokalizacji użytkownika (wzór haversine).
- 🗃️ **Fallback współrzędnych** — stacje hydrologiczne bez współrzędnych z API IMGW otrzymują przybliżone współrzędne z lokalnej bazy danych, co pozwala na wyświetlenie ich na mapie.

---

## Stack technologiczny

| Warstwa | Technologia | Wersja |
|---|---|---|
| Framework UI | [React](https://react.dev) | ^19.0.0 |
| Bundler | [Vite](https://vitejs.dev) | ^6.3.0 |
| Język | [TypeScript](https://www.typescriptlang.org) | ^6.0.3 |
| Mapy | [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org) | ^1.9.4 / ^5.0.0 |
| Wykresy | [Chart.js](https://www.chartjs.org) + [react-chartjs-2](https://react-chartjs-2.js.org) | ^4.5.1 / ^5.3.1 |
| Routing | [React Router](https://reactrouter.com) | ^7.15.0 |
| Backend / API | [Express](https://expressjs.com) (Node.js) | ^5.2.1 |
| Testy | [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com) | ^4.1.5 / ^16.3.2 |
| Linter | [ESLint](https://eslint.org) + [typescript-eslint](https://typescript-eslint.io) (flat config) | ^10.3.0 / ^8.59.2 |
| Formatter | [Prettier](https://prettier.io) | ^3.8.3 |
| Git hooks | [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) | ^9.1.7 / ^17.0.4 |
| Monitorowanie błędów | [Sentry](https://sentry.io) (opcjonalnie) | ^10.52.0 |
| Stylowanie | CSS Modules + CSS Custom Properties (motywy) | — |
| Asystent AI | Rules-based engine (intent matching) + opcjonalny LLM (OpenAI / Anthropic / Ollama) | — |
| Proces manager | [PM2](https://pm2.keymetrics.io) | — |
| Serwer produkcyjny | Nginx (reverse proxy) + Express | — |
| System | Ubuntu 22.04 LTS | — |
| Geokodowanie | [Nominatim](https://nominatim.openstreetmap.org) (OpenStreetMap) — granica miasta | — |

---

## Wymagania wstępne

- **Node.js** 18.x lub nowszy (zalecane 22.x LTS)
- **npm** 9.x lub nowszy
- Klucze API (opcjonalne — aplikacja działa w pełni na danych mockowych)

---

## Instalacja i uruchomienie lokalnie

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/zelmano/smart-myslowice.git
cd smart-myslowice

# 2. Zainstaluj zależności (katalog frontend/)
cd frontend
npm install

# 3. Uruchom w trybie deweloperskim (frontend + API lokalnie)
npm run dev:all
```

> **`npm run dev:all`** uruchamia jednocześnie:
> - `npm run dev` — serwer deweloperski Vite na `http://localhost:5173` (frontend z HMR)
> - `npm run dev:api` — lokalny serwer API na `http://localhost:3001` (Express, dynamicznie ładuje handlery z `api/`)

Vite proxy automatycznie przekierowuje żądania `/api/*` do lokalnego serwera API.

Aplikacja będzie dostępna pod adresem **http://localhost:5173**.

### Uruchamianie osobno

```bash
# Tylko frontend (API będzie niedostępne)
npm run dev

# Tylko serwer API
npm run dev:api

# Produkcyjnie — zbuduj frontend i uruchom serwer
npm run build
node server.js
# → http://localhost:3001
```

### Lokalny serwer API

Plik `dev-api-server.mjs` to lekki serwer Express, który wczytuje wszystkie pliki `.js` z katalogu `api/` i udostępnia je jako endpointy REST.

- Dynamiczne ładowanie handlerów (każdy plik `.js` w `api/` → `/:nazwapliku` endpoint)
- Zmienne środowiskowe z pliku `.env`
- Logowanie czasów odpowiedzi

---

## Zmienne środowiskowe

Plik `.env` (lub `.env.local`) w katalogu `frontend/`:

| Zmienna | Wymagana | Źródło | Opis |
|---|---|---|---|
| `OWM_API_KEY` | ❌ (mock) | [OpenWeatherMap](https://openweathermap.org/api) | Klucz API do pobierania aktualnej pogody |
| `AIRLY_API_KEY` | ❌ (mock) | [Airly](https://developer.airly.org) | Klucz API do danych o jakości powietrza |
| `VITE_SENTRY_DSN` | ❌ | [Sentry](https://sentry.io) | DSN do monitorowania błędów w produkcji |
| `AI_API_KEY` | ❌ (rules-based) | OpenAI / Anthropic / inny | Klucz API do zewnętrznego modelu językowego |
| `AI_MODEL` | ❌ | — | Nazwa modelu, np. `gpt-3.5-turbo`, `gpt-4`, `claude-3-haiku` |
| `AI_API_URL` | ❌ | — | URL endpointu API (dla OpenAI / Anthropic / Ollama) |
| `PORT` | ❌ | — | Port serwera Express (domyślnie: 3001) |

> Wszystkie strony działają w pełni bez kluczy API — brakujące dane są zastępowane danymi mockowymi. Jedynie dane IMGW (stan wód) są pobierane z publicznego API bez klucza.

---

## Źródła danych

| Źródło | Endpoint | Typ danych | Klucz wymagany |
|---|---|---|---|
| [IMGW-PIB](https://danepubliczne.imgw.pl) | `/api/water-level` | Stany wód stacji hydrologicznych (filtr 50 km od Mysłowic) | ❌ Publiczne API |
| [GIOŚ](https://powietrze.gios.gov.pl) | `/api/air` | Jakość powietrza (PM2.5, PM10) | ❌ Publiczne API |
| [Airly](https://developer.airly.org) | `/api/air`, `/api/air-history` | Jakość powietrza + 24h historia | ✅ `AIRLY_API_KEY` |
| [OpenWeatherMap](https://openweathermap.org) | `/api/weather` | Aktualna pogoda, wschód/zachód słońca | ✅ `OWM_API_KEY` |
| [Nominatim](https://nominatim.openstreetmap.org) | *(client-side)* | Granica administracyjna miasta (GeoJSON) | ❌ Publiczne API |
| [OpenStreetMap](https://www.openstreetmap.org) | *(via CartoDB tiles)* | Podkład map Leaflet | ❌ |
| Transport GZM | `/api/transit-stops`, `/api/transit-vehicles` | Przystanki GTFS i pojazdy na żywo GTFS-RT | ❌ Publiczne API |

---

## Struktura projektu

```
smart-myslowice/
├── frontend/                              # Główna aplikacja (React + Vite + TypeScript)
│   ├── api/                               # Endpointy API (Node.js ESM, Express)
│   │   ├── aed.js                         #   Statyczne dane AED (14 defibrylatorów)
│   │   ├── ai-assistant.js                #   Asystent AI (rules-based + opcjonalny LLM)
│   │   ├── air.js                         #   Jakość powietrza (GIOŚ + Airly, cache 30 min)
│   │   ├── air-history.js                 #   24h historia pomiarów (Airly)
│   │   ├── eco.js                         #   Punkty PSZOK (statyczne)
│   │   ├── toilets.js                     #   Toalety publiczne (statyczne)
│   │   ├── transit-stops.js               #   Przystanki (GTFS, cache 24h)
│   │   ├── transit-vehicles.js            #   Pojazdy na żywo (GTFS-RT, cache 15s)
│   │   ├── water-level.js                 #   Stan wód IMGW (cache 15 min, filtr 50 km)
│   │   └── weather.js                     #   Pogoda OpenWeatherMap
│   ├── public/                            #   Pliki statyczne i PWA
│   │   ├── manifest.json                  #   Manifest aplikacji PWA
│   │   ├── sw.js                          #   Service Worker (stale-while-revalidate)
│   │   ├── icon-192.svg                   #   Ikona 192×192
│   │   └── icon-512.svg                   #   Ikona 512×512
│   ├── src/                               #   Kod źródłowy React + TypeScript
│   │   ├── main.tsx                       #   Punkt wejściowy (BrowserRouter, Sentry, SW)
│   │   ├── App.tsx                        #   Główny komponent (lazy routing, theme context)
│   │   ├── App.module.css                 #   Style głównego layoutu
│   │   ├── index.css                      #   Globalne style + motywy (CSS custom properties)
│   │   ├── ThemeContext.tsx                #   Kontekst motywu (light / dusk / dark)
│   │   ├── constants.ts                   #   Stałe (mapowanie ikon OWM → emoji)
│   │   ├── vite-env.d.ts                  #   Deklaracje typów (CSS modules, Vite)
│   │   ├── types/
│   │   │   └── api.ts                     #   Typy TypeScript (WaterLevel, AirSensor, itd.)
│   │   ├── hooks/
│   │   │   ├── useAIAssistant.ts          #   Hook do komunikacji z API asystenta
│   │   │   ├── useFetch.ts                #   Generyczny hook fetch (AbortController, 10s timeout)
│   │   │   └── useTheme.ts                #   Auto-tryb: sunrise/sunset → light / dusk / dark
│   │   ├── utils/
│   │   │   ├── geo.ts                     #   Funkcje geolokalizacyjne (wzór haversine)
│   │   │   └── waterStatus.ts             #   Klasyfikacja stanu wód
│   │   ├── data/
│   │   │   └── stationCoordinates.ts      #   Współrzędne stacji hydrologicznych (fallback)
│   │   ├── components/
│   │   │   ├── AIAssistant.tsx / .module.css
│   │   │   ├── Header.tsx / .module.css
│   │   │   ├── Nav.tsx / .module.css
│   │   │   ├── Card.tsx / .module.css
│   │   │   ├── Badge.tsx / .module.css
│   │   │   ├── CityBorder.tsx
│   │   │   ├── WaterMap.tsx
│   │   │   ├── AirHistoryModal.tsx / .module.css
│   │   │   └── ErrorBoundary.tsx
│   │   ├── pages/
│   │   │   ├── AirPage.tsx / .module.css
│   │   │   ├── AedPage.tsx / .module.css
│   │   │   ├── WeatherPage.tsx / .module.css
│   │   │   ├── ToiletsPage.tsx / .module.css
│   │   │   ├── EcoPage.tsx / .module.css
│   │   │   ├── WaterPage.tsx / .module.css
│   │   │   └── ListPage.module.css
│   │   └── tests/                         #   Testy (Vitest + React Testing Library)
│   │       ├── setup.js
│   │       ├── useFetch.test.jsx
│   │       ├── Card.test.jsx
│   │       ├── Badge.test.jsx
│   │       ├── AedPage.test.jsx
│   │       ├── AirPage.test.jsx
│   │       ├── ErrorBoundary.test.jsx
│   │       ├── AIAssistant.test.tsx
│   │       └── api/
│   │           └── ai-assistant.test.js
│   ├── server.js                          #   Serwer produkcyjny Express
│   ├── dev-api-server.mjs                 #   Lokalny serwer API (developerski)
│   ├── ecosystem.config.cjs               #   Konfiguracja PM2
│   ├── DEPLOY.md                          #   Instrukcja deploymentu na VPS
│   ├── .env.example                       #   Szablon zmiennych środowiskowych
│   ├── .prettierrc
│   ├── eslint.config.js                   #   Flat config ESLint v10
│   ├── tsconfig.json                      #   Strict mode, ESNext, react-jsx
│   ├── vite.config.js
│   ├── vitest.config.js
│   └── package.json
├── package.json                           #   Skrypty proxy na poziomie repozytorium
├── .gitignore
├── LICENSE
└── README.md                              #   Ten plik
```

---

## Deployment (VPS — Ubuntu 22.04)

Aplikacja działa w środowisku produkcyjnym na serwerze VPS z Ubuntu 22.04, z użyciem **PM2** (process manager) i **Nginx** (reverse proxy).

```bash
# 1. Zainstaluj zależności i zbuduj frontend
cd /var/www/smart-myslowice/frontend
npm install
npm run build

# 2. Skonfiguruj zmienne środowiskowe
cp .env.example .env
nano .env

# 3. Uruchom przez PM2
pm2 start ecosystem.config.cjs
pm2 save
```

Serwer Express (`server.js`) serwuje zarówno zbudowany frontend (katalog `dist/`), jak i wszystkie endpointy API (`/api/*`). Nginx pełni rolę reverse proxy, przekierowując ruch z portów 80/443 na wewnętrzny port aplikacji (domyślnie 3001).

Szczegółowa instrukcja deploymentu znajduje się w pliku **[frontend/DEPLOY.md](frontend/DEPLOY.md)**.

| Element | Szczegóły |
|---|---|
| System operacyjny | Ubuntu 22.04 LTS |
| Proces manager | PM2 (fork mode, 1 instancja) |
| Reverse proxy | Nginx |
| Serwer aplikacji | Express (port 3001) |
| Domena | [smart-myslowice.pl](https://smart-myslowice.pl) |
| Autostart | `pm2 startup` (systemd) |
| Logi | `pm2 logs smart-myslowice` |
| Restart przy błędzie | Auto-restart (max 512 MB pamięci) |

---

## Testy

Projekt używa **Vitest** z **React Testing Library** i **jsdom**.

```bash
cd frontend

# Uruchom wszystkie testy (CI mode)
npm test

# Uruchom z UI (przeglądarka)
npx vitest --ui

# Uruchom w trybie watch
npx vitest
```

**Stan testów (43 testy w 9 plikach):**

| Plik | Testy | Zakres |
|---|---|---|
| `useFetch.test.jsx` | 6 | Hook fetch: ładowanie, dane, błędy HTTP/sieci, timeout, cleanup |
| `Card.test.jsx` | 5 | Komponent Card: renderowanie, akcent, klasy, style |
| `Badge.test.jsx` | 3 | Komponent Badge: treść, warianty, klasy CSS |
| `ErrorBoundary.test.jsx` | 3 | Granica błędu: łapanie, fallback, props |
| `AedPage.test.jsx` | 1 | Renderowanie strony AED z listą defibrylatorów |
| `AirPage.test.jsx` | 1 | Renderowanie strony jakości powietrza |
| `AIAssistant.test.tsx` | 10 | Asystent: interfejs, wysyłanie, odpowiedzi, błędy, dostępność |
| `api/ai-assistant.test.js` | 14 | API asystenta: walidacja, intencje, dane, rate limiting |

---

## Skrypty npm (katalog `frontend/`)

| Komenda | Opis |
|---|---|
| `npm run dev` | Serwer deweloperski Vite (port 5173) |
| `npm run dev:api` | Lokalny serwer API (port 3001) |
| `npm run dev:all` | Vite + API jednocześnie (przez `concurrently`) |
| `npm run build` | Zbuduj aplikację do `dist/` |
| `npm run start` | Uruchom serwer produkcyjny (Express, wymaga `dist/`) |
| `npm run preview` | Podgląd zbudowanej aplikacji (Vite preview) |
| `npm run lint` | ESLint z automatyczną naprawą |
| `npm run format` | Prettier — formatowanie kodu |
| `npm test` | Uruchom testy Vitest (CI mode) |
| `npm run prepare` | Instalacja hooków Husky (automatycznie po `npm install`) |

---

## Wkład w projekt

Chcesz pomóc rozwijać Smart Mysłowice? Świetnie!

### 🤖 Asystent AI
- **Integracja z LLM** — odblokuj pełny potencjał asystenta przez ustawienie `AI_API_KEY` w `.env`.
- **Odpowiedzi głosowe** — synteza mowy (Web Speech API) dla odpowiedzi asystenta.
- **Nowe intencje** — rozszerzenie silnika rules-based o zapytania o transport, zabytki, wydarzenia.

### 🐛 Zgłaszanie błędów
Otwórz issue na GitHubie z opisem kroków do reprodukcji, zrzutem ekranu i konsolą błędów.

### 💡 Propozycje funkcji
Nowe źródło danych (jakość wody w Brynicy, parkometry, monitoring zieleni)? Nowy widok (archiwalne wykresy)? Integracja z PKP, ZTM, Urzędem Miasta?

### 🧪 Testy
- Testy dla WeatherPage, ToiletsPage, EcoPage, WaterPage
- Testy komponentów: WaterMap, CityBorder, Header, Nav
- Testy integracyjne: przełączanie motywu, nawigacja

### 🎨 UI/UX
- Udoskonalenia dostępności (a11y): kontrast, focus outline, aria-label
- Animacje przejść między stronami (React Router + CSS transitions)

### 🔧 Kod
- **TypeScript faza 2** — konwersja pozostałych stron i komponentów na TypeScript
- **Optymalizacja bundle** — code splitting dla map Leaflet
- **PWA** — rozszerzenie cache'owania offline

### Jak zacząć?

```bash
# 1. Forknij repozytorium
# 2. Sklonuj swojego forka
git clone https://github.com/twoj-user/smart-myslowice.git
cd smart-myslowice/frontend
npm install
npm run dev:all

# 3. Stwórz gałąź
git checkout -b feature/twoja-funkcja

# 4. Wprowadź zmiany, dodaj testy, uruchom:
npm run lint && npm test && npx tsc --noEmit

# 5. Wyślij Pull Request
git push origin feature/twoja-funkcja
```

---

## Licencja

MIT &mdash; zobacz plik [LICENSE](LICENSE).

### Dane zewnętrzne

Dane prezentowane w aplikacji pochodzą od zewnętrznych dostawców i podlegają ich odrębnym licencjom:

- **GIOŚ** — Główny Inspektorat Ochrony Środowiska — [otwarte dane publiczne](https://powietrze.gios.gov.pl)
- **Airly** — Airly Sp. z o.o. — [API dla deweloperów](https://developer.airly.org)
- **OpenWeatherMap** — OpenWeather Ltd. — [CC BY-SA 4.0](https://openweathermap.org/terms)
- **IMGW-PIB** — Instytut Meteorologii i Gospodarki Wodnej — [dane publiczne](https://danepubliczne.imgw.pl)
- **OpenStreetMap** — © Współtwórcy OpenStreetMap — [ODbL](https://www.openstreetmap.org/copyright)
- **CartoDB** — CARTO — [map tiles](https://carto.com/attributions)
- **Transport GZM** — Górnośląsko-Zagłębiowska Metropolia — [otwarte GTFS](https://www.metropoliaztm.pl)

---

## O projekcie

Projekt edukacyjny — Smart Mysłowice to dashboard miejski agregujący otwarte dane publiczne dla miasta **Mysłowice**. Aplikacja łączy w sobie informacje o jakości powietrza, stanie wód, pogodzie, defibrylatorach AED, toaletach publicznych i punktach selektywnej zbiórki odpadów, udostępniając je w przejrzystym, nowoczesnym interfejsie dostępnym na każdej klasie urządzeń.

**smart-myslowice.pl** &mdash; Twoje miasto w zasięgu kliknięcia.

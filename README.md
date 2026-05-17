# Smart Mysłowice v2 — Dashboard miejski

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint)](https://eslint.org)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000?logo=vercel)](https://vercel.com)
[![Testy](https://img.shields.io/badge/Testy-42_passing-22d3a5)](#testy)
[![Licencja](https://img.shields.io/badge/Licencja-MIT-green)](LICENSE)

**Smart Mysłowice** to nowoczesna, responsywna aplikacja webowa typu dashboard, agregująca dane miejskie dla Mysłowic w czasie rzeczywistym. Łączy informacje z wielu źródeł — GIOŚ, Airly, OpenWeatherMap, IMGW, OpenStreetMap oraz zbiory statyczne — w jednym interfejsie z mapami, wykresami i automatycznym motywem dnia/zmierzchu/nocy.

---

## Zrzuty ekranu

| Mapa stanu wód | Jakość powietrza | Widok na telefonie |
|---|---|---|
| ![zrzut mapy wód](screenshot-water.png) | ![zrzut jakości powietrza](screenshot-air.png) | ![zrzut mobilny](screenshot-mobile.png) |
| *Dodaj własny zrzut ekranu* | *Dodaj własny zrzut ekranu* | *Dodaj własny zrzut ekranu* |

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

### Cechy wspólne

- 🌓 **Automatyczny motyw** — płynne przejścia między motywem jasnym, zmierzchowym i ciemnym, wyznaczane na podstawie rzeczywistych godzin wschodu i zachodu słońca (API OpenWeatherMap). Użytkownik może ręcznie przełączać motyw (cykl: light → dusk → dark).
- 🗺️ **Mapy Leaflet** — interaktywne mapy CartoDB (dark_all / voyager) dostosowujące się do motywu, z warstwą granic miasta Mysłowice pobieraną z Nominatim (OpenStreetMap).
- 📱 **PWA** — aplikacja progresywna z service workerem (`stale-while-revalidate`), możliwa do zainstalowania na urządzeniu jako aplikacja. Manifest i ikony w `public/`.
- 📐 **Responsywność** — w pełni responsywny układ: na desktopie mapa + lista obok siebie, na mobile jeden pod drugim.
- 🧭 **Geolokalizacja** — strony AED i stanu wód umożliwiają znalezienie najbliższego punktu względem aktualnej lokalizacji użytkownika (z wykorzystaniem wzoru haversine).
- 🗃️ **Fallback współrzędnych** — stacje hydrologiczne bez współrzędnych z API IMGW otrzymują przybliżone współrzędne z lokalnej bazy danych (`stationCoordinates.ts`), co pozwala na wyświetlenie ich na mapie.

---

## Stack technologiczny

| Warstwa | Technologia | Wersja |
|---|---|---|
| Framework UI | [React](https://react.dev) | ^19.0.0 |
| Bundler | [Vite](https://vitejs.dev) | ^6.3.0 |
| Język | [TypeScript](https://www.typescriptlang.org) | ^6.0.3 |
| Mapy | [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org) | ^1.9.4 / ^5.0.0 |
| Wykresy (air history) | [Chart.js](https://www.chartjs.org) + [react-chartjs-2](https://react-chartjs-2.js.org) | ^4.5.1 / ^5.3.1 |
| Routing | [React Router](https://reactrouter.com) | ^7.15.0 |
| Testy | [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com) | ^4.1.5 / ^16.3.2 |
| Linter | [ESLint](https://eslint.org) + [typescript-eslint](https://typescript-eslint.io) (flat config) | ^10.3.0 / ^8.59.2 |
| Formatter | [Prettier](https://prettier.io) | ^3.8.3 |
| Git hooks | [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) | ^9.1.7 / ^17.0.4 |
| Monitorowanie błędów | [Sentry](https://sentry.io) (opcjonalnie, wymaga `VITE_SENTRY_DSN`) | ^10.52.0 |
| Stylowanie | [CSS Modules](https://github.com/css-modules/css-modules) + CSS Custom Properties (motywy) | — |
| Asystent AI | Rules-based engine (intent matching) + opcjonalny LLM (OpenAI / Anthropic / Ollama) | — |
| Backend/API | Vercel Serverless Functions (Node.js ESM) + `dev-api-server.mjs` (lokalnie) | — |
| Geokodowanie | [Nominatim](https://nominatim.openstreetmap.org) (OpenStreetMap) dla granicy miasta | — |
| Deployment | [Vercel](https://vercel.com) | — |

---

## Wymagania wstępne

- **Node.js** 18.x lub nowszy
- **npm** 9.x lub nowszy
- Konto na **Vercel** (do deploymentu)
- Klucze API (opcjonalne — aplikacja działa w pełni na danych mockowych)

---

## Instalacja i uruchomienie lokalnie

```bash
# 1. Sklonuj repozytorium
git clone <repo-url>
cd smart-myslowice

# 2. Zainstaluj zależności (katalog frontend/)
cd frontend
npm install

# 3. Uruchom w trybie deweloperskim (frontend + API lokalnie)
npm run dev:all
```

> **`npm run dev:all`** uruchamia jednocześnie:
> - `npm run dev` — Vite dev server na `http://localhost:5173` (frontend)
> - `npm run dev:api` — Lokalny serwer API na `http://localhost:3001` (uruchamia wszystkie handlery z `api/` przez Express)
>
> Vite proxy automatycznie przekierowuje żądania `/api/*` do lokalnego serwera API.

Aplikacja będzie dostępna pod adresem **http://localhost:5173**.

### Uruchamianie osobno

```bash
# Tylko frontend (API będzie niedostępne)
npm run dev

# Tylko serwer API
npm run dev:api
```

### Lokalny serwer API

Plik `dev-api-server.mjs` to lekki serwer Express, który wczytuje wszystkie pliki `.js` z katalogu `api/` i udostępnia je jako endpointy REST. Wspiera:

- Dynamiczne ładowanie handlerów (każdy plik `.js` w `api/` → `/:nazwapliku` endpoint)
- Zmienne środowiskowe z pliku `.env.local`
- Logowanie czasów odpowiedzi

---

## Zmienne środowiskowe

Plik `.env` (lub `.env.local`) w katalogu `frontend/`:

| Zmienna | Wymagana | Źródło | Opis |
|---|---|---|---|
| `OWM_API_KEY` | ❌ (mock) | [OpenWeatherMap](https://openweathermap.org/api) | Klucz API do pobierania aktualnej pogody. Bez klucza zwracane są dane mockowe. |
| `AIRLY_API_KEY` | ❌ (mock) | [Airly](https://developer.airly.org) | Klucz API do danych o jakości powietrza. Bez klucza zwracane są dane mockowe. |
| `VITE_SENTRY_DSN` | ❌ | [Sentry](https://sentry.io) | DSN do monitorowania błędów w produkcji. |
| `AI_API_KEY` | ❌ (rules-based) | OpenAI / Anthropic / inny | Klucz API do zewnętrznego modelu językowego (LLM). Bez klucza asystent działa w trybie rules-based (offline, bez zewnętrznego API). |
| `AI_MODEL` | ❌ | OpenAI / Anthropic / Ollama | Nazwa modelu, np. `gpt-3.5-turbo`, `gpt-4`, `claude-3-haiku`. Domyślnie: `gpt-3.5-turbo`. |
| `AI_API_URL` | ❌ | Dowolny | URL endpointu API (dla OpenAI: `https://api.openai.com/v1/chat/completions`, dla Ollama lokalnie: `http://localhost:11434/v1/chat/completions`). Domyślnie: `https://api.openai.com/v1/chat/completions`. |

> Wszystkie strony działają w pełni bez kluczy API — brakujące dane są zastępowane danymi mockowymi. Jedynie dane IMGW (stan wód) są pobierane z publicznego API bez klucza.

**Deployment (Vercel):** zmienne ustawia się w panelu Vercel:
_Project Settings → Environment Variables_ (dodaj dla Production, Preview i Development).

---

## Źródła danych

| Źródło | Endpoint | Typ danych | Klucz wymagany |
|---|---|---|---|
| [IMGW-PIB](https://danepubliczne.imgw.pl) | `/api/water-level` | Stany wód stacji hydrologicznych (filtr 50 km od Mysłowic) | ❌ Publiczne API |
| [GIOŚ](https://powietrze.gios.gov.pl) | `/api/air` | Jakość powietrza (PM2.5, PM10) | ❌ Publiczne API |
| [Airly](https://developer.airly.org) | `/api/air`, `/api/air-history` | Jakość powietrza + 24h historia | ✅ `AIRLY_API_KEY` |
| [OpenWeatherMap](https://openweathermap.org) | `/api/weather` | Aktualna pogoda, wschód/zachód słońca | ✅ `OWM_API_KEY` |
| [Nominatim](https://nominatim.openstreetmap.org) | *(client-side)* | Granica administracyjna miasta (GeoJSON) — używana w `CityBorder.tsx` | ❌ Publiczne API |
| [OpenStreetMap](https://www.openstreetmap.org) | *(via CartoDB tiles)* | Podkład map Leaflet (CartoDB dark_all / voyager) | ❌ |
| Transport GZM | `/api/transit-stops`, `/api/transit-vehicles` | Przystanki GTFS i pojazdy na żywo GTFS-RT | ❌ Publiczne API |

---

## Struktura projektu

```
smart-myslowice/
├── frontend/                              # Główna aplikacja (React + Vite + TypeScript)
│   ├── api/                               # Vercel Serverless Functions (Node.js ESM)
│   │   ├── aed.js                         #   Statyczne dane AED (14 defibrylatorów)
│   │   ├── ai-assistant.js                #   Asystent AI (rules-based + opcjonalny LLM, rate limiting)
│   │   ├── air.js                         #   Jakość powietrza (GIOŚ + Airly, cache 30 min)
│   │   ├── air-history.js                 #   24h historia pomiarów (Airly, mock fallback)
│   │   ├── eco.js                         #   Punkty PSZOK (statyczne)
│   │   ├── toilets.js                     #   Toalety publiczne (statyczne)
│   │   ├── transit-stops.js               #   Przystanki (GTFS, cache 24h)
│   │   ├── transit-vehicles.js            #   Pojazdy na żywo (GTFS-RT, cache 15s)
│   │   ├── water-level.js                 #   Stan wód IMGW (cache 15 min, filtr 50 km)
│   │   └── weather.js                     #   Pogoda OpenWeatherMap (mock fallback)
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
│   │   │   └── api.ts                     #   Typy TypeScript: WaterLevel, AirSensor, AedLocation, itd.
│   │   ├── hooks/
│   │   │   ├── useAIAssistant.ts          #   Hook do komunikacji z API asystenta (cache, timeout, abort)
│   │   │   ├── useFetch.ts                #   Generyczny hook fetch (AbortController, 10s timeout)
│   │   │   └── useTheme.ts                #   Auto-tryb: sunrise/sunset → light / dusk / dark
│   │   ├── data/
│   │   │   └── stationCoordinates.ts      #   Mockowane współrzędne stacji hydrologicznych (fallback)
│   │   ├── components/
│   │   │   ├── AIAssistant.tsx           #   Asystent AI – zwijany czat w prawym dolnym rogu
│   │   │   ├── AIAssistant.module.css
│   │   │   ├── Header.tsx                 #   Nagłówek: zegar, pogoda, przełącznik motywu
│   │   │   ├── Header.module.css
│   │   │   ├── Nav.tsx                    #   Nawigacja dolna (zakładki z emoji)
│   │   │   ├── Nav.module.css
│   │   │   ├── Card.tsx                   #   Uniwersalna karta (akcent, klikalna)
│   │   │   ├── Card.module.css
│   │   │   ├── Badge.tsx                  #   Znacznik statusu (green / amber / red / blue / muted)
│   │   │   ├── Badge.module.css
│   │   │   ├── CityBorder.tsx             #   Nakładka Leaflet z granicą miasta (Nominatim GeoJSON)
│   │   │   ├── WaterMap.tsx               #   Mapa Leaflet dla stacji wodnych z markerami i popupami
│   │   │   ├── AirHistoryModal.tsx        #   Modal z wykresem Chart.js (24h PM2.5/PM10)
│   │   │   ├── AirHistoryModal.module.css
│   │   │   └── ErrorBoundary.tsx          #   Granica błędu React z raportowaniem do Sentry
│   │   ├── pages/
│   │   │   ├── AirPage.tsx                #   Strona jakości powietrza (stacje + wykresy)
│   │   │   ├── AirPage.module.css
│   │   │   ├── AedPage.tsx                #   Strona AED (mapa Leaflet + lista + geolokalizacja)
│   │   │   ├── AedPage.module.css
│   │   │   ├── WeatherPage.tsx            #   Strona pogody (hero + szczegóły)
│   │   │   ├── WeatherPage.module.css
│   │   │   ├── ToiletsPage.tsx            #   Strona toalet publicznych
│   │   │   ├── ToiletsPage.module.css
│   │   │   ├── EcoPage.tsx                #   Strona eko-punktów PSZOK
│   │   │   ├── WaterPage.tsx              #   Strona stanu wód (WaterMap + lista + geolokalizacja)
│   │   │   ├── WaterPage.module.css
│   │   │   └── ListPage.module.css        #   Wspólny arkusz dla list (używany przez EcoPage)
│   │   └── tests/
│   │       ├── setup.js                   #   Konfiguracja testów (jest-dom, mock fetch)
│   │       ├── useFetch.test.jsx          #   6 testów: loading, sukces, HTTP error, network error, timeout, cleanup
│   │       ├── Card.test.jsx              #   5 testów: renderowanie, akcent, className, tytuł, style
│   │       ├── Badge.test.jsx             #   3 testy: treść, domyślny wariant, klasy wariantów
│   │       ├── AedPage.test.jsx           #   1 test: renderowanie strony AED
│   │       ├── AirPage.test.jsx           #   1 test: renderowanie strony powietrza
│   │       ├── ErrorBoundary.test.jsx     #   3 testy: granica błędu
│   │       ├── AIAssistant.test.tsx       #   10 testów: renderowanie, wysyłanie, odpowiedź, błąd, dostępność, nawigacja
│   │       └── api/
│   │           └── ai-assistant.test.js   #   14 testów: walidacja, intencje, API data, rate limiting
│   ├── .env.example                      #   Przykład zmiennych środowiskowych (API keys, AI)
│   ├── dev-api-server.mjs                #   Lokalny serwer API (Express, wczytuje api/*.js)
│   ├── .husky/
│   │   └── pre-commit                    #   Hook: lint-staged (ESLint + Prettier)
│   ├── .prettierrc                       #   singleQuote, semi:false, trailingComma:all
│   ├── eslint.config.js                  #   Flat config ESLint v10 (typescript-eslint)
│   ├── tsconfig.json                     #   Strict mode, ESNext, react-jsx
│   ├── vite.config.js                    #   @vitejs/plugin-react, proxy /api → :3001
│   ├── vitest.config.js                  #   Vitest + jsdom + setupFiles
│   ├── vercel.json                       #   SPA rewrites, API maxDuration: 30
│   └── package.json                      #   Zależności i skrypty
├── package.json                          #   Skrypty proxy na poziomie repozytorium
├── .gitignore
├── .qwen/                                #   Konfiguracja Qwen Code (asystent AI)
│   ├── settings.json
│   └── settings.json.orig
├── LICENSE                               #   Plik licencji MIT
└── README.md                             #   Ten plik
```

---

## Deployment (Vercel)

Projekt jest gotowy do deploymentu na Vercel — zawiera `vercel.json` z przekierowaniami SPA i konfiguracją serverless functions.

```bash
# 1. Zainstaluj Vercel CLI
npm i -g vercel

# 2. Zaloguj się
vercel login

# 3. Ustaw zmienne środowiskowe w Vercel
vercel env add OWM_API_KEY
vercel env add AIRLY_API_KEY

# 4. Deploy z katalogu frontend/
cd frontend
vercel --prod
```

**Konfiguracja w panelu Vercel:**
1. Podłącz repozytorium GitHub
2. Ustaw **Root Directory** → `frontend`
3. Dodaj zmienne środowiskowe: `OWM_API_KEY`, `AIRLY_API_KEY`
4. Framework preset → **Vite**
5. Build command → `npm run build`
6. Output directory → `dist`

Plik `vercel.json` zapewnia:
- Przekierowanie wszystkich ścieżek SPA do `index.html` (dla React Router)
- Maksymalny czas wykonania funkcji API: 30 sekund

---

## Testy

Projekt używa **Vitest** z **React Testing Library** i **jsdom**.

```bash
cd frontend

# Uruchom wszystkie testy (CI mode)
npm run test

# Uruchom z UI (przeglądarka)
npx vitest --ui

# Uruchom w trybie watch
npx vitest
```

**Wynik testów (43 testy, 42 ✅ / 1 ❌ w 8 plikach):**

| Plik | Testy | Opis |
|---|---|---|
| `useFetch.test.jsx` | 6 | Stan ładowania, dane, błąd HTTP, błąd sieci, timeout _(znany błąd:złe dopasowanie komunikatu)_, cleanup po unmount |
| `Card.test.jsx` | 5 | Renderowanie dzieci, kolor akcentu, className, tytuł, style inline |
| `Badge.test.jsx` | 3 | Renderowanie treści, domyślny wariant, klasa dla wariantu |
| `ErrorBoundary.test.jsx` | 3 | Łapanie błędów, renderowanie fallbacku, props children |
| `AedPage.test.jsx` | 1 | Renderowanie strony z listą defibrylatorów |
| `AirPage.test.jsx` | 1 | Renderowanie strony z danymi o jakości powietrza |
| `AIAssistant.test.tsx` | 10 | Przycisk, panel, wysyłanie zapytania, odpowiedź, wskaźnik pisania, błąd, dostępność, nawigacja |
| `api/ai-assistant.test.js` | 14 | Walidacja metody/pola/długości, intencje (powitanie, pomoc, powietrze, pogoda, AED z/bez koordynatów, toalety, eko, woda, nieznane), błędy API |

---

## Skrypty npm

| Komenda | Opis |
|---|---|
| `npm run dev` | Uruchom tylko serwer deweloperski Vite (port 5173) |
| `npm run dev:api` | Uruchom tylko lokalny serwer API (port 3001) |
| `npm run dev:all` | Uruchom jednocześnie Vite + API (przez `concurrently`) |
| `npm run build` | Zbuduj aplikację do `dist/` |
| `npm run preview` | Podgląd zbudowanej aplikacji (Vite preview) |
| `npm run lint` | Sprawdź kod ESLint (z automatyczną naprawą) |
| `npm run format` | Formatuj kod Prettier |
| `npm run test` | Uruchom testy Vitest (CI mode) |
| `npm run prepare` | Zainstaluj hooki Husky (automatycznie po `npm install`) |

---

## Wkład w projekt

Chcesz pomóc rozwijać Smart Mysłowice? Świetnie! Oto kilka obszarów, w których możesz się zaangażować:

### 🤖 Asystent AI
- **Integracja z zewnętrznym LLM** — odblokuj pełny potencjał asystenta przez ustawienie `AI_API_KEY`. Obecnie kod zawiera gotową integrację z OpenAI, Anthropic i Ollama (wystarczy zmienić `if (false && process.env.AI_API_KEY)` na `if (process.env.AI_API_KEY)` w `api/ai-assistant.js`).
- **Odpowiedzi głosowe** — dodanie syntezy mowy (Web Speech API) do odczytywania odpowiedzi asystenta.
- **Nowe intencje** — rozszerzenie rules-based engine o zapytania dotyczące transportu miejskiego, zabytków i wydarzeń w Mysłowicach.
- **Zapamiętywanie konwersacji** — dodanie kontekstu sesji (krótkotrwała pamięć ostatnich pytań) dla bardziej naturalnych rozmów.

### 🐛 Zgłaszanie błędów
- Otwórz issue w repozytorium GitHub
- Opisz krok po kroku, jak odtworzyć problem
- Dołącz zrzut ekranu i konsolę błędów (jeśli dotyczy)

### 💡 Propozycje funkcji
- Nowe źródło danych (np. jakość wody w Brynicy, parkometry, monitoring zieleni)?
- Nowy widok danych (np. archiwalne wykresy stanu wód)?
- Integracja z innym API (np. PKP, ZTM, Urząd Miasta)?

### 🧪 Testy
- Dodaj testy dla istniejących stron (WeatherPage, ToiletsPage, EcoPage, WaterPage)
- Dodaj testy jednostkowe dla komponentów (WaterMap, CityBorder, Header, Nav)
- Dodaj testy integracyjne (przełączanie motywu, nawigacja między stronami)

### 🎨 UI/UX
- Udoskonalenia dostępności (a11y): kontrast, focus outline, aria-label, rola
- Responsywność na małych ekranach (testy na urządzeniach mobilnych)
- Dodanie animacji przejść między stronami (React Router + CSS transitions)

### 🔧 Kod
- **TypeScript faza 2** — konwersja pozostałych stron i komponentów (Header, Nav) na TypeScript
- **React Router** — pełna integracja ścieżek zamiast state machine w App.tsx
- **Optymalizacja bundle** — code splitting dla map Leaflet (tree-shaking)

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
npm run lint && npm run test && npx tsc --noEmit

# 5. Wyślij Pull Request
git push origin feature/twoja-funkcja
```

---

## Licencja

MIT

```
MIT License

Copyright (c) 2026 Smart Mysłowice

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

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

## Autorzy

Projekt edukacyjny — Smart Mysłowice v2. Dashboard miejski agregujący otwarte dane publiczne dla miasta Mysłowice.

Ikona aplikacji: 💧 (emoji water droplet).

---

_Projekt edukacyjny — Smart Mysłowice v2 | Dashboard miejski dla Mysłowic_

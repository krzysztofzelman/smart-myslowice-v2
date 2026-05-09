# Smart Mysłowice v2 — Dashboard miejski

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint)](https://eslint.org)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000?logo=vercel)](https://vercel.com)
[![Licence](https://img.shields.io/badge/Licence-MIT-green)](LICENSE)

**Smart Mysłowice** to nowoczesna, responsywna aplikacja webowa typu dashboard, agregująca dane miejskie dla Mysłowic w czasie rzeczywistym. Łączy informacje z wielu źródeł — GIOS, Airly, OpenWeatherMap, IMGW oraz zbiory statyczne — w jednym interfejsie z mapą, wykresami i automatycznym motywem dnia/zmierzchu/nocy.

---

## Funkcje aplikacji

- **📍 Defibrylatory AED** — mapa i lista urządzeń AED wraz z lokalizacją, godzinami dostępności i geolokalizacją najbliższego urządzenia
- **🌫️ Jakość powietrza** — stacje pomiarowe GIOS i Airly z PM2.5, PM10, indeksem jakości oraz 24-godzinną historią (wykres Chart.js)
- **🌤️ Pogoda** — aktualna temperatura, wilgotność, wiatr, wschód/zachód słońca (OpenWeatherMap)
- **🚻 Toalety publiczne** — lista toalet miejskich z informacją o dostępie i opłatach
- **♻️ Eko-punkty (PSZOK)** — punkty selektywnej zbiórki odpadów z listą przyjmowanych materiałów
- **💧 Stan wód** — mapa i lista stacji hydrologicznych IMGW z klasyfikacją stanu (bezpieczny / ostrzegawczy / alarmowy)
- **🌓 Automatyczny motyw** — płynne przejścia między jasnym, zmierzchowym i ciemnym motywem na podstawie wschodu/zachodu słońca
- **🗺️ Mapy Leaflet** — interaktywne mapy z warstwą granic miasta i dostosowaniem do motywu
- **📱 PWA** — aplikacja progresywna z service workerem, możliwa do zainstalowania na urządzeniu

---

## Stack technologiczny

| Warstwa | Technologia | Wersja |
|---|---|---|
| Framework UI | [React](https://react.dev) | ^19.0.0 |
| Bundler | [Vite](https://vitejs.dev) | ^6.3.0 |
| Język | [TypeScript](https://www.typescriptlang.org) | ^6.0.3 |
| Mapy | [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org) | ^1.9.4 / ^5.0.0 |
| Wykresy | [Chart.js](https://www.chartjs.org) + [react-chartjs-2](https://react-chartjs-2.js.org) | ^4.5.1 / ^5.3.1 |
| Testy | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) | ^4.1.5 / ^16.3.2 |
| Linter | [ESLint](https://eslint.org) + [typescript-eslint](https://typescript-eslint.io) | ^10.3.0 / ^8.59.2 |
| Formatter | [Prettier](https://prettier.io) | ^3.8.3 |
| Git hooks | [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) | ^9.1.7 / ^17.0.4 |
| Środowisko testowe | [jsdom](https://github.com/jsdom/jsdom) | ^29.1.1 |
| Backend/API | Vercel Serverless Functions (Node.js ESM) | — |
| Deployment | [Vercel](https://vercel.com) | — |

---

## Wymagania wstępne

- **Node.js** 18.x lub nowszy
- **npm** 9.x lub nowszy
- Konto na **Vercel** (do deploymentu)
- Klucze API (patrz sekcja _Zmienne środowiskowe_)

---

## Instalacja i uruchomienie lokalnie

```bash
# 1. Sklonuj repozytorium
git clone <repo-url>
cd smart-myslowice

# 2. Zainstaluj zależności
cd frontend
npm install

# 3. Skonfiguruj zmienne środowiskowe
# Stwórz plik .env w katalogu frontend/
echo "OWM_API_KEY=twój_klucz_openweathermap" > .env
echo "AIRLY_API_KEY=twój_klucz_airly" >> .env

# 4. Uruchom w trybie deweloperskim (frontend standalone)
npm run dev
# → http://localhost:5173

# 5. (Opcjonalnie) Uruchom API lokalnie przez Vercel CLI
npm i -g vercel
vercel dev
# → http://localhost:3000 (API + frontend)
```

> **Uwaga:** Aplikacja działa lokalnie w trybie standalone — Vite serwuje frontend na porcie 5173.
> API (serverless functions) jest dostępne po deploymentzie na Vercel lub lokalnie przez `vercel dev`.

---

## Zmienne środowiskowe

Plik `.env` w katalogu `frontend/`:

| Zmienna | Wymagana | Źródło | Opis |
|---|---|---|---|
| `OWM_API_KEY` | ✅ Tak | [OpenWeatherMap](https://openweathermap.org/api) | Klucz API do pobierania aktualnej pogody dla Mysłowic |
| `AIRLY_API_KEY` | ✅ Tak | [Airly](https://developer.airly.org) | Klucz API do pobierania danych o jakości powietrza i historii pomiarów |

**Deployment (Vercel):** zmienne ustawia się w panelu Vercel:
_Project Settings → Environment Variables_ (dodaj dla Production, Preview i Development).

---

## Struktura projektu

```
smart-myslowice/
├── frontend/                          # Główna aplikacja (React + Vite)
│   ├── api/                           # Vercel Serverless Functions (Node.js ESM)
│   │   ├── aed.js                     #   Statyczne dane AED (14 defibrylatorów)
│   │   ├── air.js                     #   Jakość powietrza (GIOS + Airly, cache 30 min)
│   │   ├── air-history.js             #   24h historia pomiarów (Airly)
│   │   ├── eco.js                     #   Punkty PSZOK (statyczne)
│   │   ├── toilets.js                 #   Toalety publiczne (statyczne)
│   │   ├── transit-stops.js           #   Przystanki komunikacji (GTFS, cache 24h)
│   │   ├── transit-vehicles.js        #   Pojazdy na żywo (GTFS-RT, cache 15s)
│   │   ├── water-level.js             #   Stan wód IMGW (cache 15 min)
│   │   └── weather.js                 #   Pogoda OpenWeatherMap
│   ├── public/                        #   Pliki statyczne (PWA)
│   │   ├── manifest.json              #   Manifest aplikacji PWA
│   │   ├── sw.js                      #   Service Worker (stale-while-revalidate)
│   │   ├── icon-192.svg               #   Ikona 192×192
│   │   └── icon-512.svg               #   Ikona 512×512
│   ├── src/                           #   Kod źródłowy
│   │   ├── main.jsx                   #   Punkt wejściowy
│   │   ├── App.tsx                    #   Główny komponent (tab state machine)
│   │   ├── App.module.css             #   Style głównego layoutu
│   │   ├── index.css                  #   Globalne style + motywy (CSS custom properties)
│   │   ├── constants.js               #   Stałe (np. mapowanie ikon OWM → emoji)
│   │   ├── vite-env.d.ts              #   Deklaracje typów (CSS modules, Vite)
│   │   ├── ThemeContext.tsx            #   Kontekst motywu (jasny/zmierzch/ciemny)
│   │   ├── types/
│   │   │   └── api.ts                 #   Typy TypeScript dla danych API
│   │   ├── hooks/
│   │   │   ├── useFetch.ts            #   Generyczny hook fetch (AbortController, timeout)
│   │   │   └── useTheme.ts            #   Hook automatycznego motywu (sunrise/sunset)
│   │   ├── components/
│   │   │   ├── Header.tsx             #   Nagłówek: zegar, pogoda, przełącznik motywu
│   │   │   ├── Header.module.css
│   │   │   ├── Nav.tsx                #   Nawigacja (zakładki)
│   │   │   ├── Nav.module.css
│   │   │   ├── Card.tsx               #   Uniwersalna karta (akcent, klikalna)
│   │   │   ├── Card.module.css
│   │   │   ├── Badge.tsx             #   Znacznik statusu (zielony/żółty/czerwony/niebieski)
│   │   │   ├── Badge.module.css
│   │   │   ├── AirHistoryModal.jsx    #   Modal z wykresem historii powietrza (Chart.js)
│   │   │   └── AirHistoryModal.module.css
│   │   ├── pages/
│   │   │   ├── AedPage.jsx            #   Strona AED (mapa + lista + geolokalizacja)
│   │   │   ├── AedPage.module.css
│   │   │   ├── AirPage.jsx            #   Strona jakości powietrza (stacje + wykresy)
│   │   │   ├── AirPage.module.css
│   │   │   ├── WeatherPage.jsx        #   Strona pogody (hero + szczegóły)
│   │   │   ├── WeatherPage.module.css
│   │   │   ├── ToiletsPage.jsx        #   Strona toalet publicznych
│   │   │   ├── ToiletsPage.module.css
│   │   │   ├── EcoPage.jsx            #   Strona eko-punktów (PSZOK)
│   │   │   ├── WaterPage.jsx          #   Strona stanu wód (mapa + lista)
│   │   │   ├── WaterPage.module.css
│   │   │   └── ListPage.module.css    #   Wspólny arkusz dla list (EcoPage)
│   │   └── tests/
│   │       ├── setup.js               #   Konfiguracja testów (jest-dom, mock fetch)
│   │       ├── useFetch.test.jsx       #   Testy hooka useFetch (6 testów)
│   │       ├── AedPage.test.jsx        #   Test strony AED
│   │       ├── AirPage.test.jsx        #   Test strony jakości powietrza
│   │       ├── Badge.test.jsx          #   Test komponentu Badge (3 testy)
│   │       └── Card.test.jsx           #   Test komponentu Card (5 testów)
│   ├── .husky/
│   │   └── pre-commit                 #   Hook: lint-staged (ESLint + Prettier)
│   ├── .prettierrc                    #   Konfiguracja Prettier
│   ├── eslint.config.js               #   Konfiguracja ESLint (flat config)
│   ├── tsconfig.json                  #   Konfiguracja TypeScript (strict mode)
│   ├── vite.config.js                 #   Konfiguracja Vite (@vitejs/plugin-react)
│   ├── vitest.config.js               #   Konfiguracja Vitest (jsdom, setup)
│   ├── vercel.json                    #   Konfiguracja Vercel (SPA rewrites + timeout API)
│   └── package.json                   #   Zależności i skrypty
├── package.json                       #   Skrypty proxy na poziomie repozytorium
├── .gitignore
└── README.md                          #   Ten plik
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
2. Ustaw **Root Directory** na `frontend`
3. Dodaj zmienne środowiskowe: `OWM_API_KEY`, `AIRLY_API_KEY`
4. Framework preset: **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`

Plik `vercel.json` zapewnia:
- Przekierowanie wszystkich ścieżek SPA do `index.html`
- Maksymalny czas wykonania API: 30 sekund

---

## Testy

Projekt używa **Vitest** z **React Testing Library** i **jsdom**.

```bash
cd frontend

# Uruchom wszystkie testy
npm run test

# Uruchom z UI (przeglądarka)
npx vitest --ui

# Uruchom w trybie watch
npx vitest
```

**Pokrycie testów (16 testów w 5 plikach):**

| Plik | Testy | Opis |
|---|---|---|
| `useFetch.test.jsx` | 6 | Stan ładowania, sukces, błąd HTTP, błąd sieci, timeout, cleanup |
| `Card.test.jsx` | 5 | Renderowanie dzieci, kolor akcentu, className, tytuł, style |
| `Badge.test.jsx` | 3 | Renderowanie treści, domyślny wariant, klasy wariantów |
| `AedPage.test.jsx` | 1 | Renderowanie strony z defibrylatorami |
| `AirPage.test.jsx` | 1 | Renderowanie strony jakości powietrza |

---

## Skrypty npm

| Komenda | Opis |
|---|---|
| `npm run dev` | Uruchom serwer deweloperski Vite (port 5173) |
| `npm run build` | Zbuduj aplikację do `dist/` |
| `npm run preview` | Podgląd zbudowanej aplikacji |
| `npm run lint` | Sprawdź kod ESLint (z automatyczną naprawą) |
| `npm run format` | Formatuj kod Prettier |
| `npm run test` | Uruchom testy Vitest |
| `npm run prepare` | Zainstaluj hooki Husky (automatycznie po `npm install`) |

---

## Licencja

Projekt edukacyjny — brak określonej licencji. Wszelkie prawa do danych zastrzeżone przez ich dostawców:
- **GIOS** — Główny Inspektorat Ochrony Środowiska
- **Airly** — Airly Sp. z o.o.
- **OpenWeatherMap** — OpenWeather Ltd.
- **IMGW** — Instytut Meteorologii i Gospodarki Wodnej
- **Transport GZM** — Górnośląsko-Zagłębiowska Metropolia

---

_Projekt edukacyjny — Smart Mysłowice v2 | Dashboard miejski dla Mysłowic_

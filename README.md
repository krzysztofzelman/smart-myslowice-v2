# 🏙️ Smart Mysłowice

Nowoczesna platforma IoT dla Mysłowic — **React + Express**, automatyczny motyw dzienny/nocny.

## Stack

| Warstwa   | Technologia                                     |
|-----------|-------------------------------------------------|
| Frontend  | React 18, Vite, CSS Modules, React-Leaflet      |
| Backend   | Node.js (ESM), Express 4, node-fetch            |
| Mapa      | Leaflet + CartoDB Dark Matter tiles             |
| Pogoda    | OpenWeatherMap API (proxy przez backend)        |

## Automatyczny motyw 🌙 ☀️ 🌇

Motyw zmienia się automatycznie na podstawie wschodu i zachodu słońca z OWM:

| Pora          | Motyw                        |
|---------------|------------------------------|
| Dzień         | Jasny (biały, niebieski)     |
| ±30 min zmierzch/świt | Ciepły półmrok (bursztyn) |
| Noc           | Ciemny (granat, czerń)       |

Przejście trwa 2 sekundy — płynna animacja CSS.

## Uruchomienie

```bash
# Zainstaluj zależności
npm install
npm run install:all

# Uruchom backend + frontend jednocześnie
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Klucz API — produkcja

Przenieś klucz do zmiennej środowiskowej:

```bash
# backend/.env
OWM_API_KEY=twój_klucz_tutaj
```

```js
// backend/server.js
const apiKey = process.env.OWM_API_KEY;
```

## GitHub — nowe repozytorium

```bash
cd smart-myslowice

# Zainicjuj Git (jeśli jeszcze nie ma)
git init

# Pierwsza konfiguracja (jeśli nowy komputer)
git config user.name  "Twoje Imię"
git config user.email "email@example.com"

# Dodaj wszystkie pliki
git add .
git commit -m "feat: initial commit — Smart Mysłowice v2"

# Utwórz repo na GitHub (przez stronę lub GitHub CLI):
# gh repo create smart-myslowice-v2 --public

# Połącz i wypchnij
git remote add origin https://github.com/TWÓJ_LOGIN/smart-myslowice-v2.git
git branch -M main
git push -u origin main
```

## Endpointy API

| GET | /api/aed     | Defibrylatory AED        |
|-----|--------------|--------------------------|
| GET | /api/air     | Jakość powietrza          |
| GET | /api/weather | Pogoda + sunrise/sunset  |
| GET | /api/toilets | Publiczne toalety        |
| GET | /api/eco     | Punkty recyklingu        |
| GET | /api/health  | Health check             |

## Pomysły na rozwój

- [ ] 📍 "Znajdź najbliższy AED" — geolokalizacja przeglądarki
- [ ] 🚌 Rozkład MPK — przyjazdy autobusów w czasie rzeczywistym
- [ ] 🔔 Powiadomienia push przy złej jakości powietrza
- [ ] 🗺️ Jedna mapa z wszystkimi warstwami naraz
- [ ] 💾 Cache odpowiedzi API w backendzie (node-cache)
- [ ] 🅿️ Parkingi — dostępność miejsc


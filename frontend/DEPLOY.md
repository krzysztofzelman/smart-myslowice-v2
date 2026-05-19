# Deployment — Smart Mysłowice na własny serwer (VPS Ubuntu 22.04)

## Wymagania

- Ubuntu 22.04 VPS
- Node.js **22.x** (LTS)
- npm
- Git
- Nginx (opcjonalnie, jako reverse proxy)
- Domena (opcjonalnie, skonfigurowana z DNS na IP serwera)

---

## Krok 1 — Przygotowanie serwera (VPS)

```bash
# Aktualizacja systemu
sudo apt update && sudo apt upgrade -y

# Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# Sprawdź wersje
node --version   # >= 22
npm --version
```

---

## Krok 2 — Pobranie projektu na serwer

```bash
# Klonowanie repo
cd /var/www
sudo git clone <URL_TWOJEGO_REPO> smart-myslowice
cd smart-myslowice/frontend

# Instalacja zależności (produkcyjne + dev — dev potrzebne do zbudowania frontendu)
npm install

# Budowa frontendu (Vite)
npm run build
```

> **Uwaga:** `npm run build` tworzy katalog `dist/` ze statycznymi plikami frontendu.

---

## Krok 3 — Konfiguracja kluczy API (`.env`)

**WAŻNE:** Plik `.env` zawiera klucze API — NIGDY nie wrzucaj go do GIT-a.
Repozytorium ma `.gitignore` który pomija `.env`.

```bash
# Skopiuj szablon
cp .env.example .env

# Edytuj i wstaw swoje klucze
nano .env
```

Przykładowa zawartość `.env`:

```
# ── Klucze API ──
OWM_API_KEY=tutaj_twoj_klucz_openweathermap
AIRLY_API_KEY=tutaj_twoj_klucz_airly
VITE_SENTRY_DSN=https://twoj-dsn@sentry.io/123

# ── Port serwera (opcjonalnie, domyślnie 3001) ──
PORT=3001
```

> **Jak zdobyć klucze:**
> - **OpenWeatherMap** — https://home.openweathermap.org/api_keys (darmowe konto)
> - **Airly** — https://developer.airly.org (darmowy klucz deweloperski)
> - **Sentry** — https://sentry.io (opcjonalny, do monitorowania błędów)

**Zabezpieczenie pliku:**

```bash
chmod 600 .env
```

---

## Krok 4 — Uruchomienie (PM2 — auto-restart + autostart)

```bash
# Instalacja PM2 globalnie
sudo npm install -g pm2

# Uruchom aplikację
pm2 start ecosystem.config.cjs

# Zapisz listę procesów (żeby pm2 resurrect działał)
pm2 save

# Generuj skrypt autostartu (uruchamia PM2 po restarcie serwera)
pm2 startup
```

PM2 automatycznie uruchomi aplikację po resecie systemu.

**Przydatne komendy PM2:**

```bash
pm2 status                 # status procesów
pm2 logs smart-myslowice   # podgląd logów na żywo
pm2 restart smart-myslowice  # restart
pm2 stop smart-myslowice   # zatrzymanie
```

---

## Krok 5 — Reverse proxy (Nginx)

Aby aplikacja była dostępna na standardowym porcie 80 (HTTP) lub 443 (HTTPS),
skonfiguruj Nginx jako reverse proxy.

### Dla domeny (np. `twoja-domena.pl`)

Stwórz plik konfiguracyjny:

```bash
sudo nano /etc/nginx/sites-available/smart-myslowice
```

Wklej:

```nginx
server {
    listen 80;
    server_name twoja-domena.pl www.twoja-domena.pl;

    # Dla IP bez domeny:
    # listen 80;
    # server_name _;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Włącz konfigurację:

```bash
sudo ln -s /etc/nginx/sites-available/smart-myslowice /etc/nginx/sites-enabled/
sudo nginx -t          # sprawdź konfigurację
sudo systemctl reload nginx
```

---

## Krok 6 — SSL / HTTPS (Let's Encrypt / Certbot)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d twoja-domena.pl -d www.twoja-domena.pl
```

Certbot automatycznie zmodyfikuje konfigurację Nginx i odnowi certyfikat co 90 dni.

---

## Krok 7 — Firewall (UFW)

```bash
sudo ufw allow 22/tcp       # SSH
sudo ufw allow 80/tcp       # HTTP
sudo ufw allow 443/tcp      # HTTPS
sudo ufw enable
sudo ufw status
```

---

## Podsumowanie — struktura plików

```
/var/www/smart-myslowice/frontend/
├── api/                  # Endpointy API (Node.js)
├── dist/                 # Zbudowany frontend (generowany przez npm run build)
├── src/                  # Źródła React
├── server.js             # ✨ NOWY — serwer produkcyjny Express
├── ecosystem.config.cjs  # ✨ NOWY — konfiguracja PM2
├── .env                  # 🔒 Tworzysz lokalnie na serwerze (klucze API)
├── .env.example          # Szablon (bezpieczny do GIT)
├── package.json
├── DEPLOY.md             # ✨ NOWY — ta instrukcja
└── ...
```

---

## Rozwiązywanie problemów

| Problem | Rozwiązanie |
|---|---|
| Port 3001 zajęty | Zmień `PORT=3002` w `.env` i zaktualizuj `proxy_pass` w Nginx |
| API zwraca mocki | Sprawdź czy `.env` zawiera poprawne klucze i `chmod 600 .env` |
| Błąd `Cannot find module` | Uruchom `npm install` |
| Strona nie działa po `npm run build` | Sprawdź czy `dist/` istnieje i zawiera `index.html` |
| PM2 nie uruchamia się po reboot | Sprawdź `pm2 startup` — musiałeś uruchomić jako root |

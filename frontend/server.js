/**
 * Smart Mysłowice — Production Express Server
 *
 * Serves the built Vite frontend (dist/) and handles all /api/* routes.
 * Run:   node server.js
 * Build: npm run build  (run this first!)
 *
 * Environment variables (see .env.example):
 *   PORT           — port serwera (domyślnie 3001)
 *   OWM_API_KEY    — OpenWeatherMap
 *   AIRLY_API_KEY  — Airly
 *   VITE_SENTRY_DSN — Sentry (VITE_ prefiks dla Vite, czytany na kliencie)
 *   AI_API_KEY     — LLM (obecnie wyłączony)
 *   AI_MODEL       — model LLM (domyślnie gpt-3.5-turbo)
 *   AI_API_URL     — endpoint LLM (domyślnie https://api.openai.com/v1/chat/completions)
 */

import 'dotenv/config';
import express from 'express';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3001;

// Ustaw API_DEV_PORT tak, by AI assistant mógł wywoływać wewnętrzne API
// przez localhost (zamiast VERCEL_URL, którego nie ma na własnym serwerze).
if (!process.env.API_DEV_PORT) {
  process.env.API_DEV_PORT = String(PORT);
}

/* ── Middleware ────────────────────────────────────────────────────────── */

// Parsowanie JSON dla POST (potrzebne dla /api/ai-assistant)
app.use(express.json());

// Logowanie żądań
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`  ${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

/* ── API Routes — dynamicznie z api/*.js ──────────────────────────────── */

const API_DIR = join(__dirname, 'api');
const apiFiles = readdirSync(API_DIR).filter(f => f.endsWith('.js'));
let loaded = 0;

for (const file of apiFiles) {
  const route = '/api/' + file.replace(/\.js$/, '');
  const mod = await import(pathToFileURL(join(API_DIR, file)).href);
  const handler = mod.default;

  if (typeof handler !== 'function') {
    console.warn(`  ⚠ ${file} — brak default export function, pominięto`);
    continue;
  }

  app.all(route, async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error(`  ✗ ${route} — ${err.message}`);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
      }
    }
  });

  loaded++;
  console.log(`  ✓ ${route} ← ${file}`);
}

console.log(`\n  Załadowano ${loaded} endpointów API\n`);

/* ── Serwowanie statycznego frontendu (zbudowanego) ───────────────────── */

app.use(express.static(join(__dirname, 'dist'), {
  maxAge: '1y',
  immutable: true,
}));

// SPA fallback — wszystkie ścieżki niepasujące do API / statyk zwracają index.html
app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

/* ── Start ─────────────────────────────────────────────────────────────── */

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Smart Mysłowice — http://0.0.0.0:${PORT}`);
  console.log(`   Otwórz w przeglądarce: http://localhost:${PORT}\n`);
});

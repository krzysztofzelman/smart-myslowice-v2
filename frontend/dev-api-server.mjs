/**
 * Dev API server — uruchamia api/*.js (Vercel Serverless Functions) lokalnie.
 * Uruchom w osobnym terminalu obok `npm run dev`.
 * Vite proxy kieruje /api/* na ten serwer.
 *
 * Uwaga: Express 5 — req.query jest read-only, nie przypisuj do niego.
 */
import express from 'express';
import { readdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.API_DEV_PORT || 3001;
const API_DIR = join(__dirname, 'api');

// Load .env.local if exists (bez dotenv, manualnie)
const envPath = join(__dirname, '.env.local');
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (key && !process.env[key]) {
      process.env[key] = val;
    }
  }
  console.log('  .env.local loaded');
}

// Wczytaj pliki .js z api/ (flat, bez rekurencji)
const files = readdirSync(API_DIR).filter(f => f.endsWith('.js'));
let loaded = 0;

for (const file of files) {
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
      if (!res.headersSent) {
        res.status(500).json({ error: err.message });
      }
    }
  });

  loaded++;
  console.log(`  ✓ ${route.padEnd(25)} ← ${file}`);
}

app.listen(PORT, () => {
  console.log(`\nAPI dev server: http://localhost:${PORT}`);
  console.log(`Loaded ${loaded} handler(s) from ${API_DIR}\n`);
});

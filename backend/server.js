import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ── AED data ──────────────────────────────────────────────────────────────────
const aedLocations = [
  {
    id: 1,
    name: 'Mysłowickie Centrum Zdrowia – Szpital',
    address: 'ul. Mikołowska 1, 41-400 Mysłowice',
    coordinates: { lat: 50.2396846, lng: 19.1373742 },
    access: '24/7',
    description: 'Defibrylator przy Izbie Przyjęć szpitala',
  },
  {
    id: 2,
    name: 'Urząd Miasta Mysłowice',
    address: 'ul. Powstańców 1, 41-400 Mysłowice',
    coordinates: { lat: 50.2409042, lng: 19.1415714 },
    access: 'Pon–Pt 7:30–17:00',
    description: 'Defibrylator w holu głównym urzędu',
  },
  {
    id: 3,
    name: 'MOSiR – Hala Sportowa',
    address: 'ul. Bończyka 32z, 41-400 Mysłowice',
    coordinates: { lat: 50.2459527, lng: 19.1143236 },
    access: 'Pon–Pt 7:00–15:00',
    description: 'Defibrylator przy recepcji hali sportowej',
  },
  {
    id: 4,
    name: 'Straż Miejska',
    address: 'ul. Strażacka 7, 41-400 Mysłowice',
    coordinates: { lat: 50.2400854, lng: 19.1428678 },
    access: 'Codziennie 6:00–22:00',
    description: 'Defibrylator w siedzibie Straży Miejskiej',
  },
  {
    id: 5,
    name: 'Biblioteka Miejska – Filia Brzezinka',
    address: 'ul. Laryska 5, 41-404 Mysłowice',
    coordinates: { lat: 50.2039125, lng: 19.1571627 },
    access: 'Pon–Pt 10:00–18:00',
    description: 'Defibrylator w holu biblioteki',
  },
  {
    id: 6,
    name: 'Dworzec PKP Mysłowice',
    address: 'Dworzec PKP, 41-400 Mysłowice',
    coordinates: { lat: 50.237775, lng: 19.1406167 },
    access: '24/7',
    description: 'Defibrylator na głównym holu dworca',
  },
  {
    id: 7,
    name: 'Szpital nr 2 im. dr. T. Boczonia',
    address: 'ul. Bytomska 41, 41-400 Mysłowice',
    coordinates: { lat: 50.2471739, lng: 19.1330167 },
    access: '24/7',
    description: 'Defibrylator przy Izbie Przyjęć i SOR',
  },
];

// ── Static data ───────────────────────────────────────────────────────────────
const toilets = [
  { id: 1, name: 'Toaleta – Dworzec PKP', address: 'Dworzec PKP, 41-400 Mysłowice', access: '24/7', paid: true },
  { id: 2, name: 'Toaleta – Urząd Miasta', address: 'ul. Powstańców 1', access: 'Pon–Pt 7:30–17:00', paid: false },
  { id: 3, name: 'Toaleta – MOSiR', address: 'ul. Bończyka 32z', access: 'Godz. otwarcia', paid: false },
];

const ecoPoints = [
  { id: 1, name: 'PSZOK – Punkt Selektywnej Zbiórki', address: 'ul. Przemysłowa 1', access: 'Pon–Pt 8–16, Sob 9–13', accepts: 'Meble, AGD, elektronika, opony, baterie, farby, chemia' },
  { id: 2, name: 'Zbiórka Baterii – Urząd Miasta', address: 'ul. Powstańców 1', access: 'Pon–Pt 7:30–17:00', accepts: 'Baterie' },
  { id: 3, name: 'Zbiórka Baterii – Biblioteka', address: 'ul. Laryska 5', access: 'Pon–Pt 10–18', accepts: 'Baterie' },
  { id: 4, name: 'Punkt Tekstyliów – Kaufland', address: 'ul. Bytomska (parking Kaufland)', access: '24/7', accepts: 'Tekstylia, ubrania' },
];

const airSensors = [
  { id: 1, name: 'MOSiR – Bończyka', address: 'ul. Bończyka 32z', pm25: 18, quality: 'good' },
  { id: 2, name: 'Park Słupna', address: 'Park Słupna', pm25: 22, quality: 'good' },
  { id: 3, name: 'Urząd Miasta', address: 'ul. Powstańców 1', pm25: 35, quality: 'moderate' },
  { id: 4, name: 'Brzezinka – Biblioteka', address: 'ul. Laryska 5', pm25: 20, quality: 'good' },
  { id: 5, name: 'Bytomska 37', address: 'ul. Bytomska 37', pm25: 28, quality: 'moderate' },
  { id: 6, name: 'Brzozowa', address: 'ul. Brzozowa', pm25: 19, quality: 'good' },
];

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/aed', (_req, res) => res.json(aedLocations));
app.get('/api/toilets', (_req, res) => res.json(toilets));
app.get('/api/eco', (_req, res) => res.json(ecoPoints));
app.get('/api/air', (_req, res) => res.json(airSensors));

app.get('/api/weather', async (_req, res) => {
  try {
    const apiKey = '7675506ab56dd4420aa2c0011d8b6858';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Myslowice&units=metric&lang=pl&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`OWM error ${response.status}`);
    const data = await response.json();
    res.json({
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windKmh: Math.round(data.wind.speed * 3.6),
      icon: data.weather[0].icon,
      sunrise: data.sys.sunrise, // unix timestamp UTC
      sunset:  data.sys.sunset,  // unix timestamp UTC
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));

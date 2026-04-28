import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import AdmZip from "adm-zip";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());

// ── AED data ──────────────────────────────────────────────────────────────────
const aedLocations = [
  {
    id: 1,
    name: "Mysłowickie Centrum Zdrowia – Szpital",
    address: "ul. Mikołowska 1, 41-400 Mysłowice",
    coordinates: { lat: 50.2396846, lng: 19.1373742 },
    access: "24/7",
    description: "Defibrylator przy Izbie Przyjęć szpitala",
  },
  {
    id: 2,
    name: "Urząd Miasta Mysłowice",
    address: "ul. Powstańców 1, 41-400 Mysłowice",
    coordinates: { lat: 50.2409042, lng: 19.1415714 },
    access: "Pon–Pt 7:30–17:00",
    description: "Defibrylator w holu głównym urzędu",
  },
  {
    id: 3,
    name: "MOSiR – Hala Sportowa",
    address: "ul. Bończyka 32z, 41-400 Mysłowice",
    coordinates: { lat: 50.2459527, lng: 19.1143236 },
    access: "Pon–Pt 7:00–15:00",
    description: "Defibrylator przy recepcji hali sportowej",
  },
  {
    id: 4,
    name: "Straż Miejska",
    address: "ul. Strażacka 7, 41-400 Mysłowice",
    coordinates: { lat: 50.2400854, lng: 19.1428678 },
    access: "Codziennie 6:00–22:00",
    description: "Defibrylator w siedzibie Straży Miejskiej",
  },
  {
    id: 5,
    name: "Biblioteka Miejska – Filia Brzezinka",
    address: "ul. Laryska 5, 41-404 Mysłowice",
    coordinates: { lat: 50.2039125, lng: 19.1571627 },
    access: "Pon–Pt 10:00–18:00",
    description: "Defibrylator w holu biblioteki",
  },
  {
    id: 6,
    name: "Dworzec PKP Mysłowice",
    address: "Dworzec PKP, 41-400 Mysłowice",
    coordinates: { lat: 50.237775, lng: 19.1406167 },
    access: "24/7",
    description: "Defibrylator na głównym holu dworca",
  },
  {
    id: 7,
    name: "Szpital nr 2 im. dr. T. Boczonia",
    address: "ul. Bytomska 41, 41-400 Mysłowice",
    coordinates: { lat: 50.2471739, lng: 19.1330167 },
    access: "24/7",
    description: "Defibrylator przy Izbie Przyjęć i SOR",
  },
  {
    id: 8,
    name: "OSP Janów",
    address: "ul. Bolesława Chrobrego 11, 41-406 Mysłowice",
    coordinates: { lat: 50.2396024, lng: 19.1145707 },
    access: "24/7",
    description: "Na zewnątrz budynku OSP Janów",
  },
  {
    id: 9,
    name: "Bank ING",
    address: "ul. Powstańców 1, 41-400 Mysłowice",
    coordinates: { lat: 50.242107, lng: 19.1418073 },
    access: "Brak danych",
    description: "Na wyposażeniu banku ING",
  },
  {
    id: 10,
    name: "OSP Kosztowy",
    address: "ul. Górnicza, Mysłowice-Kosztowy",
    coordinates: { lat: 50.1889724, lng: 19.151563 },
    access: "24/7",
    description: "Na zewnętrznej ścianie remizy, zielona kapsuła Rotaid",
  },
  {
    id: 11,
    name: "Przedszkole nr 6",
    address: "Mysłowice",
    coordinates: { lat: 50.2157209, lng: 19.1569921 },
    access: "24/7",
    description: "Kapsuła przy wejściu frontowym budynku",
  },
  {
    id: 12,
    name: "PSP Mysłowice – mobilny AED",
    address: "Mysłowice",
    coordinates: { lat: 50.2337007, lng: 19.1188436 },
    access: "24/7",
    description: "Mobilny AED na samochodzie ratowniczym PSP",
  },
  {
    id: 13,
    name: "Lodowisko / Boiska siatkówki",
    address: "Mysłowice",
    coordinates: { lat: 50.2261356, lng: 19.1441696 },
    access: "Pon–Sob 9:00–20:00",
    description: "Na drewnianym domku, po lewej stronie od wejścia",
  },
  {
    id: 14,
    name: "Przychodnia Bracka – Unia Bracka",
    address: "Mysłowice",
    coordinates: { lat: 50.1878307, lng: 19.1046811 },
    access: "W godzinach otwarcia",
    description: "W Przychodni Brackiej, gabinet nr 3",
  },
];

// ── Static data ───────────────────────────────────────────────────────────────
const toilets = [
  {
    id: 1,
    name: "Toaleta – Dworzec PKP",
    address: "Dworzec PKP, 41-400 Mysłowice",
    access: "24/7",
    paid: true,
  },
  {
    id: 2,
    name: "Toaleta – Urząd Miasta",
    address: "ul. Powstańców 1",
    access: "Pon–Pt 7:30–17:00",
    paid: false,
  },
  {
    id: 3,
    name: "Toaleta – MOSiR",
    address: "ul. Bończyka 32z",
    access: "Godz. otwarcia",
    paid: false,
  },
];

const ecoPoints = [
  {
    id: 1,
    name: "PSZOK – Punkt Selektywnej Zbiórki",
    address: "ul. Przemysłowa 1",
    access: "Pon–Pt 8–16, Sob 9–13",
    accepts: "Meble, AGD, elektronika, opony, baterie, farby, chemia",
  },
  {
    id: 2,
    name: "Zbiórka Baterii – Urząd Miasta",
    address: "ul. Powstańców 1",
    access: "Pon–Pt 7:30–17:00",
    accepts: "Baterie",
  },
  {
    id: 3,
    name: "Zbiórka Baterii – Biblioteka",
    address: "ul. Laryska 5",
    access: "Pon–Pt 10–18",
    accepts: "Baterie",
  },
  {
    id: 4,
    name: "Punkt Tekstyliów – Kaufland",
    address: "ul. Bytomska (parking Kaufland)",
    access: "24/7",
    accepts: "Tekstylia, ubrania",
  },
];

// ── Water level – IMGW API ────────────────────────────────────────────────────
const IMGW_URL = 'https://danepubliczne.imgw.pl/api/data/hydro/';
const WATER_TTL = 15 * 60 * 1000;
const MYSLOWICE_HYDRO = { lat: 50.213, lon: 19.166 };
const MAX_DIST_KM = 50;
let waterCache = null;
let waterCacheTs = 0;

const RIVERS_LC = ['wisła', 'przemsza', 'brynica'];
// stacje z rzeka="-" ale relevantne geograficznie
const STATION_WHITELIST = new Set(['150190070']); // Szabelnia (Czarna Przemsza, Mysłowice)
const RIVER_OVERRIDES = {
  '150190070': 'Brynica',
};

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371, d2r = Math.PI / 180;
  const dLat = (lat2 - lat1) * d2r;
  const dLon = (lon2 - lon1) * d2r;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * d2r) * Math.cos(lat2 * d2r) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toInt(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
}

async function fetchWaterData() {
  if (waterCache && Date.now() - waterCacheTs < WATER_TTL) return waterCache;

  const r = await fetch(IMGW_URL, { signal: AbortSignal.timeout(12000) });
  if (!r.ok) throw new Error(`IMGW → ${r.status}`);
  const all = await r.json();

  const filtered = all
    .filter(s => {
      const lat = parseFloat(s.lat);
      const lon = parseFloat(s.lon);
      if (isNaN(lat) || isNaN(lon)) return false;
      if (STATION_WHITELIST.has(s.id_stacji)) return true;
      const river = (s.rzeka || '').toLowerCase();
      return RIVERS_LC.some(rv => river.includes(rv)) &&
        haversineKm(MYSLOWICE_HYDRO.lat, MYSLOWICE_HYDRO.lon, lat, lon) <= MAX_DIST_KM;
    })
    .map(s => {
      const lat  = parseFloat(s.lat);
      const lon  = parseFloat(s.lon);
      const level = toInt(s.stan_wody);
      return {
        id:          s.id_stacji,
        name:        s.stacja,
        river:       RIVER_OVERRIDES[s.id_stacji] ?? s.rzeka,
        province:    s.wojewodztwo ?? null,
        level,
        measuredAt:  s.stan_wody_data_pomiaru ?? null,
        // API nie dostarcza progów – zostawiamy null
        warningLevel: null,
        alarmLevel:   null,
        status:       level !== null ? 'safe' : 'unknown',
        coordinates:  (!isNaN(lat) && !isNaN(lon)) ? [lat, lon] : null,
        dist:         (!isNaN(lat) && !isNaN(lon))
          ? Math.round(haversineKm(MYSLOWICE_HYDRO.lat, MYSLOWICE_HYDRO.lon, lat, lon))
          : null,
      };
    });

  filtered.sort((a, b) => (a.dist ?? 999) - (b.dist ?? 999));

  waterCache = filtered;
  waterCacheTs = Date.now();
  return filtered;
}

// ── Air quality – GIOŚ API v1 ─────────────────────────────────────────────────
const GIOS = 'https://api.gios.gov.pl/pjp-api/v1/rest';
const MYSLOWICE = { lat: 50.235, lng: 19.14 };
const AIR_TTL = 30 * 60 * 1000;
let airCache = null;
let airCacheTs = 0;

function distKm(lat1, lon1, lat2, lon2) {
  const R = 6371, d2r = Math.PI / 180;
  const dLat = (lat2 - lat1) * d2r;
  const dLon = (lon2 - lon1) * d2r;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * d2r) * Math.cos(lat2 * d2r) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function indexValToQuality(v) {
  if (v === null || v === undefined) return null;
  if (v <= 1) return 'good';
  if (v <= 3) return 'moderate';
  return 'poor';
}

function pm25ToQuality(v) {
  if (v === null) return 'unknown';
  if (v < 25) return 'good';
  if (v < 50) return 'moderate';
  return 'poor';
}

async function giosFetch(path) {
  const r = await fetch(`${GIOS}${path}`, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`GIOŚ ${path} → ${r.status}`);
  return r.json();
}

async function latestValue(sensorId) {
  try {
    const d = await giosFetch(`/data/getData/${sensorId}`);
    const v = d['Lista danych pomiarowych']?.find(x => x['Wartość'] !== null);
    return v ? { value: v['Wartość'], date: v['Data'] } : null;
  } catch { return null; }
}

async function fetchAirData() {
  if (airCache && Date.now() - airCacheTs < AIR_TTL) return airCache;

  const all = await giosFetch('/station/findAll?size=500&page=0');
  const stations = all['Lista stacji pomiarowych'] ?? [];

  const nearby = stations
    .map(s => ({ ...s, dist: distKm(MYSLOWICE.lat, MYSLOWICE.lng, parseFloat(s['WGS84 φ N']), parseFloat(s['WGS84 λ E'])) }))
    .filter(s => s.dist <= 20)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 8);

  const results = await Promise.all(nearby.map(async (station) => {
    const stationId = station['Identyfikator stacji'];
    try {
      const [sensorsData, index] = await Promise.all([
        giosFetch(`/station/sensors/${stationId}`),
        giosFetch(`/aqindex/getIndex/${stationId}`).catch(() => null),
      ]);

      const sensors = sensorsData['Lista stanowisk pomiarowych dla podanej stacji'] ?? [];
      const pm25s = sensors.find(s => s['Wskaźnik - kod'] === 'PM2.5');
      const pm10s = sensors.find(s => s['Wskaźnik - kod'] === 'PM10');

      const [pm25res, pm10res] = await Promise.all([
        pm25s ? latestValue(pm25s['Identyfikator stanowiska']) : Promise.resolve(null),
        pm10s ? latestValue(pm10s['Identyfikator stanowiska']) : Promise.resolve(null),
      ]);

      const pm25 = pm25res !== null ? Math.round(pm25res.value) : null;
      const pm10 = pm10res !== null ? Math.round(pm10res.value) : null;

      const qualityFromIndex =
        indexValToQuality(index?.['Wartość indeksu dla wskaźnika PM2.5']) ??
        indexValToQuality(index?.['Wartość indeksu']);

      return {
        id: stationId,
        name: station['Nazwa stacji'],
        address: station['Ulica'] || '',
        city: station['Nazwa miasta'] || '',
        pm25,
        pm10,
        quality: qualityFromIndex ?? pm25ToQuality(pm25),
        updatedAt: index?.['Data wykonania obliczeń indeksu'] ?? pm25res?.date ?? null,
      };
    } catch { return null; }
  }));

  airCache = results.filter(Boolean);
  airCacheTs = Date.now();
  return airCache;
}

// ── Air quality – Airly API ───────────────────────────────────────────────────
const AIRLY_BASE = 'https://airapi.airly.eu/v2';
const AIRLY_CENTER = { lat: 50.2271, lng: 19.1658 };
let airlyCache = null;
let airlyCacheTs = 0;

const AIRLY_LEVEL = {
  VERY_LOW: 'good', LOW: 'good',
  MEDIUM: 'moderate',
  HIGH: 'poor', VERY_HIGH: 'poor',
};

async function airlyFetch(path) {
  const key = process.env.AIRLY_API_KEY;
  if (!key) throw new Error('Brak AIRLY_API_KEY w .env');
  const r = await fetch(`${AIRLY_BASE}${path}`, {
    headers: { apikey: key, 'Accept-Language': 'pl' },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`Airly ${path} → ${r.status}`);
  return r.json();
}

async function fetchAirlyData() {
  if (airlyCache && Date.now() - airlyCacheTs < AIR_TTL) return airlyCache;

  const installations = await airlyFetch(
    `/installations/nearest?lat=${AIRLY_CENTER.lat}&lng=${AIRLY_CENTER.lng}&maxDistanceKM=5&maxResults=10`
  );

  const results = await Promise.all(installations.map(async (inst) => {
    try {
      const m = await airlyFetch(`/measurements/installation?installationId=${inst.id}`);
      const values = m.current?.values ?? [];
      const index  = m.current?.indexes?.[0];

      const get = name => {
        const v = values.find(x => x.name === name)?.value;
        return v != null ? Math.round(v) : null;
      };

      return {
        id: `airly-${inst.id}`,
        name: [inst.address.displayAddress1, inst.address.displayAddress2].filter(Boolean).join(', '),
        address: [inst.address.street, inst.address.number].filter(Boolean).join(' '),
        city: inst.address.city ?? '',
        pm25: get('PM25'),
        pm10: get('PM10'),
        quality: AIRLY_LEVEL[index?.level] ?? pm25ToQuality(get('PM25')),
        updatedAt: m.current?.tillDateTime?.replace('T', ' ').slice(0, 16) ?? null,
        source: 'airly',
      };
    } catch { return null; }
  }));

  airlyCache = results.filter(Boolean);
  airlyCacheTs = Date.now();
  return airlyCache;
}

// ── Transit (GTFS-RT + GTFS Static) ──────────────────────────────────────────
const MYSLOWICE_BBOX = { minLat: 50.17, maxLat: 50.26, minLon: 19.09, maxLon: 19.22 };
const VEHICLES_URL   = 'https://gtfsrt.transportgzm.pl:5443/gtfsrt/gzm/vehiclePositions';
const STOPS_ZIP_URL  = 'https://mkuran.pl/gtfs/gzm.zip';
const VEHICLES_TTL   = 10_000;
const STATIC_TTL     = 24 * 60 * 60 * 1000;

let vehiclesCache = null, vehiclesCacheTs = 0;
let transitStaticCache = null, transitStaticTs = 0;

function inBbox({ minLat, maxLat, minLon, maxLon }, lat, lon) {
  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
}

function toLong(v) {
  if (!v) return null;
  if (typeof v === 'object' && typeof v.toNumber === 'function') return v.toNumber();
  return Number(v);
}

function parseCsvLine(line) {
  const result = [];
  let inQuote = false, current = '';
  for (const ch of line) {
    if (ch === '"') { inQuote = !inQuote; }
    else if (ch === ',' && !inQuote) { result.push(current); current = ''; }
    else { current += ch; }
  }
  result.push(current);
  return result;
}

function parseCsv(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
  const headers = parseCsvLine(lines[0]).map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = parseCsvLine(line);
    const row = {};
    headers.forEach((h, i) => { row[h] = (vals[i] ?? '').trim(); });
    return row;
  });
}

async function fetchTransitStatic() {
  if (transitStaticCache && Date.now() - transitStaticTs < STATIC_TTL) return transitStaticCache;

  const res = await fetch(STOPS_ZIP_URL, { signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`GTFS ZIP → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const zip = new AdmZip(buf);

  const stopsEntry = zip.getEntry('stops.txt');
  if (!stopsEntry) throw new Error('stops.txt not found in ZIP');
  const stops = parseCsv(stopsEntry.getData().toString('utf8'))
    .filter(r => {
      const lat = parseFloat(r.stop_lat), lon = parseFloat(r.stop_lon);
      return !isNaN(lat) && !isNaN(lon) && inBbox(MYSLOWICE_BBOX, lat, lon);
    })
    .map(r => ({
      stop_id: r.stop_id,
      stop_name: r.stop_name,
      lat: parseFloat(r.stop_lat),
      lon: parseFloat(r.stop_lon),
    }));

  const routeTypes = {};
  const routeNames = {};
  const routesEntry = zip.getEntry('routes.txt');
  if (routesEntry) {
    parseCsv(routesEntry.getData().toString('utf8')).forEach(r => {
      if (!r.route_id) return;
      routeTypes[r.route_id] = parseInt(r.route_type || '3', 10);
      if (r.route_short_name) routeNames[r.route_id] = r.route_short_name;
    });
  }

  const tripHeadsigns = {};
  const tripsEntry = zip.getEntry('trips.txt');
  if (tripsEntry) {
    parseCsv(tripsEntry.getData().toString('utf8')).forEach(r => {
      if (r.trip_id && r.trip_headsign) tripHeadsigns[r.trip_id] = r.trip_headsign;
    });
  }

  transitStaticCache = { stops, routeTypes, routeNames, tripHeadsigns };
  transitStaticTs = Date.now();
  return transitStaticCache;
}

async function fetchVehicleData() {
  if (vehiclesCache && Date.now() - vehiclesCacheTs < VEHICLES_TTL) return vehiclesCache;

  const [res, staticData] = await Promise.all([
    fetch(VEHICLES_URL, { signal: AbortSignal.timeout(8000) }),
    fetchTransitStatic().catch(() => ({ routeTypes: {}, routeNames: {}, tripHeadsigns: {} })),
  ]);
  if (!res.ok) throw new Error(`GTFS-RT → ${res.status}`);

  const buf = await res.arrayBuffer();
  const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buf));
  const { routeTypes, routeNames, tripHeadsigns } = staticData;

  const vehicles = [];
  for (const entity of feed.entity) {
    if (!entity.vehicle?.position) continue;
    const { latitude: lat, longitude: lon } = entity.vehicle.position;
    if (!inBbox(MYSLOWICE_BBOX, lat, lon)) continue;
    const routeId = entity.vehicle.trip?.routeId ?? '?';
    const tripId  = entity.vehicle.trip?.tripId  ?? null;
    vehicles.push({
      id: entity.id,
      lat,
      lon,
      route:     routeId,
      routeName: routeNames[routeId]              ?? null,
      routeType: routeTypes[routeId]              ?? 3,
      headsign:  tripId ? (tripHeadsigns[tripId] ?? null) : null,
      direction: toLong(entity.vehicle.trip?.directionId) ?? null,
      timestamp: toLong(entity.vehicle.timestamp),
    });
  }

  vehiclesCache = vehicles;
  vehiclesCacheTs = Date.now();
  return vehicles;
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/api/aed", (_req, res) => res.json(aedLocations));
app.get("/api/toilets", (_req, res) => res.json(toilets));
app.get("/api/eco", (_req, res) => res.json(ecoPoints));
app.get('/api/air', async (_req, res) => {
  const [gios, airly] = await Promise.allSettled([fetchAirData(), fetchAirlyData()]);
  const data = [
    ...(gios.status === 'fulfilled' ? gios.value : []),
    ...(airly.status === 'fulfilled' ? airly.value : []),
  ];
  if (data.length === 0) {
    const err = gios.reason?.message ?? airly.reason?.message ?? 'Błąd obu źródeł';
    return res.status(502).json({ error: err });
  }
  res.json(data);
});

app.get("/api/weather", async (_req, res) => {
  try {
    const apiKey = process.env.OWM_API_KEY;
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
      sunset: data.sys.sunset, // unix timestamp UTC
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.get('/api/water-level', async (_req, res) => {
  try {
    const data = await fetchWaterData();
    res.json(data);
  } catch (err) {
    if (waterCache) return res.json(waterCache);
    res.status(502).json({ error: err.message });
  }
});

app.get('/api/transit-vehicles', async (_req, res) => {
  try {
    res.json(await fetchVehicleData());
  } catch (err) {
    console.warn('[transit-vehicles]', err.message);
    // Graceful degradation: feed blocked from this network; return stale cache or empty array.
    // When deployed on a Polish server, gtfsrt.transportgzm.pl:5443 will be reachable.
    res.json(vehiclesCache ?? []);
  }
});

app.get('/api/transit-stops', async (_req, res) => {
  try {
    const { stops } = await fetchTransitStatic();
    res.json(stops);
  } catch (err) {
    if (transitStaticCache) return res.json(transitStaticCache.stops);
    res.status(502).json({ error: err.message });
  }
});

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, ts: new Date().toISOString() }),
);

app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`),
);

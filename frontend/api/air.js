const GIOS = 'https://api.gios.gov.pl/pjp-api/v1/rest';
const MYSLOWICE = { lat: 50.235, lng: 19.14 };
const AIRLY_BASE = 'https://airapi.airly.eu/v2';
const AIRLY_CENTER = { lat: 50.2271, lng: 19.1658 };
const AIR_TTL = 30 * 60 * 1000;

let airCache = null, airCacheTs = 0;
let airlyCache = null, airlyCacheTs = 0;

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

async function fetchGios() {
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
        source: 'gios',
      };
    } catch { return null; }
  }));

  airCache = results.filter(Boolean);
  airCacheTs = Date.now();
  return airCache;
}

const AIRLY_LEVEL = {
  VERY_LOW: 'good', LOW: 'good',
  MEDIUM: 'moderate',
  HIGH: 'poor', VERY_HIGH: 'poor',
};

async function airlyFetch(path) {
  const key = process.env.AIRLY_API_KEY;
  if (!key) throw new Error('Brak AIRLY_API_KEY');
  const r = await fetch(`${AIRLY_BASE}${path}`, {
    headers: { apikey: key, 'Accept-Language': 'pl' },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`Airly ${path} → ${r.status}`);
  return r.json();
}

async function fetchAirly() {
  if (airlyCache && Date.now() - airlyCacheTs < AIR_TTL) return airlyCache;

  const installations = await airlyFetch(
    `/installations/nearest?lat=${AIRLY_CENTER.lat}&lng=${AIRLY_CENTER.lng}&maxDistanceKM=5&maxResults=10`
  );

  const results = await Promise.all(installations.map(async (inst) => {
    try {
      const m = await airlyFetch(`/measurements/installation?installationId=${inst.id}`);
      const values = m.current?.values ?? [];
      const index = m.current?.indexes?.[0];

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

export default async function handler(req, res) {
  const [gios, airly] = await Promise.allSettled([fetchGios(), fetchAirly()]);
  const data = [
    ...(gios.status === 'fulfilled' ? gios.value : []),
    ...(airly.status === 'fulfilled' ? airly.value : []),
  ];
  if (data.length === 0) {
    const err = gios.reason?.message ?? airly.reason?.message ?? 'Błąd obu źródeł';
    return res.status(502).json({ error: err });
  }
  res.status(200).json(data);
}

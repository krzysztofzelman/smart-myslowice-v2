const IMGW_URL = 'https://danepubliczne.imgw.pl/api/data/hydro/';
const TTL = 15 * 60 * 1000;
const MYSLOWICE_HYDRO = { lat: 50.213, lon: 19.166 };
const MAX_DIST_KM = 50;

let cache = null;
let cacheTs = 0;

const RIVERS_LC = ['wisła', 'przemsza', 'brynica'];
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

export default async function handler(req, res) {
  if (cache && Date.now() - cacheTs < TTL) {
    return res.status(200).json(cache);
  }

  try {
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
        const lat   = parseFloat(s.lat);
        const lon   = parseFloat(s.lon);
        const level = toInt(s.stan_wody);
        return {
          id:          s.id_stacji,
          name:        s.stacja,
          river:       RIVER_OVERRIDES[s.id_stacji] ?? s.rzeka,
          province:    s.wojewodztwo ?? null,
          level,
          measuredAt:  s.stan_wody_data_pomiaru ?? null,
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

    cache = filtered;
    cacheTs = Date.now();
    res.status(200).json(filtered);
  } catch (e) {
    if (cache) return res.status(200).json(cache);
    res.status(502).json({ error: e.message });
  }
}

import AdmZip from 'adm-zip';

const STOPS_ZIP_URL = 'https://mkuran.pl/gtfs/gzm.zip';
const MYSLOWICE_BBOX = { minLat: 50.17, maxLat: 50.26, minLon: 19.09, maxLon: 19.22 };
const TTL = 24 * 60 * 60 * 1000;

let cache = null;
let cacheTs = 0;

function inBbox({ minLat, maxLat, minLon, maxLon }, lat, lon) {
  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
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

export default async function handler(req, res) {
  if (cache && Date.now() - cacheTs < TTL) {
    return res.status(200).json(cache);
  }

  try {
    const r = await fetch(STOPS_ZIP_URL, { signal: AbortSignal.timeout(60000) });
    if (!r.ok) throw new Error(`GTFS ZIP → ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    const zip = new AdmZip(buf);

    const stopsEntry = zip.getEntry('stops.txt');
    if (!stopsEntry) throw new Error('stops.txt not found in ZIP');

    const stops = parseCsv(stopsEntry.getData().toString('utf8'))
      .filter(row => {
        const lat = parseFloat(row.stop_lat), lon = parseFloat(row.stop_lon);
        return !isNaN(lat) && !isNaN(lon) && inBbox(MYSLOWICE_BBOX, lat, lon);
      })
      .map(row => ({
        stop_id: row.stop_id,
        stop_name: row.stop_name,
        lat: parseFloat(row.stop_lat),
        lon: parseFloat(row.stop_lon),
      }));

    cache = stops;
    cacheTs = Date.now();
    res.status(200).json(stops);
  } catch (err) {
    console.warn('[transit-stops]', err.message);
    res.status(200).json(cache ?? []);
  }
}

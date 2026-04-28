import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import AdmZip from 'adm-zip';

const VEHICLES_URL  = 'https://gtfsrt.transportgzm.pl:5443/gtfsrt/gzm/vehiclePositions';
const STOPS_ZIP_URL = 'https://mkuran.pl/gtfs/gzm.zip';
const MYSLOWICE_BBOX = { minLat: 50.17, maxLat: 50.26, minLon: 19.09, maxLon: 19.22 };
const VEHICLES_TTL = 10_000;
const STATIC_TTL   = 24 * 60 * 60 * 1000;

let vehiclesCache = null, vehiclesCacheTs = 0;
let staticCache = null, staticCacheTs = 0;

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

async function fetchStaticData() {
  if (staticCache && Date.now() - staticCacheTs < STATIC_TTL) return staticCache;

  const r = await fetch(STOPS_ZIP_URL, { signal: AbortSignal.timeout(60000) });
  if (!r.ok) throw new Error(`GTFS ZIP → ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const zip = new AdmZip(buf);

  const routeTypes = {};
  const routeNames = {};
  const routesEntry = zip.getEntry('routes.txt');
  if (routesEntry) {
    parseCsv(routesEntry.getData().toString('utf8')).forEach(row => {
      if (!row.route_id) return;
      routeTypes[row.route_id] = parseInt(row.route_type || '3', 10);
      if (row.route_short_name) routeNames[row.route_id] = row.route_short_name;
    });
  }

  const tripHeadsigns = {};
  const tripsEntry = zip.getEntry('trips.txt');
  if (tripsEntry) {
    parseCsv(tripsEntry.getData().toString('utf8')).forEach(row => {
      if (row.trip_id && row.trip_headsign) tripHeadsigns[row.trip_id] = row.trip_headsign;
    });
  }

  staticCache = { routeTypes, routeNames, tripHeadsigns };
  staticCacheTs = Date.now();
  return staticCache;
}

export default async function handler(req, res) {
  if (vehiclesCache && Date.now() - vehiclesCacheTs < VEHICLES_TTL) {
    return res.status(200).json(vehiclesCache);
  }

  try {
    const [rtRes, staticData] = await Promise.all([
      fetch(VEHICLES_URL, { signal: AbortSignal.timeout(8000) }),
      fetchStaticData().catch(() => staticCache ?? { routeTypes: {}, routeNames: {}, tripHeadsigns: {} }),
    ]);

    if (!rtRes.ok) throw new Error(`GTFS-RT → ${rtRes.status}`);

    const buf = await rtRes.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buf));
    const { routeTypes, routeNames, tripHeadsigns } = staticData;

    const vehicles = [];
    for (const entity of feed.entity) {
      if (!entity.vehicle?.position) continue;
      const { latitude: lat, longitude: lon } = entity.vehicle.position;
      if (!inBbox(MYSLOWICE_BBOX, lat, lon)) continue;
      const routeId = entity.vehicle.trip?.routeId || entity.id.split('_')[0] || '?';
      const tripId  = entity.vehicle.trip?.tripId  || null;
      vehicles.push({
        id: entity.id,
        lat,
        lon,
        route:     routeId,
        routeName: routeNames[routeId]              ?? routeId,
        routeType: routeTypes[routeId]              ?? 3,
        headsign:  tripId ? (tripHeadsigns[tripId] ?? null) : null,
        direction: toLong(entity.vehicle.trip?.directionId) ?? null,
        timestamp: toLong(entity.vehicle.timestamp),
      });
    }

    vehiclesCache = vehicles;
    vehiclesCacheTs = Date.now();
    res.status(200).json(vehicles);
  } catch (err) {
    console.warn('[transit-vehicles]', err.message);
    res.status(200).json(vehiclesCache ?? []);
  }
}

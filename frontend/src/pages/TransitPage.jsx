import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useFetch } from '../hooks/useFetch.js';
import Card from '../components/Card.jsx';
import styles from './TransitPage.module.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// routeType 0 = tram, 3 = bus (GTFS standard)
const isTram = v => v.routeType === 0;

function makeVehicleIcon(vehicle) {
  const tram = isTram(vehicle);
  const bg   = tram ? '#e03045' : '#22c55e';
  const label = vehicle.route.length > 4 ? vehicle.route.slice(0, 4) : vehicle.route;
  return L.divIcon({
    className: '',
    html: `<div style="min-width:36px;height:36px;border-radius:10px;background:${bg};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;border:2px solid #fff;box-shadow:0 4px 12px ${bg}88;padding:0 4px;font-family:'Space Grotesk',sans-serif;">${label}</div>`,
    iconSize:    [36, 36],
    iconAnchor:  [18, 18],
    popupAnchor: [0, -22],
  });
}

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => { if (coords) map.flyTo(coords, 16, { duration: 1.0 }); }, [coords, map]);
  return null;
}

function formatTime(ts) {
  if (!ts) return null;
  return new Date(ts * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function TransitPage() {
  const { data: stops, loading: stopsLoading, error: stopsError } = useFetch('/api/transit-stops');
  const [vehicles, setVehicles]         = useState([]);
  const [vehiclesLoading, setVLoading]  = useState(true);
  const [vehiclesError, setVError]      = useState(null);
  const [flyTo, setFlyTo]               = useState(null);
  const [lastRefresh, setLastRefresh]   = useState(null);
  const [theme, setTheme]               = useState(
    document.documentElement.getAttribute('data-theme') || 'dark'
  );

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark')
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await fetch('/api/transit-vehicles');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setVehicles(Array.isArray(data) ? data : []);
      setLastRefresh(Date.now());
      setVError(null);
    } catch (e) {
      setVError(e.message);
    } finally {
      setVLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
    const id = setInterval(fetchVehicles, 15000);
    return () => clearInterval(id);
  }, [fetchVehicles]);

  const isDark  = theme === 'dark' || theme === 'dusk';
  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const busCount  = vehicles.filter(v => !isTram(v)).length;
  const tramCount = vehicles.filter(v =>  isTram(v)).length;

  return (
    <div className={styles.page}>

      {/* ── Info banner ── */}
      <div className={styles.info}>
        <div className={styles.infoLeft}>
          <span className={styles.infoIcon}>🚌</span>
          <div>
            <p className={styles.infoTitle}>Transport publiczny — Mysłowice</p>
            <p className={styles.infoSub}>
              Pozycje pojazdów w czasie rzeczywistym · odświeżanie co 15 s
              {lastRefresh && ` · pomiar ${new Date(lastRefresh).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`}
            </p>
          </div>
        </div>
        <span className={styles.infoSource}>ZTM / GZM · CC BY 4.0</span>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsRow}>
        <Card accent="var(--c-green)">
          <p className={styles.statNum}>{vehiclesLoading ? '…' : busCount}</p>
          <p className={styles.statLbl}>Autobusów aktualnie</p>
        </Card>
        <Card accent="var(--c-red)">
          <p className={styles.statNum}>{vehiclesLoading ? '…' : tramCount}</p>
          <p className={styles.statLbl}>Tramwajów aktualnie</p>
        </Card>
        <Card accent="var(--c-blue)">
          <p className={styles.statNum}>{stopsLoading ? '…' : (stops?.length ?? 0)}</p>
          <p className={styles.statLbl}>Przystanków</p>
        </Card>
      </div>

      {/* ── Map ── */}
      <div className={styles.mapWrap}>
        <MapContainer
          center={[50.213, 19.155]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            key={tileUrl}
            url={tileUrl}
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            maxZoom={19}
          />
          {flyTo && <FlyTo coords={flyTo} />}

          {/* Stops — small blue circles */}
          {stops?.map(stop => (
            <CircleMarker
              key={stop.stop_id}
              center={[stop.lat, stop.lon]}
              radius={4}
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.85, weight: 1 }}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <strong style={{ fontSize: '0.95rem', display: 'block', marginBottom: 6 }}>
                    🚏 {stop.stop_name}
                  </strong>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lon}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-block', marginTop: 4, padding: '0.4rem 0.8rem', background: '#3b82f6', color: '#fff', borderRadius: 8, fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Nawiguj →
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Vehicles — colored markers with route number */}
          {vehicles.map(v => (
            <Marker
              key={v.id}
              position={[v.lat, v.lon]}
              icon={makeVehicleIcon(v)}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: 4 }}>
                    {isTram(v) ? '🚃' : '🚌'} Linia {v.route}
                  </strong>
                  {v.direction !== null && (
                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: 4 }}>
                      Kierunek: {v.direction === 0 ? '→ Tam' : '← Powrót'}
                    </p>
                  )}
                  {v.timestamp && (
                    <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 6 }}>
                      Aktualizacja: {formatTime(v.timestamp)}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* ── Legend ── */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendBus}>■</span> Autobus
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendTram}>■</span> Tramwaj
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendStop}>●</span> Przystanek
        </div>
      </div>

      {!vehiclesLoading && vehicles.length === 0 && (
        <div className={styles.notice}>
          ℹ️ Brak pojazdów w zasięgu Mysłowic. Możliwe przyczyny: godziny nocne, feed GTFS-RT niedostępny z tej sieci (wymagany dostęp z polskiego serwera).
        </div>
      )}

      {/* ── Stop list ── */}
      <div className={styles.listWrap}>
        <h2 className={styles.listTitle}>Przystanki w Mysłowicach</h2>
        {stopsLoading && <p className={styles.hint}>Ładowanie przystanków… (pierwsze pobranie może zająć chwilę)</p>}
        {stopsError   && <p className={styles.err}>Błąd ładowania przystanków: {stopsError}</p>}
        <div className={styles.list}>
          {stops?.map(stop => (
            <button
              key={stop.stop_id}
              className={styles.listItem}
              onClick={() => setFlyTo([stop.lat, stop.lon])}
            >
              <span className={styles.listName}>🚏 {stop.stop_name}</span>
            </button>
          ))}
        </div>
        <p className={styles.source}>
          Źródło: ZTM / Metropolia GZM · gtfsrt.transportgzm.pl · mkuran.pl/gtfs · CC BY 4.0
        </p>
      </div>

    </div>
  );
}

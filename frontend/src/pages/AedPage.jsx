import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useFetch } from '../hooks/useFetch.js';
import { useThemeContext } from '../ThemeContext.js';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import styles from './AedPage.module.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const BORDER_COLOR = { light: '#000000', dusk: '#ffffff', dark: '#ffffff' };

const aedIcon = L.divIcon({
  className: '',
  html: `<div style="width:38px;height:38px;border-radius:50%;background:#ff3b4e;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid #fff;box-shadow:0 4px 16px rgba(255,59,78,0.5);">❤️</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -24],
});

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => { if (coords) map.flyTo(coords, 17, { duration: 1.2 }); }, [coords, map]);
  return null;
}

function CityBorder({ borderColor }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    let layer;
    const url = 'https://nominatim.openstreetmap.org/search?' +
      new URLSearchParams({ q: 'Mysłowice, Poland', polygon_geojson: '1', format: 'json', limit: '1' });
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const geo = data?.[0]?.geojson;
        if (!geo) return;
        layer = L.geoJSON({ type: 'Feature', geometry: geo }, {
          style: { color: borderColor, weight: 2, fillOpacity: 0 },
        }).addTo(map);
        layerRef.current = layer;
      })
      .catch(err => console.warn('[CityBorder]', err));
    return () => { if (layer) { map.removeLayer(layer); layerRef.current = null; } };
  }, [map]);

  useEffect(() => {
    layerRef.current?.setStyle({ color: borderColor });
  }, [borderColor]);

  return null;
}

const PREVIEW = 5;

export default function AedPage() {
  const { data: locations, loading } = useFetch('/api/aed');
  const [flyTo, setFlyTo] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const { theme } = useThemeContext();

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  const mapFilter = theme === 'dusk' ? 'brightness(0.7)' : 'none';
  const borderColor = BORDER_COLOR[theme] ?? '#ffffff';

  const is247 = access => access.includes('24/7');

  return (
    <div className={styles.page}>
      <div className={styles.alert}>
        <div className={styles.alertLeft}>
          <span className={styles.alertIcon}>⚠️</span>
          <div>
            <p className={styles.alertTitle}>Nagłe zatrzymanie krążenia?</p>
            <p className={styles.alertSub}>Zadzwoń na pogotowie, znajdź defibrylator, zacznij RKO</p>
          </div>
        </div>
        <a href="tel:112" className={styles.alertBtn}>Zadzwoń 112</a>
      </div>

      <div className={styles.statsRow}>
        <Card accent="var(--c-red)">
          <p className={styles.statNum}>{loading ? '…' : locations?.length}</p>
          <p className={styles.statLbl}>Defibrylatory AED</p>
        </Card>
        <Card accent="var(--c-green)">
          <p className={styles.statNum}>{loading ? '…' : locations?.filter(l => is247(l.access)).length}</p>
          <p className={styles.statLbl}>Dostępne 24/7</p>
        </Card>
        <Card accent="var(--c-blue)">
          <p className={styles.statNum}>100%</p>
          <p className={styles.statLbl}>Publicznie dostępne</p>
        </Card>
      </div>

      <div className={styles.mapWrap} style={{ filter: mapFilter }}>
        <MapContainer
          center={[50.2406, 19.1378]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            key={tileUrl}
            url={tileUrl}
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            maxZoom={19}
          />
          <CityBorder borderColor={borderColor} />
          {flyTo && <FlyTo coords={flyTo} />}
          {locations?.map(loc => (
            <Marker key={loc.id} position={[loc.coordinates.lat, loc.coordinates.lng]} icon={aedIcon}>
              <Popup>
                <div style={{ minWidth: 220 }}>
                  <strong style={{ fontSize: '1rem', display: 'block', marginBottom: 6 }}>{loc.name}</strong>
                  <p style={{ marginBottom: 4, fontSize: '0.85rem', color: '#9ca3af' }}>📍 {loc.address}</p>
                  <p style={{ marginBottom: 8, fontSize: '0.85rem' }}>🕐 {loc.access}</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates.lat},${loc.coordinates.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', borderRadius: 8, fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Nawiguj →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className={styles.listWrap}>
        <h2 className={styles.listTitle}>Wszystkie lokalizacje</h2>
        {loading && <p style={{ color: 'var(--c-muted)' }}>Ładowanie…</p>}
        <div className={styles.list}>
          {locations?.slice(0, PREVIEW).map(loc => (
            <button
              key={loc.id}
              className={styles.listItem}
              onClick={() => setFlyTo([loc.coordinates.lat, loc.coordinates.lng])}
            >
              <div className={styles.listMain}>
                <span className={styles.listName}>{loc.name}</span>
                <span className={styles.listAddr}>📍 {loc.address}</span>
              </div>
              <Badge variant={is247(loc.access) ? 'green' : 'amber'}>
                {loc.access}
              </Badge>
            </button>
          ))}
        </div>
        {locations?.length > PREVIEW && (
          <>
            <div
              className={styles.listExtra}
              style={{ maxHeight: expanded ? `${(locations.length - PREVIEW) * 90}px` : '0' }}
            >
              <div className={styles.list} style={{ paddingTop: '0.4rem' }}>
                {locations.slice(PREVIEW).map(loc => (
                  <button
                    key={loc.id}
                    className={styles.listItem}
                    onClick={() => setFlyTo([loc.coordinates.lat, loc.coordinates.lng])}
                  >
                    <div className={styles.listMain}>
                      <span className={styles.listName}>{loc.name}</span>
                      <span className={styles.listAddr}>📍 {loc.address}</span>
                    </div>
                    <Badge variant={is247(loc.access) ? 'green' : 'amber'}>
                      {loc.access}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
            <button
              className={styles.toggleBtn}
              onClick={() => setExpanded(e => !e)}
            >
              {expanded
                ? '▲ Zwiń'
                : `▼ Pokaż wszystkie (${locations.length})`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

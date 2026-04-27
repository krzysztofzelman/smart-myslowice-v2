import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useFetch } from '../hooks/useFetch.js';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import styles from './WaterPage.module.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STATUS_COLOR = {
  safe:    '#22d3a5',
  warning: '#f59e0b',
  danger:  '#ff3b4e',
  unknown: '#6b7280',
};

function makeWaterIcon(status) {
  const c = STATUS_COLOR[status] || STATUS_COLOR.unknown;
  return L.divIcon({
    className: '',
    html: `<div style="width:36px;height:36px;border-radius:50%;background:${c};display:flex;align-items:center;justify-content:center;font-size:15px;border:3px solid #fff;box-shadow:0 4px 14px ${c}88;">💧</div>`,
    iconSize:    [36, 36],
    iconAnchor:  [18, 18],
    popupAnchor: [0, -22],
  });
}

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => { if (coords) map.flyTo(coords, 14, { duration: 1.2 }); }, [coords, map]);
  return null;
}

function overallStatus(stations) {
  if (!stations || stations.length === 0) return 'no-data';
  if (stations.some(s => s.status === 'danger'))  return 'danger';
  if (stations.some(s => s.status === 'warning')) return 'warning';
  if (stations.some(s => s.status === 'safe'))    return 'safe';
  return 'no-data';
}

const ALERT_CFG = {
  safe:    { label: 'BEZPIECZNIE',           sub: 'Poziomy wód w okolicach Mysłowic w normie.',                     icon: '✅', color: 'var(--c-green)', bg: 'rgba(34,211,165,0.10)', border: 'rgba(34,211,165,0.30)', badge: 'green' },
  warning: { label: 'UWAGA',                 sub: 'Co najmniej jedna stacja przekroczyła stan ostrzegawczy.',        icon: '⚠️', color: 'var(--c-amber)', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.30)', badge: 'amber' },
  danger:  { label: 'ZAGROŻENIE POWODZIOWE', sub: 'Co najmniej jedna stacja przekroczyła stan alarmowy!',            icon: '🚨', color: 'var(--c-red)',   bg: 'rgba(255,59,78,0.10)',  border: 'rgba(255,59,78,0.30)',  badge: 'red'   },
  'no-data': { label: 'Brak danych',         sub: 'Nie udało się pobrać danych ze stacji pomiarowych.',              icon: '❓', color: 'var(--c-muted)', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.20)', badge: 'muted' },
};

const riverLabel = (r) => (!r || r === '-') ? 'nieznana rzeka' : r;

const STATUS_LABEL = { safe: 'Normalny', warning: 'Ostrzegawczy', danger: 'Alarmowy', unknown: 'Brak danych' };
const STATUS_BADGE = { safe: 'green',    warning: 'amber',         danger: 'red',      unknown: 'muted' };

export default function WaterPage() {
  const { data: stations, loading, error } = useFetch('/api/water-level');
  const [flyTo, setFlyTo]   = useState(null);
  const [theme, setTheme]   = useState(document.documentElement.getAttribute('data-theme') || 'dark');

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark')
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const isDark   = theme === 'dark' || theme === 'dusk';
  const tileUrl  = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const overall    = overallStatus(stations);
  const alertCfg   = ALERT_CFG[overall];
  const withCoords = stations?.filter(s => s.coordinates) ?? [];

  const count = (status) => stations?.filter(s => s.status === status).length ?? 0;

  return (
    <div className={styles.page}>

      {/* ── Alert banner ───────────────────────────────────────────── */}
      <div
        className={styles.alert}
        style={{ background: alertCfg.bg, borderColor: alertCfg.border }}
      >
        <div className={styles.alertLeft}>
          <span className={styles.alertIcon}>{alertCfg.icon}</span>
          <div>
            <p className={styles.alertTitle} style={{ color: alertCfg.color }}>
              {alertCfg.label}
            </p>
            <p className={styles.alertSub}>{alertCfg.sub}</p>
          </div>
        </div>
        <Badge variant={alertCfg.badge}>Stan wód · IMGW</Badge>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <div className={styles.statsRow}>
        <Card accent="var(--c-blue)">
          <p className={styles.statNum}>{loading ? '…' : (stations?.length ?? 0)}</p>
          <p className={styles.statLbl}>Stacji pomiarowych</p>
        </Card>
        <Card accent="var(--c-red)">
          <p className={styles.statNum}>{loading ? '…' : count('danger')}</p>
          <p className={styles.statLbl}>Stan alarmowy</p>
        </Card>
        <Card accent="var(--c-amber)">
          <p className={styles.statNum}>{loading ? '…' : count('warning')}</p>
          <p className={styles.statLbl}>Stan ostrzegawczy</p>
        </Card>
        <Card accent="var(--c-green)">
          <p className={styles.statNum}>{loading ? '…' : count('safe')}</p>
          <p className={styles.statLbl}>Stan normalny</p>
        </Card>
      </div>

      {/* ── Map ────────────────────────────────────────────────────── */}
      <div className={styles.mapWrap}>
        <MapContainer
          center={[50.213, 19.166]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            key={tileUrl}
            url={tileUrl}
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            maxZoom={19}
          />
          {flyTo && <FlyTo coords={flyTo} />}
          {withCoords.map(s => (
            <Marker
              key={s.id}
              position={s.coordinates}
              icon={makeWaterIcon(s.status)}
            >
              <Popup>
                <div style={{ minWidth: 210 }}>
                  <strong style={{ fontSize: '1rem', display: 'block', marginBottom: 6 }}>{s.name}</strong>
                  <p style={{ marginBottom: 4, fontSize: '0.85rem', color: '#9ca3af' }}>🌊 {riverLabel(s.river)}</p>
                  {s.level !== null && (
                    <p style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>
                      {s.level} cm
                    </p>
                  )}
                  {s.warningLevel !== null && (
                    <p style={{ fontSize: '0.8rem', color: '#f59e0b' }}>⚠️ Ostrzegawczy: {s.warningLevel} cm</p>
                  )}
                  {s.alarmLevel !== null && (
                    <p style={{ fontSize: '0.8rem', color: '#ff3b4e' }}>🚨 Alarmowy: {s.alarmLevel} cm</p>
                  )}
                  {s.measuredAt && (
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 8 }}>
                      Pomiar: {s.measuredAt}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* ── Station list ───────────────────────────────────────────── */}
      <div className={styles.listWrap}>
        <h2 className={styles.listTitle}>Stacje hydrologiczne</h2>
        {loading && <p className={styles.hint}>Ładowanie danych IMGW…</p>}
        {error   && <p className={styles.err}>Błąd pobierania: {error}</p>}
        <div className={styles.list}>
          {stations?.map(s => (
            <button
              key={s.id}
              className={styles.listItem}
              onClick={() => s.coordinates && setFlyTo(s.coordinates)}
              style={{ cursor: s.coordinates ? 'pointer' : 'default' }}
            >
              <div className={styles.listMain}>
                <span className={styles.listName}>
                  {s.name}
                  <span className={styles.listRiver}>{riverLabel(s.river)}</span>
                </span>
                {s.measuredAt && (
                  <span className={styles.listAddr}>📅 {s.measuredAt}</span>
                )}
              </div>
              <div className={styles.listRight}>
                {s.level !== null && (
                  <span
                    className={styles.levelVal}
                    style={{ color: STATUS_COLOR[s.status] }}
                  >
                    {s.level} cm
                  </span>
                )}
                <Badge variant={STATUS_BADGE[s.status] || 'muted'}>
                  {STATUS_LABEL[s.status] || 'Brak danych'}
                </Badge>
              </div>
            </button>
          ))}
        </div>
        <p className={styles.source}>
          Źródło: IMGW · danepubliczne.imgw.pl · dane odświeżane co 15 min
        </p>
      </div>

    </div>
  );
}

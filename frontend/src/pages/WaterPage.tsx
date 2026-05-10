import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import type { WaterLevel } from '../types/api';
import { useFetch } from '../hooks/useFetch';
import { useThemeContext } from '../ThemeContext';
import Card from '../components/Card';
import Badge from '../components/Badge';
import styles from './WaterPage.module.css';

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const d2r = Math.PI / 180;
  const dLat = (lat2 - lat1) * d2r;
  const dLng = (lng2 - lng1) * d2r;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * d2r) * Math.cos(lat2 * d2r) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const STATUS: Record<string, { label: string; variant: 'green' | 'amber' | 'red' | 'muted'; color: string }> = {
  safe:    { label: 'Bezpieczny',       variant: 'green', color: '#22d3a5' },
  warning: { label: 'Ostrzeżenie',      variant: 'amber', color: '#f59e0b' },
  danger:  { label: 'Niebezpieczny',    variant: 'red',   color: '#ff3b4e' },
  unknown: { label: 'Brak danych',      variant: 'muted', color: 'rgba(255,255,255,0.25)' },
};

function getRiskColor(level: number | null, warning: number | null, alarm: number | null): string {
  if (level === null) return 'rgba(255,255,255,0.25)';
  if (alarm !== null && level >= alarm) return '#ff3b4e';
  if (warning !== null && level >= warning) return '#f59e0b';
  return '#22d3a5';
}

function getStatus(
  level: number | null,
  warning: number | null,
  alarm: number | null
): 'safe' | 'warning' | 'danger' | 'unknown' {
  if (level === null) return 'unknown';
  if (alarm !== null && level >= alarm) return 'danger';
  if (warning !== null && level >= warning) return 'warning';
  return 'safe';
}

export default function WaterPage() {
  const { data: stations, loading, error } = useFetch<WaterLevel[]>('/api/water-level');
  const [, setFlyTo] = useState<[number, number] | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const { theme } = useThemeContext();

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  const mapFilter = theme === 'dusk' ? 'brightness(0.7)' : 'none';

  function handleFindNearest() {
    if (!navigator.geolocation) {
      setGeoError('Geolokalizacja nie jest wspierana.');
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(coords);
        setGeoLoading(false);
        if (stations && stations.length > 0) {
          const sorted = [...stations].sort((a, b) => {
            if (!a.coordinates || !b.coordinates) return 0;
            const da = haversineKm(coords.lat, coords.lng, a.coordinates[0], a.coordinates[1]);
            const db = haversineKm(coords.lat, coords.lng, b.coordinates[0], b.coordinates[1]);
            return da - db;
          });
          const nearest = sorted[0];
          if (nearest.coordinates) setFlyTo([nearest.coordinates[0], nearest.coordinates[1]]);
        }
      },
      () => {
        setGeoLoading(false);
        setGeoError('Nie udało się pobrać lokalizacji. Sprawdź uprawnienia w ustawieniach przeglądarki.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const sortedStations = userPos && stations
    ? [...stations].sort((a, b) => {
        if (!a.coordinates || !b.coordinates) return 0;
        const da = haversineKm(userPos.lat, userPos.lng, a.coordinates[0], a.coordinates[1]);
        const db = haversineKm(userPos.lat, userPos.lng, b.coordinates[0], b.coordinates[1]);
        return da - db;
      })
    : stations;

  function distLabel(station: WaterLevel): string | null {
    if (!userPos || !station.coordinates) return null;
    const d = haversineKm(userPos.lat, userPos.lng, station.coordinates[0], station.coordinates[1]);
    if (d < 1) return `${Math.round(d * 1000)} m`;
    return `${d.toFixed(1)} km`;
  }

  const safeCount    = stations?.filter(s => getStatus(s.level, s.warningLevel, s.alarmLevel) === 'safe').length ?? 0;
  const warningCount = stations?.filter(s => getStatus(s.level, s.warningLevel, s.alarmLevel) === 'warning').length ?? 0;
  const dangerCount  = stations?.filter(s => getStatus(s.level, s.warningLevel, s.alarmLevel) === 'danger').length ?? 0;

  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h2 className={styles.pageTitle}>🌊 Stan Rzek</h2>
        <p className={styles.pageSub}>Poziomy wód — IMGW</p>
      </header>

      <div className={styles.statsRow}>
        <Card accent="var(--c-green)">
          {loading ? (
            <div>
              <div className={`skeleton skeletonStat`} />
              <div className={`skeleton skeletonStatLbl`} />
            </div>
          ) : (
            <>
              <p className={styles.statNum}>{safeCount}</p>
              <p className={styles.statLbl}>Bezpieczne</p>
            </>
          )}
        </Card>
        <Card accent="var(--c-amber)">
          {loading ? (
            <div>
              <div className={`skeleton skeletonStat`} />
              <div className={`skeleton skeletonStatLbl`} />
            </div>
          ) : (
            <>
              <p className={styles.statNum}>{warningCount}</p>
              <p className={styles.statLbl}>Ostrzeżenie</p>
            </>
          )}
        </Card>
        <Card accent="var(--c-red)">
          {loading ? (
            <div>
              <div className={`skeleton skeletonStat`} />
              <div className={`skeleton skeletonStatLbl`} />
            </div>
          ) : (
            <>
              <p className={styles.statNum}>{dangerCount}</p>
              <p className={styles.statLbl}>Alarm</p>
            </>
          )}
        </Card>
      </div>

      <button
        className={styles.geoBtn}
        onClick={handleFindNearest}
        disabled={geoLoading || loading}
      >
        {geoLoading ? '⏳ Szukanie…' : '📍 Znajdź najbliższą stację'}
      </button>

      {geoError && <div className={styles.geoError}>⚠️ {geoError}</div>}
      {error   && <p style={{ color: 'var(--c-red)' }}>Błąd: {error}</p>}

      {loading ? (
        <div className={`skeleton`} style={{ height: '20rem', borderRadius: 'var(--radius)' }} />
      ) : (
        <div className={styles.mapWrap} style={{ filter: mapFilter }}>
          <MapContainer center={[50.2406, 19.1378]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              key={tileUrl}
              url={tileUrl}
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              maxZoom={19}
            />
            {stations?.filter(s => s.coordinates).map(station => {
              const st = getStatus(station.level, station.warningLevel, station.alarmLevel);
              const c = STATUS[st]?.color ?? 'rgba(255,255,255,0.25)';
              return (
                <CircleMarker
                  key={station.id}
                  center={station.coordinates!}
                  radius={10}
                  color={c}
                  fillColor={c}
                  fillOpacity={0.35}
                  weight={2}
                >
                  <Popup>
                    <div style={{ minWidth: 200 }}>
                      <strong style={{ fontSize: '1rem', display: 'block', marginBottom: 4 }}>{station.name}</strong>
                      <p style={{ marginBottom: 2, fontSize: '0.85rem' }}>🏞️ {station.river}</p>
                      <p style={{ marginBottom: 2, fontSize: '0.85rem' }}>
                        Poziom: {station.level !== null ? `${station.level} cm` : '--'}
                      </p>
                      {station.warningLevel !== null && (
                        <p style={{ marginBottom: 2, fontSize: '0.85rem', color: '#f59e0b' }}>Ostrzegawczy: {station.warningLevel} cm</p>
                      )}
                      {station.alarmLevel !== null && (
                        <p style={{ marginBottom: 2, fontSize: '0.85rem', color: '#ff3b4e' }}>Alarmowy: {station.alarmLevel} cm</p>
                      )}
                      <Badge variant={STATUS[st].variant}>{STATUS[st].label}</Badge>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
      )}

      <div className={styles.list}>
        {sortedStations?.map(station => {
          const st = getStatus(station.level, station.warningLevel, station.alarmLevel);
          const q = STATUS[st];
          const riskColor = getRiskColor(station.level, station.warningLevel, station.alarmLevel);
          const measured = station.measuredAt
            ? new Date(station.measuredAt).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
            : null;
          return (
            <Card
              key={station.id}
              accent={q.color}
              onClick={station.coordinates ? () => setFlyTo(station.coordinates!) : undefined}
              style={{ cursor: station.coordinates ? 'pointer' : 'default' }}
            >
              <div className={styles.row}>
                <div className={styles.info}>
                  <p className={styles.name}>{station.name}</p>
                  <p className={styles.addr}>🏞️ {station.river}{station.province ? ` · ${station.province}` : ''}</p>
                  <div className={styles.levelRow}>
                    <div className={styles.levelBarTrack}>
                      <div
                        className={styles.levelBarFill}
                        style={{ '--bar-w': `${station.level !== null && station.alarmLevel !== null ? Math.min(station.level / station.alarmLevel, 1) * 100 : 0}%`, backgroundColor: riskColor } as React.CSSProperties}
                      />
                    </div>
                    <span className={styles.levelVal} style={{ color: riskColor }}>
                      {station.level !== null ? `${station.level} cm` : '--'}
                    </span>
                  </div>
                  <div className={styles.thresholds}>
                    {station.warningLevel !== null && <span className={styles.threshold}>Ostrzegawczy: {station.warningLevel} cm</span>}
                    {station.alarmLevel !== null && <span className={styles.threshold}>Alarmowy: {station.alarmLevel} cm</span>}
                  </div>
                  {measured && <span className={styles.measuredAt}>📡 {measured}</span>}
                  {distLabel(station) && <span className={styles.distLabel}>📍 {distLabel(station)} od Ciebie</span>}
                </div>
                <Badge variant={q.variant}>{q.label}</Badge>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          <strong style={{ color: 'var(--c-text)' }}>Źródło:</strong> IMGW-PIB · Stacje hydrologiczne w okolicy Mysłowic. Odświeżane co 60 minut.
        </p>
      </Card>
    </div>
  );
}

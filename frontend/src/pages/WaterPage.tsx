import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import type { WaterLevel } from '../types/api';
import { useFetch } from '../hooks/useFetch';
import { useThemeContext } from '../ThemeContext';
import CityBorder from '../components/CityBorder';
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
  const [expanded, setExpanded] = useState(false);
  const { theme } = useThemeContext();
  const PREVIEW = 5;

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  const mapFilter = theme === 'dusk' ? 'brightness(0.7)' : 'none';
  const borderColor = theme === 'light' ? '#000000' : '#ffffff';

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
            <CityBorder borderColor={borderColor} />
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

      <div className={styles.listWrap}>
        <h2 className={styles.listTitle}>Wszystkie stacje ({sortedStations?.length ?? 0})</h2>
        <div className={styles.list}>
          {sortedStations?.slice(0, PREVIEW).map(station => {
            const st = getStatus(station.level, station.warningLevel, station.alarmLevel);
            const q = STATUS[st];
            const riskColor = getRiskColor(station.level, station.warningLevel, station.alarmLevel);
            return (
              <button
                key={station.id}
                className={styles.listItem}
                onClick={station.coordinates ? () => setFlyTo(station.coordinates!) : undefined}
              >
                <div className={styles.listMain}>
                  <span className={styles.listName}>
                    {station.name}
                    <span className={styles.listRiver}>🏞️ {station.river}</span>
                  </span>
                  {station.measuredAt && (
                    <span className={styles.listAddr}>
                      📡 {new Date(station.measuredAt).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <div className={styles.listRight}>
                  <span className={styles.levelVal} style={{ color: riskColor }}>
                    {station.level !== null ? `${station.level} cm` : '--'}
                  </span>
                  <Badge variant={q.variant}>{q.label}</Badge>
                </div>
              </button>
            );
          })}
        </div>
        {sortedStations && sortedStations.length > PREVIEW && (
          <>
            <div
              className={styles.listExtra}
              style={{ maxHeight: expanded ? `${(sortedStations.length - PREVIEW) * 90}px` : '0' }}
            >
              <div className={styles.list} style={{ paddingTop: '0.4rem' }}>
                {sortedStations.slice(PREVIEW).map(station => {
                  const st = getStatus(station.level, station.warningLevel, station.alarmLevel);
                  const q = STATUS[st];
                  const riskColor = getRiskColor(station.level, station.warningLevel, station.alarmLevel);
                  return (
                    <button
                      key={station.id}
                      className={styles.listItem}
                      onClick={station.coordinates ? () => setFlyTo(station.coordinates!) : undefined}
                    >
                      <div className={styles.listMain}>
                        <span className={styles.listName}>
                          {station.name}
                          <span className={styles.listRiver}>🏞️ {station.river}</span>
                        </span>
                        {station.measuredAt && (
                          <span className={styles.listAddr}>
                            📡 {new Date(station.measuredAt).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <div className={styles.listRight}>
                        <span className={styles.levelVal} style={{ color: riskColor }}>
                          {station.level !== null ? `${station.level} cm` : '--'}
                        </span>
                        <Badge variant={q.variant}>{q.label}</Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <button className={styles.toggleBtn} onClick={() => setExpanded(e => !e)}>
              {expanded ? '▲ Zwiń' : `▼ Pokaż wszystkie (${sortedStations.length})`}
            </button>
          </>
        )}
      </div>

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          <strong style={{ color: 'var(--c-text)' }}>Źródło:</strong> IMGW-PIB · Stacje hydrologiczne w okolicy Mysłowic. Odświeżane co 60 minut.
        </p>
      </Card>
    </div>
  );
}

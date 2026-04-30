import { useFetch } from '../hooks/useFetch.js';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import styles from './AirPage.module.css';

const QUALITY = {
  good:    { label: 'Dobra',      variant: 'green', color: '#22d3a5' },
  moderate:{ label: 'Średnia',    variant: 'amber', color: '#f59e0b' },
  poor:    { label: 'Zła',        variant: 'red',   color: '#ff3b4e' },
  unknown: { label: 'Brak danych',variant: 'muted', color: 'rgba(255,255,255,0.25)' },
};

const PM_BARS = [
  { key: 'pm25', label: 'PM2.5', color: null },
  { key: 'pm10', label: 'PM10',  color: '#3b82f6' },
  { key: 'pm1',  label: 'PM1',   color: '#a855f7' },
];

function PmBars({ s, qColor }) {
  return (
    <div className={styles.pmBars}>
      {PM_BARS.map(({ key, label, color: fixed }) => {
        const value = s[key] ?? null;
        const color = value !== null ? (fixed ?? qColor) : 'rgba(255,255,255,0.25)';
        const pct = value !== null ? Math.min(value / 75, 1) * 100 : 0;
        return (
          <div key={key} className={styles.pmBar}>
            <div className={styles.pmBarHeader}>
              <span className={styles.pmBarLabel}>{label}</span>
              <span className={styles.pmBarValue} style={{ color }}>
                {value !== null ? `${value} µg/m³` : '--'}
              </span>
            </div>
            <div className={styles.pmBarTrack}>
              <div
                className={styles.pmBarFill}
                style={{ '--bar-w': `${pct}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatUpdated(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr.replace(' ', 'T'));
  return d.toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function SensorCard({ s }) {
  const q = QUALITY[s.quality] ?? QUALITY.unknown;
  const updated = formatUpdated(s.updatedAt);

  return (
    <Card accent={q.color}>
      <div className={styles.sensorTop}>
        <div>
          <span className={styles.sensorName}>{s.name}</span>
          {s.city && <p className={styles.sensorCity}>{s.city}</p>}
          {s.address && <p className={styles.sensorAddr}>📍 {s.address}</p>}
          <p className={styles.sourceTag}>{s.source === 'airly' ? 'Airly' : 'GIOŚ'}</p>
        </div>
        <Badge variant={q.variant}>{q.label}</Badge>
      </div>

      <PmBars s={s} qColor={q.color} />

      <div className={styles.whoRow}>
        <div className={styles.whoNormRow}>
          <span className={styles.whoLabel}>PM2.5 — norma WHO: 15 µg/m³</span>
          {s.pm25 !== null ? (
            <span className={styles.whoStatus} style={{ color: s.pm25 <= 15 ? '#22d3a5' : '#ff3b4e' }}>
              {s.pm25 <= 15 ? '✓ w normie' : `+${s.pm25 - 15} ponad normę`}
            </span>
          ) : (
            <span className={styles.whoLabel}>Brak danych</span>
          )}
        </div>
        <div className={styles.whoNormRow}>
          <span className={styles.whoLabel}>PM10 — norma WHO: 45 µg/m³</span>
          {s.pm10 !== null ? (
            <span className={styles.whoStatus} style={{ color: s.pm10 <= 45 ? '#22d3a5' : '#ff3b4e' }}>
              {s.pm10 <= 45 ? '✓ w normie' : `+${s.pm10 - 45} ponad normę`}
            </span>
          ) : (
            <span className={styles.whoLabel}>Brak danych</span>
          )}
        </div>
        {updated && <span className={styles.updatedAt}>{updated}</span>}
      </div>
    </Card>
  );
}

export default function AirPage() {
  const { data: sensors, loading, error } = useFetch('/api/air');

  const validPm25 = sensors?.filter(s => s.pm25 !== null) ?? [];
  const avgPm25 = validPm25.length
    ? Math.round(validPm25.reduce((s, x) => s + x.pm25, 0) / validPm25.length)
    : null;

  const avgQuality = avgPm25 === null ? 'unknown'
    : avgPm25 < 25 ? 'good'
    : avgPm25 < 50 ? 'moderate'
    : 'poor';

  const avgAccent = avgQuality === 'good' ? 'var(--c-green)'
    : avgQuality === 'moderate' ? 'var(--c-amber)'
    : avgQuality === 'poor' ? 'var(--c-red)'
    : 'var(--c-muted)';

  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h2 className={styles.pageTitle}>🌫️ Jakość Powietrza</h2>
        <p className={styles.pageSub}>Mysłowice i okolice — stacje GIOŚ w promieniu 20 km</p>
      </header>

      <div className={styles.statsRow}>
        <Card accent="var(--c-blue)">
          <p className={styles.statNum}>{loading ? '…' : validPm25.length}</p>
          <p className={styles.statLbl}>Stacje aktywne</p>
        </Card>
        <Card accent={avgAccent}>
          <p className={styles.statNum}>{loading ? '…' : avgPm25 ?? '--'}</p>
          <p className={styles.statLbl}>Średnie PM2.5 µg/m³</p>
        </Card>
        <Card accent="var(--c-muted)">
          <p className={styles.statNum}>15</p>
          <p className={styles.statLbl}>Norma WHO µg/m³</p>
        </Card>
      </div>

      {loading && <p style={{ color: 'var(--c-muted)' }}>Ładowanie danych z GIOŚ…</p>}
      {error   && <p style={{ color: 'var(--c-red)' }}>Błąd: {error}</p>}

      <div className={styles.grid}>
        {validPm25.map(s => <SensorCard key={s.id} s={s} />)}
      </div>

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          <strong style={{ color: 'var(--c-text)' }}>Źródła:</strong> GIOŚ (stacje w promieniu 20 km) + Airly (czujniki w promieniu 5 km od centrum Mysłowic). Dane odświeżane co 30 minut. Mysłowice leżą w jednym z najbardziej zanieczyszczonych regionów Polski.
        </p>
      </Card>
    </div>
  );
}

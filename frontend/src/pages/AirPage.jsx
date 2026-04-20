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

function Gauge({ pm25, quality }) {
  const q = QUALITY[quality] ?? QUALITY.unknown;
  const pct = pm25 !== null ? Math.min(pm25 / 75, 1) : 0;
  const total = 101;
  const offset = total - pct * total;

  return (
    <div className={styles.gaugeWrap}>
      <svg width="100" height="62" viewBox="0 0 100 62">
        <path d="M10,56 A40,40 0 0,1 90,56" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path
          d="M10,56 A40,40 0 0,1 90,56"
          stroke={q.color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${total} ${total}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 1s ease' }}
        />
        <text x="50" y="50" textAnchor="middle" fontSize="16" fontWeight="600" fill={q.color} fontFamily="DM Serif Display, serif">
          {pm25 !== null ? pm25 : '--'}
        </text>
      </svg>
      <span className={styles.gaugeUnit}>PM2.5 µg/m³</span>
    </div>
  );
}

function formatUpdated(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr.replace(' ', 'T'));
  return d.toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
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
          <p className={styles.statNum}>{loading ? '…' : sensors?.length ?? 0}</p>
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
        {sensors?.map(s => {
          const q = QUALITY[s.quality] ?? QUALITY.unknown;
          const updated = formatUpdated(s.updatedAt);
          return (
            <Card key={s.id} accent={q.color}>
              <div className={styles.sensorTop}>
                <div>
                  <span className={styles.sensorName}>{s.name}</span>
                  {s.city && <p className={styles.sensorCity}>{s.city}</p>}
                  {s.address && <p className={styles.sensorAddr}>📍 {s.address}</p>}
                  <p className={styles.sourceTag}>{s.source === 'airly' ? 'Airly' : 'GIOŚ'}</p>
                </div>
                <Badge variant={q.variant}>{q.label}</Badge>
              </div>

              <Gauge pm25={s.pm25} quality={s.quality} />

              {s.pm10 !== null && (
                <p className={styles.pm10Row}>
                  <span className={styles.pm10Label}>PM10</span>
                  <span className={styles.pm10Value}>{s.pm10} µg/m³</span>
                </p>
              )}

              <div className={styles.whoRow}>
                {s.pm25 !== null ? (
                  <>
                    <span className={styles.whoLabel}>Norma WHO: 15 µg/m³</span>
                    <span
                      className={styles.whoStatus}
                      style={{ color: s.pm25 <= 15 ? '#22d3a5' : s.pm25 <= 25 ? '#f59e0b' : '#ff3b4e' }}
                    >
                      {s.pm25 <= 15 ? '✓ w normie' : `+${s.pm25 - 15} ponad normę`}
                    </span>
                  </>
                ) : (
                  <span className={styles.whoLabel}>Brak aktualnych pomiarów</span>
                )}
                {updated && <span className={styles.updatedAt}>{updated}</span>}
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          <strong style={{ color: 'var(--c-text)' }}>Źródła:</strong> GIOŚ (stacje w promieniu 20 km) + Airly (czujniki w promieniu 5 km od centrum Mysłowic). Dane odświeżane co 30 minut. Mysłowice leżą w jednym z najbardziej zanieczyszczonych regionów Polski.
        </p>
      </Card>
    </div>
  );
}

import { useFetch } from '../hooks/useFetch.js';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import styles from './AirPage.module.css';

const QUALITY = {
  good:     { label: 'Dobra',   variant: 'green', color: '#22d3a5', textColor: '#059669' },
  moderate: { label: 'Średnia', variant: 'amber', color: '#f59e0b', textColor: '#b45309' },
  poor:     { label: 'Zła',     variant: 'red',   color: '#ff3b4e', textColor: '#dc2626' },
};

function Gauge({ pm25, quality }) {
  const q = QUALITY[quality] ?? QUALITY.good;
  // Skala: 0–75 µg/m³ → 0–100%
  const pct = Math.min(pm25 / 75, 1);
  // Łuk: całkowita długość półokręgu ≈ 101px (dla r=32)
  const total = 101;
  const filled = pct * total;
  const offset = total - filled;

  return (
    <div className={styles.gaugeWrap}>
      <svg width="100" height="62" viewBox="0 0 100 62">
        {/* Tło łuku */}
        <path
          d="M10,56 A40,40 0 0,1 90,56"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        {/* Wypełnienie łuku */}
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
        {/* Liczba PM2.5 */}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          fontSize="16"
          fontWeight="600"
          fill={q.color}
          fontFamily="DM Serif Display, serif"
        >
          {pm25}
        </text>
      </svg>
      <span className={styles.gaugeUnit}>µg/m³</span>
    </div>
  );
}

export default function AirPage() {
  const { data: sensors, loading, error } = useFetch('/api/air');

  // Oblicz średnią PM2.5
  const avgPm25 = sensors
    ? Math.round(sensors.reduce((s, x) => s + x.pm25, 0) / sensors.length)
    : null;

  const avgQuality = avgPm25 === null ? 'good'
    : avgPm25 < 25 ? 'good'
    : avgPm25 < 50 ? 'moderate'
    : 'poor';

  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h2 className={styles.pageTitle}>🌫️ Jakość Powietrza</h2>
        <p className={styles.pageSub}>Mysłowice — dane z czujników PM2.5</p>
      </header>

      {/* Statystyki ogólne */}
      <div className={styles.statsRow}>
        <Card accent="var(--c-blue)">
          <p className={styles.statNum}>{loading ? '…' : sensors?.length ?? 0}</p>
          <p className={styles.statLbl}>Czujniki aktywne</p>
        </Card>
        <Card accent={`var(--c-${avgQuality === 'good' ? 'green' : avgQuality === 'moderate' ? 'amber' : 'red'})`}>
          <p className={styles.statNum}>{loading ? '…' : avgPm25 ?? '--'}</p>
          <p className={styles.statLbl}>Średnie PM2.5 µg/m³</p>
        </Card>
        <Card accent="var(--c-muted)">
          <p className={styles.statNum}>15</p>
          <p className={styles.statLbl}>Norma WHO µg/m³</p>
        </Card>
      </div>

      {loading && <p style={{ color: 'var(--c-muted)' }}>Ładowanie…</p>}
      {error   && <p style={{ color: 'var(--c-red)'   }}>Błąd: {error}</p>}

      <div className={styles.grid}>
        {sensors?.map(s => {
          const q = QUALITY[s.quality] ?? QUALITY.good;
          return (
            <Card key={s.id} accent={q.color}>
              <div className={styles.sensorTop}>
                <div>
                  <span className={styles.sensorName}>{s.name}</span>
                  <p className={styles.sensorAddr}>📍 {s.address}</p>
                </div>
                <Badge variant={q.variant}>{q.label}</Badge>
              </div>

              <Gauge pm25={s.pm25} quality={s.quality} />

              <div className={styles.whoRow}>
                <span className={styles.whoLabel}>Norma WHO: 15 µg/m³</span>
                <span
                  className={styles.whoStatus}
                  style={{ color: s.pm25 <= 15 ? '#22d3a5' : s.pm25 <= 25 ? '#f59e0b' : '#ff3b4e' }}
                >
                  {s.pm25 <= 15 ? '✓ w normie' : `+${s.pm25 - 15} ponad normę`}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          <strong style={{ color: 'var(--c-text)' }}>Źródło:</strong> Dane przykładowe — w produkcji podłącz klucz API Airly przez backend. Mysłowice leżą w jednym z najbardziej zanieczyszczonych regionów Polski.
        </p>
      </Card>
    </div>
  );
}

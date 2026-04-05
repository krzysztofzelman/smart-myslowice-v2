import { useFetch } from '../hooks/useFetch.js';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import styles from './AirPage.module.css';

const QUALITY = {
  good:     { label: 'Dobra',    variant: 'green', color: 'var(--c-green)' },
  moderate: { label: 'Średnia',  variant: 'amber', color: 'var(--c-amber)' },
  poor:     { label: 'Zła',      variant: 'red',   color: 'var(--c-red)'   },
};

function AqiBar({ pm25 }) {
  // PM2.5: 0–25 good, 25–50 moderate, 50+ poor
  const pct = Math.min((pm25 / 75) * 100, 100);
  const color = pm25 < 25 ? 'var(--c-green)' : pm25 < 50 ? 'var(--c-amber)' : 'var(--c-red)';
  return (
    <div className={styles.bar}>
      <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function AirPage() {
  const { data: sensors, loading, error } = useFetch('/api/air');

  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h2 className={styles.pageTitle}>🌫️ Jakość Powietrza</h2>
        <p className={styles.pageSub}>Mysłowice — dane z czujników Airly</p>
      </header>

      {loading && <p style={{ color: 'var(--c-muted)' }}>Ładowanie…</p>}
      {error   && <p style={{ color: 'var(--c-red)'   }}>Błąd: {error}</p>}

      <div className={styles.grid}>
        {sensors?.map(s => {
          const q = QUALITY[s.quality] ?? QUALITY.good;
          return (
            <Card key={s.id} accent={q.color}>
              <div className={styles.sensorTop}>
                <span className={styles.sensorName}>{s.name}</span>
                <Badge variant={q.variant}>{q.label}</Badge>
              </div>
              <p className={styles.pm25}>{s.pm25} <span>µg/m³</span></p>
              <p className={styles.sensorAddr}>📍 {s.address}</p>
              <AqiBar pm25={s.pm25} />
              <p className={styles.barLabel}>PM2.5 — norma WHO: 15 µg/m³</p>
            </Card>
          );
        })}
      </div>

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          <strong style={{ color: 'var(--c-text)' }}>Źródło:</strong> Airly API · Dane przykładowe — w produkcji podłącz klucz API Airly przez backend.
        </p>
      </Card>
    </div>
  );
}

import { useFetch } from '../hooks/useFetch.js';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import styles from './ListPage.module.css';

export default function EcoPage() {
  const { data: points, loading, error } = useFetch('/api/eco');

  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h2 className={styles.pageTitle}>♻️ Eko-punkty</h2>
        <p className={styles.pageSub}>Punkty segregacji i recyklingu w Mysłowicach</p>
      </header>

      <div className={styles.statsRow}>
        <Card accent="var(--c-green)">
          <p className={styles.statNum}>{loading ? '…' : points?.length ?? 0}</p>
          <p className={styles.statLbl}>Punkty zbiórki</p>
        </Card>
      </div>

      {loading && <p style={{ color: 'var(--c-muted)' }}>Ładowanie…</p>}
      {error   && <p style={{ color: 'var(--c-red)'   }}>Błąd: {error}</p>}

      <div className={styles.list}>
        {points?.map(p => (
          <Card key={p.id} accent="var(--c-green)">
            <div className={styles.row}>
              <div className={styles.info}>
                <p className={styles.name}>♻️ {p.name}</p>
                <p className={styles.addr}>📍 {p.address}</p>
                {p.phone && (
                  <p className={styles.addr}>📞 {p.phone}</p>
                )}
                {p.accepts && (
                  <p className={styles.accepts}>
                    <strong>Przyjmuje:</strong> {p.accepts}
                  </p>
                )}
              </div>
              <Badge variant="amber">
                {p.hours}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          💡 Dane PSZOK zweryfikowane na podstawie informacji Urzędu Miasta Mysłowice.
        </p>
      </Card>
    </div>
  );
}

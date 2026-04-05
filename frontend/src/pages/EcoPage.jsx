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
        <Card accent="var(--c-amber)">
          <p className={styles.statNum}>{loading ? '…' : points?.filter(p => p.access.includes('24/7')).length ?? 0}</p>
          <p className={styles.statLbl}>Dostępne 24/7</p>
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
                {p.accepts && (
                  <p className={styles.accepts}>
                    <strong>Przyjmuje:</strong> {p.accepts}
                  </p>
                )}
              </div>
              <Badge variant={p.access.includes('24/7') ? 'green' : 'amber'}>
                {p.access}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          💡 <strong style={{ color: 'var(--c-text)' }}>Dane wymagają weryfikacji</strong> z Urzędem Miasta Mysłowice. 📞 Infolinia PSZOK: 32 XXX XX XX
        </p>
      </Card>
    </div>
  );
}

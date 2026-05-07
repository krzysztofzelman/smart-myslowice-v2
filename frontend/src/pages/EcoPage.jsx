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
          {loading ? (
            <div>
              <div className={`skeleton skeletonStat`} />
              <div className={`skeleton skeletonStatLbl`} />
            </div>
          ) : (
            <>
              <p className={styles.statNum}>{points?.length ?? 0}</p>
              <p className={styles.statLbl}>Punkty zbiórki</p>
            </>
          )}
        </Card>
      </div>

      {loading && (
        <div className={styles.list}>
          {[1,2].map(i => (
            <div key={i} className={`skeleton`} style={{ height: '10rem', borderRadius: 'var(--radius)' }} />
          ))}
        </div>
      )}
      {error   && (
        <div style={{ padding: '1rem 1.2rem', background: 'rgba(255,59,78,0.1)', border: '1px solid rgba(255,59,78,0.3)', borderRadius: 'var(--radius)', color: 'var(--c-red)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
          ⚠️ Nie udało się załadować danych. Spróbuj ponownie.
        </div>
      )}

      <div className={styles.list}>
        {points?.map(p => (
          <Card
            key={p.id}
            accent="var(--c-green)"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (window.confirm(`Otworzyć Google Maps i wyznaczyć trasę do ${p.name}?`)) {
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address)}`,
                  '_blank'
                );
              }
            }}
          >
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

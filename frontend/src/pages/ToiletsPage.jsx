import { useFetch } from '../hooks/useFetch.js';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import styles from './ListPage.module.css';

export default function ToiletsPage() {
  const { data: toilets, loading, error } = useFetch('/api/toilets');

  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h2 className={styles.pageTitle}>🚻 Publiczne Toalety</h2>
        <p className={styles.pageSub}>Mysłowice — aktualne lokalizacje</p>
      </header>

      {loading && <p style={{ color: 'var(--c-muted)' }}>Ładowanie…</p>}
      {error   && <p style={{ color: 'var(--c-red)'   }}>Błąd: {error}</p>}

      <div className={styles.list}>
        {toilets?.map(t => (
          <Card key={t.id}>
            <div className={styles.row}>
              <div className={styles.info}>
                <p className={styles.name}>🚻 {t.name}</p>
                <p className={styles.addr}>📍 {t.address}</p>
              </div>
              <div className={styles.badges}>
                <Badge variant={t.access.includes('24/7') ? 'green' : 'amber'}>
                  {t.access}
                </Badge>
                <Badge variant={t.paid ? 'muted' : 'green'}>
                  {t.paid ? 'Płatna' : 'Bezpłatna'}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          💡 <strong style={{ color: 'var(--c-text)' }}>Pomóż rozbudować mapę!</strong> Znasz inne publiczne toalety w Mysłowicach? Zgłoś lokalizację do Urzędu Miasta.
        </p>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import Card from '../components/Card';
import Badge from '../components/Badge';
import styles from './ToiletsPage.module.css';

const PREVIEW = 5;

export default function ToiletsPage() {
  const { data: toilets, loading, error } = useFetch('/api/toilets');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h2 className={styles.pageTitle}>🚻 Publiczne Toalety</h2>
        <p className={styles.pageSub}>Mysłowice — aktualne lokalizacje</p>
      </header>

      {loading && (
        <div className={styles.list}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`skeleton`} style={{ height: '5.5rem', borderRadius: 'var(--radius)' }} />
          ))}
        </div>
      )}
      {error   && (
        <div style={{ padding: '1rem 1.2rem', background: 'rgba(255,59,78,0.1)', border: '1px solid rgba(255,59,78,0.3)', borderRadius: 'var(--radius)', color: 'var(--c-red)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
          ⚠️ Nie udało się załadować danych. Spróbuj ponownie.
        </div>
      )}

      <div className={styles.list}>
        {toilets?.slice(0, PREVIEW).map(t => (
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

      {toilets?.length > PREVIEW && (
        <>
          <div
            className={styles.listExtra}
            style={{ maxHeight: expanded ? `${(toilets.length - PREVIEW) * 120}px` : '0' }}
          >
            <div className={styles.list} style={{ paddingTop: '0.4rem' }}>
              {toilets.slice(PREVIEW).map(t => (
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
          </div>
          <button
            className={styles.toggleBtn}
            onClick={() => setExpanded(e => !e)}
          >
            {expanded
              ? '▲ Zwiń'
              : `▼ Pokaż wszystkie (${toilets.length})`}
          </button>
        </>
      )}

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          💡 <strong style={{ color: 'var(--c-text)' }}>Pomóż rozbudować mapę!</strong> Znasz inne publiczne toalety w Mysłowicach? Zgłoś lokalizację do Urzędu Miasta.
        </p>
      </Card>
    </div>
  );
}

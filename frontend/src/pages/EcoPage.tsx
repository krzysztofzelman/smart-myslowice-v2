import { useState } from 'react';
import type { EcoPoint } from '../types/api';
import { useFetch } from '../hooks/useFetch';
import Card from '../components/Card';
import Badge from '../components/Badge';
import styles from './EcoPage.module.css';

const PREVIEW = 5;

export default function EcoPage() {
  const { data: points, loading, error } = useFetch<EcoPoint[]>('/api/eco');
  const [expanded, setExpanded] = useState(false);

  const grouped = points?.reduce((acc, p) => {
    const type = p.type ?? 'Inne';
    if (!acc[type]) acc[type] = [];
    acc[type].push(p);
    return acc;
  }, {} as Record<string, EcoPoint[]>) ?? {};

  const types = Object.keys(grouped);

  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h2 className={styles.pageTitle}>♻️ Ekopunkty</h2>
        <p className={styles.pageSub}>Mysłowice — PSZOK i inne punkty</p>
      </header>

      {loading && (
        <div className={styles.list}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`skeleton`} style={{ height: '7rem', borderRadius: 'var(--radius)' }} />
          ))}
        </div>
      )}
      {error && (
        <div style={{ padding: '1rem 1.2rem', background: 'rgba(255,59,78,0.1)', border: '1px solid rgba(255,59,78,0.3)', borderRadius: 'var(--radius)', color: 'var(--c-red)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
          ⚠️ Nie udało się załadować danych. Spróbuj ponownie.
        </div>
      )}

      {types.map(type => (
        <div key={type} className={styles.category}>
          <h3 className={styles.categoryTitle}>
            {type === 'PSZOK' ? '🏭 Punkt Selektywnej Zbiórki Odpadów' : type === 'Organizacja' ? '🤝 Organizacje' : `📦 ${type}`}
          </h3>
          <div className={styles.list}>
            {grouped[type].slice(0, PREVIEW).map(p => (
              <Card 
                key={p.id} 
                onClick={() => p.coordinates && window.open(`https://www.google.com/maps/dir/?api=1&destination=${p.coordinates.lat},${p.coordinates.lng}`)}
                style={{ cursor: p.coordinates ? 'pointer' : 'default' }}
              >
                <div className={styles.row}>
                  <div className={styles.info}>
                    <p className={styles.name}>{p.name}</p>
                    {p.address && <p className={styles.addr}>📍 {p.address}</p>}
                    {p.hours && <p className={styles.detail}>🕐 {p.hours}</p>}
                    {p.phone && <p className={styles.detail}>📞 {p.phone}</p>}
                    {p.accepts && <p className={styles.detail}>♻️ <span style={{ color: 'var(--c-green)' }}>Przyjmuje:</span> {p.accepts}</p>}
                  </div>
                  <Badge variant={type === 'PSZOK' ? 'green' : 'amber'}>{type}</Badge>
                </div>
              </Card>
            ))}
          </div>
          {grouped[type].length > PREVIEW && (
            <>
              <div
                className={styles.listExtra}
                style={{ maxHeight: expanded ? `${(grouped[type].length - PREVIEW) * 165}px` : '0' }}
              >
                <div className={styles.list} style={{ paddingTop: '0.4rem' }}>
                  {grouped[type].slice(PREVIEW).map(p => (
                    <Card 
                      key={p.id} 
                      onClick={() => p.coordinates && window.open(`https://www.google.com/maps/dir/?api=1&destination=${p.coordinates.lat},${p.coordinates.lng}`)}
                      style={{ cursor: p.coordinates ? 'pointer' : 'default' }}
                    >
                      <div className={styles.row}>
                        <div className={styles.info}>
                          <p className={styles.name}>{p.name}</p>
                          {p.address && <p className={styles.addr}>📍 {p.address}</p>}
                          {p.hours && <p className={styles.detail}>🕐 {p.hours}</p>}
                          {p.phone && <p className={styles.detail}>📞 {p.phone}</p>}
                          {p.accepts && <p className={styles.detail}>♻️ <span style={{ color: 'var(--c-green)' }}>Przyjmuje:</span> {p.accepts}</p>}
                        </div>
                        <Badge variant={type === 'PSZOK' ? 'green' : 'amber'}>{type}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <button
                className={styles.toggleBtn}
                onClick={() => setExpanded(e => !e)}
              >
                {expanded ? '▲ Zwiń' : `▼ Pokaż wszystkie (${grouped[type].length})`}
              </button>
            </>
          )}
        </div>
      ))}

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          💡 <strong style={{ color: 'var(--c-text)' }}>PSZOK</strong> przyjmuje odpady segregowane. Przed wizytą sprawdź harmonogram na stronie Urzędu Miasta.
        </p>
      </Card>
    </div>
  );
}

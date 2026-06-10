import { useState } from 'react';
import type { EcoPoint } from '../types/api';
import { useFetch } from '../hooks/useFetch';
import { useLanguage } from '../i18n/LanguageContext';
import Card from '../components/Card';
import Badge from '../components/Badge';
import styles from './EcoPage.module.css';

const PREVIEW = 5;

function getMapUrl(p: EcoPoint): string {
  if (p.coordinates) {
    return `https://www.google.com/maps/search/?api=1&query=${p.coordinates.lat},${p.coordinates.lng}`;
  }
  if (p.address && p.address !== 'różne lokalizacje w mieście') {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ', Mysłowice')}`;
}

/* Wydzielona poza komponent — stabilna referencja, nie tworzona na nowo przy renderze. */
function EcoCard({ p, type }: { p: EcoPoint; type: string }) {
  const mapUrl = getMapUrl(p);
  return (
    <Card
      key={p.id}
      onClick={() => window.open(mapUrl, '_blank')}
      style={{ cursor: 'pointer' }}
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
  );
}

export default function EcoPage() {
  const { data: points, loading, error } = useFetch<EcoPoint[]>('/api/eco');
  const { t } = useLanguage();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const grouped = points?.reduce((acc, p) => {
    const type = p.type ?? 'Inne';
    if (!acc[type]) acc[type] = [];
    acc[type].push(p);
    return acc;
  }, {} as Record<string, EcoPoint[]>) ?? {};

  const types = Object.keys(grouped);

  function toggleCategory(type: string) {
    setExpandedCategories(prev => ({ ...prev, [type]: !prev[type] }));
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h2 className={styles.pageTitle}>♻️ {t.ecoPage.title}</h2>
        <p className={styles.pageSub}>{t.ecoPage.subtitle}</p>
      </header>

      {loading && (
        <div className={styles.list}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="skeleton" style={{ height: '7rem', borderRadius: 'var(--radius)' }} />
          ))}
        </div>
      )}
      {error && (
        <div style={{ padding: '1rem 1.2rem', background: 'rgba(255,59,78,0.1)', border: '1px solid rgba(255,59,78,0.3)', borderRadius: 'var(--radius)', color: 'var(--c-red)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
          ⚠️ {t.ecoPage.errorLoad}
        </div>
      )}

      {types.map(type => {
        const isExpanded = expandedCategories[type] ?? false;
        const categoryTitle: Record<string, string> = {
          'PSZOK': `🏭 ${t.ecoPage.categoryPszok}`,
          'Apteki': `💊 ${t.ecoPage.categoryPharmacy}`,
          'Elektroodpady': `🔌 ${t.ecoPage.categoryEwaste}`,
          'Tekstylia': `👕 ${t.ecoPage.categoryTextiles}`,
          'Baterie': `🔋 ${t.ecoPage.categoryBatteries}`,
        };
        return (
          <div key={type} className={styles.category}>
            <h3 className={styles.categoryTitle}>
              {categoryTitle[type] ?? `📦 ${type}`}
            </h3>
            <div className={styles.list}>
              {grouped[type].slice(0, PREVIEW).map(p => <EcoCard key={p.id} p={p} type={type} />)}
            </div>
            {grouped[type].length > PREVIEW && (
              <>
                <div
                  className={styles.listExtra}
                  style={{ maxHeight: isExpanded ? `${(grouped[type].length - PREVIEW) * 165}px` : '0' }}
                >
                  <div className={styles.list} style={{ paddingTop: '0.4rem' }}>
                    {grouped[type].slice(PREVIEW).map(p => <EcoCard key={p.id} p={p} type={type} />)}
                  </div>
                </div>
                <button
                  className={styles.toggleBtn}
                  onClick={() => toggleCategory(type)}
                >
                  {isExpanded ? t.ecoPage.collapse : `▼ ${t.ecoPage.showAll} (${grouped[type].length})`}
                </button>
              </>
            )}
          </div>
        );
      })}

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          {t.ecoPage.info}
        </p>
      </Card>
    </div>
  );
}

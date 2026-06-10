import { useState } from 'react';
import type { ToiletLocation } from '../types/api';
import { useFetch } from '../hooks/useFetch';
import { useLanguage } from '../i18n/LanguageContext';
import Card from '../components/Card';
import Badge from '../components/Badge';
import styles from './ToiletsPage.module.css';

const PREVIEW = 5;

export default function ToiletsPage() {
  const { data: toilets, loading, error } = useFetch<ToiletLocation[]>('/api/toilets');
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h2 className={styles.pageTitle}>🚻 {t.toiletsPage.title}</h2>
        <p className={styles.pageSub}>{t.toiletsPage.subtitle}</p>
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
          ⚠️ {t.toiletsPage.error}
        </div>
      )}

      <div className={styles.list}>
        {toilets?.slice(0, PREVIEW).map(t_ => (
          <Card key={t_.id}>
            <div className={styles.row}>
              <div className={styles.info}>
                <p className={styles.name}>🚻 {t_.name}</p>
                <p className={styles.addr}>📍 {t_.address}</p>
              </div>
              <div className={styles.badges}>
                <Badge variant={t_.access.includes('24/7') ? 'green' : 'amber'}>
                  {t_.access}
                </Badge>
                <Badge variant={t_.paid ? 'muted' : 'green'}>
                  {t_.paid ? t.toiletsPage.paid : t.toiletsPage.free}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {toilets && toilets.length > PREVIEW && (
        <>
          <div
            className={styles.listExtra}
            style={{ maxHeight: expanded ? `${(toilets.length - PREVIEW) * 120}px` : '0' }}
          >
            <div className={styles.list} style={{ paddingTop: '0.4rem' }}>
              {toilets.slice(PREVIEW).map(t_ => (
                <Card key={t_.id}>
                  <div className={styles.row}>
                    <div className={styles.info}>
                      <p className={styles.name}>🚻 {t_.name}</p>
                      <p className={styles.addr}>📍 {t_.address}</p>
                    </div>
                    <div className={styles.badges}>
                      <Badge variant={t_.access.includes('24/7') ? 'green' : 'amber'}>
                        {t_.access}
                      </Badge>
                      <Badge variant={t_.paid ? 'muted' : 'green'}>
                        {t_.paid ? t.toiletsPage.paid : t.toiletsPage.free}
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
              ? t.toiletsPage.collapse
              : `▼ ${t.toiletsPage.showAll} (${toilets.length})`}
          </button>
        </>
      )}

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          {t.toiletsPage.tip}
        </p>
      </Card>
    </div>
  );
}

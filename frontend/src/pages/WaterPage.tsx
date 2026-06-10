import { useState } from 'react';
import type { WaterLevel } from '../types/api';
import { useFetch } from '../hooks/useFetch';
import { useLanguage } from '../i18n/LanguageContext';
import { haversineKm } from '../utils/geo';
import { getWaterStatus, getRiskColor, WATER_STATUS } from '../utils/waterStatus';
import WaterMap from '../components/WaterMap';
import Card from '../components/Card';
import Badge from '../components/Badge';
import styles from './WaterPage.module.css';

export default function WaterPage() {
  const { data: stations, loading, error } = useFetch<WaterLevel[]>('/api/water-level');
  const { t } = useLanguage();
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const PREVIEW = 5;

  function handleFindNearest() {
    if (!navigator.geolocation) {
      setGeoError('Geolokalizacja nie jest wspierana.');
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(coords);
        setGeoLoading(false);
        if (stations && stations.length > 0) {
          const sorted = [...stations].sort((a, b) => {
            if (!a.coordinates || !b.coordinates) return 0;
            const da = haversineKm(coords.lat, coords.lng, a.coordinates[0], a.coordinates[1]);
            const db = haversineKm(coords.lat, coords.lng, b.coordinates[0], b.coordinates[1]);
            return da - db;
          });
          const nearest = sorted[0];
          if (nearest.coordinates) setFlyTo([nearest.coordinates[0], nearest.coordinates[1]]);
        }
      },
      () => {
        setGeoLoading(false);
        setGeoError('Nie udało się pobrać lokalizacji. Sprawdź uprawnienia w ustawieniach przeglądarki.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const sortedStations = userPos && stations
    ? [...stations].sort((a, b) => {
        if (!a.coordinates || !b.coordinates) return 0;
        const da = haversineKm(userPos.lat, userPos.lng, a.coordinates[0], a.coordinates[1]);
        const db = haversineKm(userPos.lat, userPos.lng, b.coordinates[0], b.coordinates[1]);
        return da - db;
      })
    : stations;


  const safeCount    = stations?.filter(s => getWaterStatus(s.level, s.warningLevel, s.alarmLevel) === 'safe').length ?? 0;
  const warningCount = stations?.filter(s => getWaterStatus(s.level, s.warningLevel, s.alarmLevel) === 'warning').length ?? 0;
  const dangerCount  = stations?.filter(s => getWaterStatus(s.level, s.warningLevel, s.alarmLevel) === 'danger').length ?? 0;

  return (
    <div className={styles.page}>
      <header className={styles.pageHead}>
        <h2 className={styles.pageTitle}>🌊 {t.waterPage.title}</h2>
        <p className={styles.pageSub}>{t.waterPage.subtitle}</p>
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
              <p className={styles.statNum}>{safeCount}</p>
              <p className={styles.statLbl}>{t.waterStatus.safe}</p>
            </>
          )}
        </Card>
        <Card accent="var(--c-amber)">
          {loading ? (
            <div>
              <div className={`skeleton skeletonStat`} />
              <div className={`skeleton skeletonStatLbl`} />
            </div>
          ) : (
            <>
              <p className={styles.statNum}>{warningCount}</p>
              <p className={styles.statLbl}>{t.waterStatus.warning}</p>
            </>
          )}
        </Card>
        <Card accent="var(--c-red)">
          {loading ? (
            <div>
              <div className={`skeleton skeletonStat`} />
              <div className={`skeleton skeletonStatLbl`} />
            </div>
          ) : (
            <>
              <p className={styles.statNum}>{dangerCount}</p>
              <p className={styles.statLbl}>{t.waterStatus.danger}</p>
            </>
          )}
        </Card>
      </div>

      <button
        className={styles.geoBtn}
        onClick={handleFindNearest}
        disabled={geoLoading || loading}
      >
        {geoLoading ? t.waterPage.geoBtnLoading : `📍 ${t.waterPage.geoBtnText}`}
      </button>

      {geoError && <div className={styles.geoError}>⚠️ {geoError}</div>}
      {error   && <p style={{ color: 'var(--c-red)' }}>{t.common.error} {error}</p>}

      {loading ? (
        <div className={`skeleton`} style={{ height: '480px', borderRadius: 'var(--radius)' }} />
      ) : (
        <div className={styles.contentRow}>
          <div className={styles.mapCol}>
            {stations && stations.length > 0 && (
              <div className={styles.mapWrap}>
                <WaterMap stations={stations} flyTo={flyTo} />
              </div>
            )}
          </div>

          <div className={styles.listCol}>
            <div className={styles.listWrap}>
        <h2 className={styles.listTitle}>{t.waterPage.listTitle} ({sortedStations?.length ?? 0})</h2>
        <div className={styles.list}>
          {sortedStations?.slice(0, PREVIEW).map(station => {
            const st = getWaterStatus(station.level, station.warningLevel, station.alarmLevel);
            const q = WATER_STATUS[st];
            const riskColor = getRiskColor(station.level, station.warningLevel, station.alarmLevel);
            return (
              <button
                key={station.id}
                className={styles.listItem}
                onClick={station.coordinates ? () => setFlyTo(station.coordinates!) : undefined}
              >
                <div className={styles.listMain}>
                  <span className={styles.listName}>
                    {station.name}
                    <span className={styles.listRiver}>🏞️ {station.river}</span>
                  </span>
                  {station.measuredAt && (
                    <span className={styles.listAddr}>
                      📡 {new Date(station.measuredAt).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <div className={styles.listRight}>
                  <span className={styles.levelVal} style={{ color: riskColor }}>
                    {station.level !== null ? `${station.level} cm` : '--'}
                  </span>
                  <Badge variant={q.variant}>{t.waterStatus[st as keyof typeof t.waterStatus]}</Badge>
                </div>
              </button>
            );
          })}
        </div>
        {sortedStations && sortedStations.length > PREVIEW && (
          <>
            <div
              className={styles.listExtra}
              style={{ maxHeight: expanded ? `${(sortedStations.length - PREVIEW) * 90}px` : '0' }}
            >
              <div className={styles.list} style={{ paddingTop: '0.4rem' }}>
                {sortedStations.slice(PREVIEW).map(station => {
                  const st = getWaterStatus(station.level, station.warningLevel, station.alarmLevel);
                  const q = WATER_STATUS[st];
                  const riskColor = getRiskColor(station.level, station.warningLevel, station.alarmLevel);
                  return (
                    <button
                      key={station.id}
                      className={styles.listItem}
                      onClick={station.coordinates ? () => setFlyTo(station.coordinates!) : undefined}
                    >
                      <div className={styles.listMain}>
                        <span className={styles.listName}>
                          {station.name}
                          <span className={styles.listRiver}>🏞️ {station.river}</span>
                        </span>
                        {station.measuredAt && (
                          <span className={styles.listAddr}>
                            📡 {new Date(station.measuredAt).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <div className={styles.listRight}>
                        <span className={styles.levelVal} style={{ color: riskColor }}>
                          {station.level !== null ? `${station.level} cm` : '--'}
                        </span>
                        <Badge variant={q.variant}>{t.waterStatus[st as keyof typeof t.waterStatus]}</Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <button className={styles.toggleBtn} onClick={() => setExpanded(e => !e)}>
              {expanded ? t.waterPage.collapse : `▼ ${t.waterPage.showAll} (${sortedStations.length})`}
            </button>
          </>
        )}
      </div>
        </div>
      </div>
      )}

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          <strong style={{ color: 'var(--c-text)' }}>{t.common.source}</strong> {t.waterPage.source} · {t.waterPage.sourceRefresh}
        </p>
      </Card>
    </div>
  );
}

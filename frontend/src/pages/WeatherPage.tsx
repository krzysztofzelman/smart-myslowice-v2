import { useState, useEffect } from 'react';
import type { WeatherData } from '../types/api';
import { useFetch } from '../hooks/useFetch';
import { OWM_ICONS } from '../constants';
import { useLanguage } from '../i18n/LanguageContext';
import Card from '../components/Card';
import styles from './WeatherPage.module.css';

function useDateTime() {
  const [dt, setDt] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setDt(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return dt;
}

const DAYS_PL = ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'];
const DAYS_EN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS_PL = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'];
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function formatDate(d: Date, lang: 'pl' | 'en') {
  const dayNames = lang === 'pl' ? DAYS_PL : DAYS_EN;
  const monthNames = lang === 'pl' ? MONTHS_PL : MONTHS_EN;
  return `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}
function formatTime(d: Date) {
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export default function WeatherPage() {
  const { data: weather, loading, error } = useFetch<WeatherData>('/api/weather');
  const { t, lang } = useLanguage();
  const now = useDateTime();

  const emoji = weather?.icon ? ((OWM_ICONS as Record<string, string>)[weather.icon] ?? '⛅') : '⛅';

  return (
    <div className={styles.page}>
      {/* Hero card */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <p className={styles.heroLoc}>📍 {t.weatherPage.location}</p>
          <p className={styles.heroDate}>{formatDate(now, lang)} · {formatTime(now)}</p>
          <div className={styles.heroMain}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="skeleton" style={{ width: '4rem', height: '4rem', borderRadius: '50%' }} />
                <div>
                  <div className="skeleton" style={{ width: '8rem', height: '3rem', marginBottom: '0.5rem' }} />
                  <div className="skeleton" style={{ width: '10rem', height: '1.2rem' }} />
                </div>
              </div>
            ) : (
              <>
                <span className={styles.heroIcon}>{error ? '⛅' : emoji}</span>
                <div>
                  <p className={styles.heroTemp}>
                    {error ? '--' : `${weather?.temp}°C`}
                  </p>
                  <p className={styles.heroDesc}>
                    {error ? t.weatherPage.noData : weather?.description}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detail cards */}
      <div className={styles.details}>
        <Card accent="var(--c-blue)">
          {loading ? (
            <div>
              <div className={`skeleton skeletonStat`} style={{ height: '2rem', width: '50%' }} />
              <div className={`skeleton skeletonStatLbl`} />
            </div>
          ) : (
            <>
              <p className={styles.detailVal}>💧 {weather?.humidity ?? '--'}%</p>
              <p className={styles.detailLbl}>{t.weatherPage.humidity}</p>
            </>
          )}
        </Card>
        <Card accent="var(--c-indigo)">
          {loading ? (
            <div>
              <div className={`skeleton skeletonStat`} style={{ height: '2rem', width: '50%' }} />
              <div className={`skeleton skeletonStatLbl`} />
            </div>
          ) : (
            <>
              <p className={styles.detailVal}>💨 {weather?.windKmh ?? '--'} km/h</p>
              <p className={styles.detailLbl}>{t.weatherPage.wind}</p>
            </>
          )}
        </Card>
        <Card accent="var(--c-amber)">
          {loading ? (
            <div>
              <div className={`skeleton skeletonStat`} style={{ height: '2rem', width: '50%' }} />
              <div className={`skeleton skeletonStatLbl`} />
            </div>
          ) : (
            <>
              <p className={styles.detailVal}>🌡️ {weather?.feelsLike ?? '--'}°C</p>
              <p className={styles.detailLbl}>{t.weatherPage.feelsLike}</p>
            </>
          )}
        </Card>
      </div>

      {error && (
        <Card>
          <p style={{ color: 'var(--c-red)', fontSize: '0.88rem' }}>
            ⚠️ {t.weatherPage.errorFetch}: {error}. {t.weatherPage.errorApiKey}
          </p>
        </Card>
      )}

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          <strong style={{ color: 'var(--c-text)' }}>{t.common.source}</strong> OpenWeatherMap API · {t.weatherPage.sourceText}
        </p>
      </Card>
    </div>
  );
}

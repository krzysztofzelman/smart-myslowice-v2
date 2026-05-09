import { useState, useEffect } from 'react';
import type { WeatherData } from '../types/api';
import { useFetch } from '../hooks/useFetch';
import { OWM_ICONS } from '../constants';
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

const DAYS    = ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'];
const MONTHS  = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'];

function formatDate(d: Date) {
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function formatTime(d: Date) {
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export default function WeatherPage() {
  const { data: weather, loading, error } = useFetch<WeatherData>('/api/weather');
  const now = useDateTime();

  const emoji = weather?.icon ? ((OWM_ICONS as Record<string, string>)[weather.icon] ?? '⛅') : '⛅';

  return (
    <div className={styles.page}>
      {/* Hero card */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <p className={styles.heroLoc}>📍 Mysłowice, Polska</p>
          <p className={styles.heroDate}>{formatDate(now)} · {formatTime(now)}</p>
          <div className={styles.heroMain}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className={`skeleton`} style={{ width: '4rem', height: '4rem', borderRadius: '50%' }} />
                <div>
                  <div className={`skeleton`} style={{ width: '8rem', height: '3rem', marginBottom: '0.5rem' }} />
                  <div className={`skeleton`} style={{ width: '10rem', height: '1.2rem' }} />
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
                    {error ? 'Brak danych' : weather?.description}
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
              <p className={styles.detailLbl}>Wilgotność</p>
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
              <p className={styles.detailLbl}>Prędkość wiatru</p>
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
              <p className={styles.detailLbl}>Odczuwalna</p>
            </>
          )}
        </Card>
      </div>

      {error && (
        <Card>
          <p style={{ color: 'var(--c-red)', fontSize: '0.88rem' }}>
            ⚠️ Błąd pobierania pogody: {error}. Sprawdź klucz API OpenWeatherMap w backendzie.
          </p>
        </Card>
      )}

      <Card>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.88rem' }}>
          <strong style={{ color: 'var(--c-text)' }}>Źródło:</strong> OpenWeatherMap API · Odświeżanie co 10 minut. Klucz API przechowywany po stronie serwera.
        </p>
      </Card>
    </div>
  );
}

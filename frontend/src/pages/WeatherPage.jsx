import { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch.js';
import { OWM_ICONS } from '../constants.js';
import Card from '../components/Card.jsx';
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

function formatDate(d) {
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function formatTime(d) {
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export default function WeatherPage() {
  const { data: weather, loading, error } = useFetch('/api/weather');
  const now = useDateTime();

  const emoji = weather?.icon ? (OWM_ICONS[weather.icon] ?? '⛅') : '⛅';

  return (
    <div className={styles.page}>
      {/* Hero card */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <p className={styles.heroLoc}>📍 Mysłowice, Polska</p>
          <p className={styles.heroDate}>{formatDate(now)} · {formatTime(now)}</p>
          <div className={styles.heroMain}>
            <span className={styles.heroIcon}>{loading ? '…' : emoji}</span>
            <div>
              <p className={styles.heroTemp}>
                {loading ? '…' : error ? '--' : `${weather.temp}°C`}
              </p>
              <p className={styles.heroDesc}>
                {loading ? 'Ładowanie…' : error ? 'Brak danych' : weather.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail cards */}
      <div className={styles.details}>
        <Card accent="var(--c-blue)">
          <p className={styles.detailVal}>💧 {loading ? '…' : weather?.humidity ?? '--'}%</p>
          <p className={styles.detailLbl}>Wilgotność</p>
        </Card>
        <Card accent="var(--c-indigo)">
          <p className={styles.detailVal}>💨 {loading ? '…' : weather?.windKmh ?? '--'} km/h</p>
          <p className={styles.detailLbl}>Prędkość wiatru</p>
        </Card>
        <Card accent="var(--c-amber)">
          <p className={styles.detailVal}>🌡️ {loading ? '…' : weather?.feelsLike ?? '--'}°C</p>
          <p className={styles.detailLbl}>Odczuwalna</p>
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
          <strong style={{ color: 'var(--c-text)' }}>Źródło:</strong> OpenWeatherMap API · Odświeżanie co 10 minut. Klucz API przechowywany po stronie serwera (Express).
        </p>
      </Card>
    </div>
  );
}

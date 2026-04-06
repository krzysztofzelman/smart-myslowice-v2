import { useState, useEffect } from 'react';
import styles from './Header.module.css';

const DAYS = ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'];
const MONTHS = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'];

const OWM_ICONS = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '⛅',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌦️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

export default function Header({ themeLabel }) {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);

  // Zegar — aktualizuj co sekundę
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Pogoda — pobierz raz i co 10 minut
  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather');
        if (!res.ok) return;
        const data = await res.json();
        setWeather(data);
      } catch {
        // brak sieci — ignoruj
      }
    }
    fetchWeather();
    const id = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(time.getHours()).padStart(2, '0');
  const mm = String(time.getMinutes()).padStart(2, '0');
  const ss = String(time.getSeconds()).padStart(2, '0');
  const dayName = DAYS[time.getDay()];
  const dateStr = `${time.getDate()} ${MONTHS[time.getMonth()]} ${time.getFullYear()}`;
  const emoji = weather?.icon ? (OWM_ICONS[weather.icon] ?? '⛅') : '⛅';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.badge}>IoT · Live Data</div>
          {themeLabel && <div className={styles.themePill}>{themeLabel}</div>}
        </div>
        <div className={styles.mainRow}>
          <div>
            <h1 className={styles.title}>Smart Mysłowice</h1>
            <p className={styles.sub}>Platforma Danych Miejskich — Twoje miasto w czasie rzeczywistym</p>
          </div>
          {/* Zegar + pogoda */}
          <div className={styles.clockWidget}>
            <div className={styles.clockTime}>
              <span className={styles.clockHm}>{hh}:{mm}</span>
              <span className={styles.clockSs}>{ss}</span>
            </div>
            <div className={styles.clockDate}>{dayName}, {dateStr}</div>
            {weather && (
              <div className={styles.clockWeather}>
                <span className={styles.clockWeatherIcon}>{emoji}</span>
                <span className={styles.clockWeatherTemp}>{weather.temp}°C</span>
                <span className={styles.clockWeatherDesc}>{weather.description}</span>
              </div>
            )}
            {!weather && (
              <div className={styles.clockWeather}>
                <span className={styles.clockWeatherDesc}>Ładowanie pogody…</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.glow} />
      <div className={styles.grid} />
    </header>
  );
}

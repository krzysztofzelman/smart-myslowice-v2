import { useState, useEffect } from 'react';
import { useThemeContext } from '../ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { OWM_ICONS } from '../constants';
import styles from './Header.module.css';

const THEME_LABEL: Record<string, (t: ReturnType<typeof useLanguage>['t']) => string> = {
  light: (t) => `☀️ ${t.header.themeDay}`,
  dusk: (t) => `🌅 ${t.header.themeDusk}`,
  dark: (t) => `🌙 ${t.header.themeNight}`,
};

const DAYS_PL = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS_PL = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type HeaderProps = {};

export default function Header(_props: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<{ temp: number; icon: string; description: string } | null>(null);
  const { theme, cycleTheme } = useThemeContext();
  const { t, lang, toggleLang } = useLanguage();

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
        const data = await res.json() as { temp: number; icon: string; description: string };
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
  const dayNames = lang === 'pl' ? DAYS_PL : DAYS_EN;
  const monthNames = lang === 'pl' ? MONTHS_PL : MONTHS_EN;
  const dayName = dayNames[time.getDay()];
  const dateStr = `${time.getDate()} ${monthNames[time.getMonth()]} ${time.getFullYear()}`;
  const emoji = weather?.icon ? (OWM_ICONS[weather.icon as keyof typeof OWM_ICONS] ?? '⛅') : '⛅';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.badge}>{t.header.badge}</div>
          <button className={styles.langBtn} onClick={toggleLang} title={t.header.languageSwitchTitle}>
            {t.header.languageSwitch}
          </button>
          <button className={styles.themePill} onClick={cycleTheme} title={t.header.themeTitle}>
            {THEME_LABEL[theme](t)}
          </button>
        </div>
        <div className={styles.mainRow}>
          <div>
            <h1 className={styles.title}>{t.header.title}</h1>
            <p className={styles.sub}>{t.header.subtitle}</p>
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
                <span className={styles.clockWeatherDesc}>{t.header.loadingWeather}</span>
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

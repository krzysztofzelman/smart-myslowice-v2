import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Header from './components/Header.jsx';
import Nav from './components/Nav.jsx';
import { useTheme } from './hooks/useTheme.js';
import { ThemeContext } from './ThemeContext.js';
import styles from './App.module.css';

const AedPage     = lazy(() => import('./pages/AedPage.jsx'));
const AirPage     = lazy(() => import('./pages/AirPage.jsx'));
const WeatherPage = lazy(() => import('./pages/WeatherPage.jsx'));
const ToiletsPage = lazy(() => import('./pages/ToiletsPage.jsx'));
const EcoPage     = lazy(() => import('./pages/EcoPage.jsx'));
const WaterPage   = lazy(() => import('./pages/WaterPage.jsx'));
// const TransitPage = lazy(() => import('./pages/TransitPage.jsx'));

const TABS = [
  { id: 'aed',     label: 'Defibrylatory', icon: '🚑' },
  { id: 'air',     label: 'Powietrze',     icon: '🌫️' },
  { id: 'weather', label: 'Pogoda',         icon: '⛅' },
  { id: 'toilets', label: 'Toalety',        icon: '🚻' },
  { id: 'eco',     label: 'Eko-punkty',     icon: '♻️' },
  { id: 'water',   label: 'Stan Wód',       icon: '💧' },
  // { id: 'transit', label: 'Transport',      icon: '🚌' },
];

const PAGE = {
  aed:     <AedPage />,
  air:     <AirPage />,
  weather: <WeatherPage />,
  toilets: <ToiletsPage />,
  eco:     <EcoPage />,
  water:   <WaterPage />,
  // transit: <TransitPage />,
};

function PageFallback() {
  return (
    <div className={styles.fallback}>
      <div className={styles.fallbackSpinner} />
      <p className={styles.fallbackText}>Ładowanie…</p>
    </div>
  );
}

const THEME_CYCLE = ['light', 'dusk', 'dark'];

export default function App() {
  const [active, setActive] = useState('aed');
  const autoTheme = useTheme();
  const [manual, setManual] = useState(null);
  const theme = manual ?? autoTheme;

  const cycleTheme = useCallback(() => {
    const current = document.documentElement.getAttribute('data-theme') ?? 'dark';
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(current) + 1) % THEME_CYCLE.length];
    setManual(next);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      <div className={styles.app}>
        <Header />
        <Nav tabs={TABS} active={active} onSwitch={setActive} />
        <main className={styles.main}>
          <Suspense fallback={<PageFallback />}>
            {PAGE[active]}
          </Suspense>
        </main>
        <footer className={styles.footer}>
          <p><strong>Smart Mysłowice</strong> — Projekt edukacyjny</p>
          <p className={styles.footerSub}>Dane przykładowe wymagają weryfikacji z Urzędem Miasta · 2026</p>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}

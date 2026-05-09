import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import { useTheme } from './hooks/useTheme';
import { ThemeContext } from './ThemeContext';
import type { Theme } from './hooks/useTheme';
import styles from './App.module.css';

type TabId = 'aed' | 'air' | 'weather' | 'toilets' | 'eco' | 'water';

const AedPage = lazy(() => import('./pages/AedPage.jsx'));
const AirPage = lazy(() => import('./pages/AirPage.jsx'));
const WeatherPage = lazy(() => import('./pages/WeatherPage.jsx'));
const ToiletsPage = lazy(() => import('./pages/ToiletsPage.jsx'));
const EcoPage = lazy(() => import('./pages/EcoPage.jsx'));
const WaterPage = lazy(() => import('./pages/WaterPage.jsx'));

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'aed', label: 'Defibrylatory', icon: '🚑' },
  { id: 'air', label: 'Powietrze', icon: '🌫️' },
  { id: 'weather', label: 'Pogoda', icon: '⛅' },
  { id: 'toilets', label: 'Toalety', icon: '🚻' },
  { id: 'eco', label: 'Eko-punkty', icon: '♻️' },
  { id: 'water', label: 'Stan Wód', icon: '💧' },
];

const PAGE: Record<TabId, React.ReactNode> = {
  aed: <AedPage />,
  air: <AirPage />,
  weather: <WeatherPage />,
  toilets: <ToiletsPage />,
  eco: <EcoPage />,
  water: <WaterPage />,
};

function PageFallback() {
  return (
    <div className={styles.fallback}>
      <div className={styles.fallbackSpinner} />
      <p className={styles.fallbackText}>Ładowanie…</p>
    </div>
  );
}

const THEME_CYCLE: Theme[] = ['light', 'dusk', 'dark'];

export default function App() {
  const [active, setActive] = useState<TabId>('aed');
  const autoTheme = useTheme();
  const [manual, setManual] = useState<Theme | null>(null);
  const theme: Theme = manual ?? autoTheme;

  const cycleTheme = useCallback(() => {
    const current = (document.documentElement.getAttribute('data-theme') ?? 'dark') as Theme;
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
        <Nav tabs={TABS} active={active} onSwitch={(tab) => setActive(tab as TabId)} />
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

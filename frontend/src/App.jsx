import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import Nav from './components/Nav.jsx';
import AedPage from './pages/AedPage.jsx';
import AirPage from './pages/AirPage.jsx';
import WeatherPage from './pages/WeatherPage.jsx';
import ToiletsPage from './pages/ToiletsPage.jsx';
import EcoPage from './pages/EcoPage.jsx';
import WaterPage from './pages/WaterPage.jsx';
// import TransitPage from './pages/TransitPage.jsx';
import { useTheme } from './hooks/useTheme.js';
import { ThemeContext } from './ThemeContext.js';
import styles from './App.module.css';

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
          {PAGE[active]}
        </main>
        <footer className={styles.footer}>
          <p><strong>Smart Mysłowice</strong> — Projekt edukacyjny</p>
          <p className={styles.footerSub}>Dane przykładowe wymagają weryfikacji z Urzędem Miasta · 2026</p>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}

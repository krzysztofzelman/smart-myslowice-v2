import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Nav from './components/Nav.jsx';
import AedPage from './pages/AedPage.jsx';
import AirPage from './pages/AirPage.jsx';
import WeatherPage from './pages/WeatherPage.jsx';
import ToiletsPage from './pages/ToiletsPage.jsx';
import EcoPage from './pages/EcoPage.jsx';
import { useTheme } from './hooks/useTheme.js';
import styles from './App.module.css';

const TABS = [
  { id: 'aed',     label: 'Defibrylatory', icon: '🚑' },
  { id: 'air',     label: 'Powietrze',     icon: '🌫️' },
  { id: 'weather', label: 'Pogoda',         icon: '⛅' },
  { id: 'toilets', label: 'Toalety',        icon: '🚻' },
  { id: 'eco',     label: 'Eko-punkty',     icon: '♻️' },
];

const PAGE = {
  aed:     <AedPage />,
  air:     <AirPage />,
  weather: <WeatherPage />,
  toilets: <ToiletsPage />,
  eco:     <EcoPage />,
};

const THEME_LABEL = {
  dark:  '🌙 Noc',
  dusk:  '🌇 Zmierzch',
  light: '☀️ Dzień',
};

export default function App() {
  const [active, setActive] = useState('aed');
  const theme = useTheme();

  // Aplikuj data-theme na <html> żeby CSS variables działały globalnie
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={styles.app}>
      <Header themeLabel={THEME_LABEL[theme]} />
      <Nav tabs={TABS} active={active} onSwitch={setActive} />
      <main className={styles.main}>
        {PAGE[active]}
      </main>
      <footer className={styles.footer}>
        <p><strong>Smart Mysłowice</strong> — Projekt edukacyjny</p>
        <p className={styles.footerSub}>Dane przykładowe wymagają weryfikacji z Urzędem Miasta · 2026</p>
      </footer>
    </div>
  );
}

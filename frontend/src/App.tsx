import { useEffect, useCallback, lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Nav from './components/Nav';
import ErrorBoundary from './components/ErrorBoundary';
import AIAssistant from './components/AIAssistant';
import { useTheme } from './hooks/useTheme';
import { ThemeContext } from './ThemeContext';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import type { Theme } from './hooks/useTheme';
import styles from './App.module.css';

const AirPage = lazy(() => import('./pages/AirPage'));
const AedPage = lazy(() => import('./pages/AedPage'));
const WeatherPage = lazy(() => import('./pages/WeatherPage'));
const ToiletsPage = lazy(() => import('./pages/ToiletsPage'));
const EcoPage = lazy(() => import('./pages/EcoPage'));
const WaterPage = lazy(() => import('./pages/WaterPage'));

interface Tab {
  id: string;
  label: string;
  icon: string;
}

function PageFallback() {
  return (
    <div className={styles.fallback}>
      <div className={styles.fallbackSpinner} />
      <p className={styles.fallbackText}>Ładowanie…</p>
    </div>
  );
}

const THEME_CYCLE: Theme[] = ['light', 'dusk', 'dark'];

function InnerApp() {
  const autoTheme = useTheme();
  const [manual, setManual] = useState<Theme | null>(null);
  const theme: Theme = manual ?? autoTheme;
  const location = useLocation();
  const { t } = useLanguage();

  const TABS: Tab[] = [
    { id: 'air', label: t.app.tabAir, icon: '🌫️' },
    { id: 'aed', label: t.app.tabAed, icon: '🚑' },
    { id: 'weather', label: t.app.tabWeather, icon: '⛅' },
    { id: 'toilets', label: t.app.tabToilets, icon: '🚻' },
    { id: 'eco', label: t.app.tabEco, icon: '♻️' },
    { id: 'water', label: t.app.tabWater, icon: '💧' },
  ];

  const cycleTheme = useCallback(() => {
    const current = (document.documentElement.getAttribute('data-theme') ?? 'dark') as Theme;
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(current) + 1) % THEME_CYCLE.length];
    setManual(next);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Close mobile nav when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      <div className={styles.app}>
        <Header />
        <Nav tabs={TABS} />
        <main className={styles.main}>
          <ErrorBoundary>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<AirPage />} />
                <Route path="/air" element={<Navigate to="/" replace />} />
                <Route path="/aed" element={<AedPage />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/toilets" element={<ToiletsPage />} />
                <Route path="/eco" element={<EcoPage />} />
                <Route path="/water" element={<WaterPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <footer className={styles.footer}>
          <p><strong>Smart Mysłowice</strong> — {t.app.footer}</p>
          <p className={styles.footerSub}>Dane przykładowe wymagają weryfikacji z Urzędem Miasta · 2026</p>
        </footer>
        <AIAssistant />
      </div>
    </ThemeContext.Provider>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <InnerApp />
    </LanguageProvider>
  );
}

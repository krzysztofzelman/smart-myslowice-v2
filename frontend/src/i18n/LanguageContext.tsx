import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Lang, type Translations, pl, en } from './translations';

interface LanguageContextValue {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'pl';
  const stored = localStorage.getItem('smart-myslowice-lang');
  if (stored === 'pl' || stored === 'en') return stored;
  return navigator.language.startsWith('pl') ? 'pl' : 'en';
}

function updateDocumentLang(lang: Lang) {
  const isEn = lang === 'en';
  document.documentElement.lang = lang;
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    isEn
      ? 'Smart Mysłowice – intelligent city portal. Check weather, air quality, public transport and AED locations in Mysłowice.'
      : 'Smart Mysłowice – inteligentny portal miejski. Sprawdź pogodę, jakość powietrza, komunikację miejską i lokalizacje AED w Mysłowicach.',
  );
  document.querySelector('meta[property="og:title"]')?.setAttribute(
    'content',
    isEn ? 'Smart Mysłowice – intelligent city portal' : 'Smart Mysłowice – inteligentny portal miejski',
  );
  document.querySelector('meta[property="og:description"]')?.setAttribute(
    'content',
    isEn ? 'Weather, air quality, public transport and AED in one place.' : 'Pogoda, jakość powietrza, komunikacja miejska i AED w jednym miejscu.',
  );
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', isEn ? 'en_US' : 'pl_PL');
  document.querySelector('meta[name="twitter:title"]')?.setAttribute(
    'content',
    isEn ? 'Smart Mysłowice – intelligent city portal' : 'Smart Mysłowice – inteligentny portal miejski',
  );
  document.querySelector('meta[name="twitter:description"]')?.setAttribute(
    'content',
    isEn ? 'Weather, air quality, public transport and AED in one place.' : 'Pogoda, jakość powietrza, komunikacja miejska i AED w jednym miejscu.',
  );
}

export function LanguageProvider({ children, defaultLang }: { children: ReactNode; defaultLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(defaultLang ?? getInitialLang);

  // Sync HTML lang + meta tags whenever language changes
  useEffect(() => {
    updateDocumentLang(lang);
  }, [lang]);

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem('smart-myslowice-lang', next);
  };

  const toggleLang = () => setLang(lang === 'pl' ? 'en' : 'pl');

  const t: Translations = lang === 'pl' ? pl : en;

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}

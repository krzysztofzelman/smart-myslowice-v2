import { createContext, useContext, useState, type ReactNode } from 'react';
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

export function LanguageProvider({ children, defaultLang }: { children: ReactNode; defaultLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(defaultLang ?? getInitialLang);

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

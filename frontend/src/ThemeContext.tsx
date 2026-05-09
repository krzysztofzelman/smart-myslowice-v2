import { createContext, useContext } from 'react';
import type { Theme } from './hooks/useTheme';

export interface ThemeContextValue {
  theme: Theme;
  cycleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  cycleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

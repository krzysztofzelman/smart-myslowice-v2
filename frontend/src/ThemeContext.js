import { createContext, useContext } from 'react';

export const ThemeContext = createContext({ theme: 'dark', cycleTheme: () => {} });
export const useThemeContext = () => useContext(ThemeContext);

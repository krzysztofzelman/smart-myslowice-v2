import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dusk' | 'dark';

interface SunTimes {
  sunrise: number; // ms since epoch
  sunset: number;  // ms since epoch
}

/**
 * Pobiera czas wschodu i zachodu słońca z API,
 * a następnie automatycznie przełącza motyw:
 *   - dzień  (sunrise → sunset)      → 'light'
 *   - zmierzch/świt (±30 min)        → 'dusk'   (ciepły półmrok)
 *   - noc                            → 'dark'
 *
 * Sprawdza co minutę, żeby nie przegapić przejścia.
 */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>('dark');
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);

  // Pobierz wschód/zachód z backendu (raz na godzinę)
  useEffect(() => {
    async function fetchSunTimes() {
      try {
        const res = await fetch('/api/weather');
        if (!res.ok) return;
        const data = await res.json() as { sunrise?: number; sunset?: number };
        if (data.sunrise && data.sunset) {
          setSunTimes({
            sunrise: data.sunrise * 1000, // → ms
            sunset: data.sunset * 1000,
          });
        }
      } catch {
        // sieć niedostępna — zostań przy obecnym motywie
      }
    }

    fetchSunTimes();
    const id = setInterval(fetchSunTimes, 60 * 60 * 1000); // odświeżaj co godzinę
    return () => clearInterval(id);
  }, []);

  // Oblicz motyw co minutę na podstawie aktualnego czasu
  useEffect(() => {
    if (!sunTimes) return;

    const times = sunTimes; // local alias for TS null narrowing

    function computeTheme() {
      const now = Date.now();
      const DUSK_MS = 30 * 60 * 1000; // 30 minut buforu na zmierzch/świt

      const isDawn = now >= times.sunrise - DUSK_MS && now < times.sunrise + DUSK_MS;
      const isDusk = now >= times.sunset - DUSK_MS && now < times.sunset + DUSK_MS;
      const isDay = now >= times.sunrise + DUSK_MS && now < times.sunset - DUSK_MS;

      if (isDay) setTheme('light');
      else if (isDawn || isDusk) setTheme('dusk');
      else setTheme('dark');
    }

    computeTheme();
    const id = setInterval(computeTheme, 60 * 1000); // co minutę
    return () => clearInterval(id);
  }, [sunTimes]);

  return theme;
}

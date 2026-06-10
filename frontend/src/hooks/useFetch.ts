import { useState, useEffect } from 'react';

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const SERVER_ERROR_MSG = 'Nie można pobrać danych. Serwer tymczasowo niedostępny. Spróbuj za kilka minut.';

export function useFetch<T = unknown>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) {
          if (r.status >= 500 && r.status < 600) {
            console.warn(`[useFetch] ${url} — serwer zwrócił ${r.status} (${r.statusText})`);
            throw new Error(SERVER_ERROR_MSG);
          }
          throw new Error(`HTTP ${r.status}`);
        }
        return r.json() as Promise<T>;
      })
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          if (e.name === 'AbortError') {
            console.warn(`[useFetch] ${url} — timeout (10s)`);
            setError('Timeout — serwer nie odpowiada');
          } else if (e.message !== SERVER_ERROR_MSG) {
            console.warn(`[useFetch] ${url} — ${e.message}`);
            setError(e.message);
          } else {
            setError(e.message);
          }
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}

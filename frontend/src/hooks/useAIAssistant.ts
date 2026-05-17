import { useState, useRef, useCallback } from 'react';
import type { AIAssistantRequest, AIAssistantResponse } from '../types/api';

const CACHE_TTL = 5 * 60 * 1000; // 5 minut
const TIMEOUT_MS = 10000;

interface CacheEntry {
  response: AIAssistantResponse;
  timestamp: number;
}

interface SendQueryOptions {
  currentPage?: string;
  selectedStationId?: string;
  userCoordinates?: { lat: number; lng: number };
}

interface UseAIAssistantResult {
  sendQuery: (query: string, options?: SendQueryOptions) => Promise<AIAssistantResponse | null>;
  response: AIAssistantResponse | null;
  loading: boolean;
  error: string | null;
  abort: () => void;
}

export function useAIAssistant(): UseAIAssistantResult {
  const [response, setResponse] = useState<AIAssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const controllerRef = useRef<AbortController | null>(null);

  const getCacheKey = (query: string, options?: SendQueryOptions): string => {
    return JSON.stringify({ query, options });
  };

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setLoading(false);
  }, []);

  const sendQuery = useCallback(async (
    query: string,
    options?: SendQueryOptions,
  ): Promise<AIAssistantResponse | null> => {
    // Walidacja długości
    if (query.length > 500) {
      const errMsg = 'Zapytanie zbyt długie (maksymalnie 500 znaków).';
      setError(errMsg);
      return null;
    }

    // Sprawdź cache
    const cacheKey = getCacheKey(query, options);
    const cached = cacheRef.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setResponse(cached.response);
      setError(null);
      return cached.response;
    }

    // Anuluj poprzednie zapytanie
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    setResponse(null);

    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const body: AIAssistantRequest = { query };
      if (options?.currentPage) body.currentPage = options.currentPage;
      if (options?.selectedStationId) body.selectedStationId = options.selectedStationId;
      if (options?.userCoordinates) body.userCoordinates = options.userCoordinates;

      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errMsg = (errorData as { error?: string }).error || `HTTP ${res.status}`;
        throw new Error(errMsg);
      }

      const data = (await res.json()) as AIAssistantResponse;

      // Zapisz w cache
      cacheRef.current.set(cacheKey, { response: data, timestamp: Date.now() });

      setResponse(data);
      setLoading(false);
      return data;
    } catch (e: unknown) {
      clearTimeout(timeoutId);
      const err = e as Error;
      if (err.name === 'AbortError') {
        setError('Timeout — serwer nie odpowiada. Spróbuj ponownie.');
      } else {
        setError(err.message || 'Wystąpił błąd podczas komunikacji z asystentem.');
      }
      setLoading(false);
      return null;
    }
  }, []);

  return { sendQuery, response, loading, error, abort };
}

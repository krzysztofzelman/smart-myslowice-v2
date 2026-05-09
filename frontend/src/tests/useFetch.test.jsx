import { renderHook, act } from '@testing-library/react';
import { useFetch } from '../hooks/useFetch';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useFetch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should start with loading state', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    const { result } = renderHook(() => useFetch('/api/test'));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should set data on successful fetch', async () => {
    const mockData = { id: 1, name: 'test' };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    const { result } = renderHook(() => useFetch('/api/test'));

    await act(() => Promise.resolve());
    await act(() => Promise.resolve());

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should set error on failed fetch', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      }),
    );

    const { result } = renderHook(() => useFetch('/api/test'));

    await act(() => Promise.resolve());
    await act(() => Promise.resolve());

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('HTTP 404');
  });

  it('should set error on network failure', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    const { result } = renderHook(() => useFetch('/api/test'));

    await act(() => Promise.resolve());
    await act(() => Promise.resolve());

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('should abort request on timeout', async () => {
    // Mock fetch to reject when the signal is aborted
    global.fetch = vi.fn((_url, { signal } = {}) => {
      return new Promise((resolve, reject) => {
        if (signal) {
          signal.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        }
      });
    });

    const { result } = renderHook(() => useFetch('/api/test'));

    // Advance timers to trigger timeout abort
    act(() => { vi.advanceTimersByTime(10000); });
    // Flush microtasks so the rejected promise is processed
    await act(() => Promise.resolve());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Timeout — serwer nie odpowiada');
  });

  it('should cleanup on unmount', () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
    global.fetch = vi.fn(() => new Promise(() => {}));

    const { unmount } = renderHook(() => useFetch('/api/test'));
    unmount();

    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });
});

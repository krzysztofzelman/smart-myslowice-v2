import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Store original env
const OLD_ENV = { ...process.env };

// We'll dynamically import the handler to mock fetch before it loads
let handler;

beforeEach(async () => {
  vi.resetModules();
  vi.restoreAllMocks();

  process.env = { ...OLD_ENV };
  delete process.env.AI_API_KEY;
  delete process.env.AI_MODEL;
  delete process.env.AI_API_URL;

  // Mock global.fetch for internal API calls
  global.fetch = vi.fn();
});

afterEach(() => {
  process.env = OLD_ENV;
});

function mockReq(body, headers = {}) {
  return {
    method: 'POST',
    body,
    headers: {
      'x-forwarded-for': '127.0.0.1',
      'content-type': 'application/json',
      ...headers,
    },
    socket: { remoteAddress: '127.0.0.1' },
  };
}

function mockRes() {
  const state = { statusCode: 200, body: null };
  const res = {
    status: (code) => {
      state.statusCode = code;
      return res;
    },
    json: (data) => {
      state.body = data;
      return res;
    },
    _getState: () => state,
  };
  return res;
}

describe('api/ai-assistant (rules-based engine)', () => {
  it('should reject GET requests', async () => {
    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = { method: 'GET' };
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(405);
    expect(state.body.error).toBe('Method not allowed');
  });

  it('should require query field', async () => {
    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = mockReq({});
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(400);
    expect(state.body.error).toContain('query');
  });

  it('should reject queries over 500 characters', async () => {
    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = mockReq({ query: 'a'.repeat(501) });
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(400);
    expect(state.body.error).toContain('500 znaków');
  });

  it('should handle greeting query', async () => {
    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = mockReq({ query: 'Cześć!' });
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(200);
    expect(state.body.answer).toContain('Cześć');
    expect(state.body.suggestedPath).toBe('/');
  });

  it('should handle help query', async () => {
    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = mockReq({ query: 'co potrafisz?' });
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(200);
    expect(state.body.answer).toContain('Oto co potrafię');
    expect(state.body.suggestedPath).toBe('/');
  });

  it('should handle unknown query gracefully', async () => {
    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = mockReq({ query: 'xyzzy nieznane zapytanie' });
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(200);
    expect(state.body.answer).toContain('Nie rozumiem');
    expect(state.body.data.originalQuery).toBe('xyzzy nieznane zapytanie');
  });

  it('should handle air quality query with mock data', async () => {
    // Mock internal fetch to return air data
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: 'Stacja testowa', pm25: 15, pm10: 30, quality: 'good', source: 'gios' },
        ]),
    });

    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = mockReq({ query: 'jaka jest jakość powietrza?' });
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(200);
    expect(state.body.answer).toContain('Jakość powietrza');
    expect(state.body.answer).toContain('PM10');
    expect(state.body.suggestedPath).toBe('/');
  });

  it('should handle weather query with mock data', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          temp: 22,
          feelsLike: 20,
          description: 'słonecznie',
          humidity: 45,
          windKmh: 10,
          sunrise: 1700000000,
          sunset: 1700050000,
        }),
    });

    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = mockReq({ query: 'jaka jest pogoda?' });
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(200);
    expect(state.body.answer).toContain('Pogoda w Mysłowicach');
    expect(state.body.answer).toContain('22°C');
    expect(state.body.suggestedPath).toBe('/weather');
  });

  it('should handle AED query with user coordinates', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: 'Szpital', address: 'ul. Testowa 1', access: '24/7', coordinates: { lat: 50.24, lng: 19.14 } },
          { id: 2, name: 'Urząd', address: 'ul. Główna 2', access: 'Pon-Pt 8-16', coordinates: { lat: 50.25, lng: 19.15 } },
        ]),
    });

    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = mockReq({
      query: 'gdzie jest najbliższy AED?',
      userCoordinates: { lat: 50.24, lng: 19.14 },
    });
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(200);
    expect(state.body.answer).toContain('Najbliższy defibrylator');
    expect(state.body.suggestedPath).toBe('/aed');
  });

  it('should handle AED query without coordinates', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: 'Szpital', address: 'ul. Testowa 1', access: '24/7', coordinates: { lat: 50.24, lng: 19.14 } },
        ]),
    });

    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = mockReq({ query: 'defibrylator' });
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(200);
    expect(state.body.answer).toContain('defibrylatorów AED');
    expect(state.body.data.total).toBe(1);
  });

  it('should handle toilets query', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: 'Toaleta', address: 'Rynek 1', access: '24/7', paid: false },
        ]),
    });

    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = mockReq({ query: 'gdzie są toalety?' });
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(200);
    expect(state.body.answer).toContain('Toalety publiczne');
    expect(state.body.suggestedPath).toBe('/toilets');
  });

  it('should handle eco query', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: 'PSZOK', address: 'ul. Ekologiczna 1', hours: 'Pon-Sob 8-18', phone: '123456789', accepts: 'elektrośmieci, baterie' },
        ]),
    });

    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = mockReq({ query: 'gdzie oddać elektrośmieci?' });
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(200);
    expect(state.body.answer).toContain('Punkty zbiórki');
    expect(state.body.suggestedPath).toBe('/eco');
  });

  it('should handle water query', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: '1', name: 'Przemsza', river: 'Przemsza', level: 120, status: 'safe', warningLevel: 200, alarmLevel: 250, measuredAt: '2025-01-01 12:00' },
        ]),
    });

    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = mockReq({ query: 'czy jest ostrzeżenie hydrologiczne?' });
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(200);
    expect(state.body.answer).toContain('Stan wód');
    expect(state.body.suggestedPath).toBe('/water');
  });

  it('should handle API errors gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    handler = (await import('../../../api/ai-assistant.js')).default;
    const req = mockReq({ query: 'jaka jest jakość powietrza?' });
    const res = mockRes();
    await handler(req, res);
    const state = res._getState();
    expect(state.statusCode).toBe(200);
    expect(state.body.answer).toContain('Nie udało się pobrać');
  });
});

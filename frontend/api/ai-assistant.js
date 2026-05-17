/* ── Asystent AI — Smart Mysłowice ──────────────────────────────────────────
 * Endpoint obsługujący zapytania w języku naturalnym o dane miejskie.
 * Działa w dwóch trybach:
 *   1. Rules-based (domyślny) — dopasowuje wzorce i odpowiada z danych API
 *   2. LLM (opcjonalnie) — jeśli ustawiono AI_API_KEY, używa zewnętrznego modelu
 * ──────────────────────────────────────────────────────────────────────── */

const RATE_LIMIT_WINDOW = 60_000; // 1 minuta
const RATE_LIMIT_MAX = 10;
const ipBuckets = new Map();

/* ── Rate limiting ─────────────────────────────────────────────────────── */
function checkRateLimit(ip) {
  const now = Date.now();
  if (!ipBuckets.has(ip)) {
    ipBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  const bucket = ipBuckets.get(ip);
  if (now > bucket.resetAt) {
    bucket.count = 1;
    bucket.resetAt = now + RATE_LIMIT_WINDOW;
    return { allowed: true };
  }
  bucket.count++;
  if (bucket.count > RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { allowed: true };
}

/* ── Helper: fetch wewnętrznego API ────────────────────────────────────── */
async function fetchInternal(pathname) {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.API_DEV_PORT || 3001}`;
  try {
    const res = await fetch(`${base}${pathname}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/* ── Helper: czytanie danych statycznych (symulacja fetch dla testów) ──── */
async function fetchData(pathname) {
  // W środowisku Node/Vercel używamy fetch do API
  return fetchInternal(pathname);
}

/* ── Przetwarzanie zapytań (rules-based engine) ───────────────────────── */
function findIntent(query) {
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  let intent = 'unknown';

  if (/powietrz|jakosc|pm10|pm2\.?5|smog|smok|indeks|gios|airly|stacj/.test(q))
    intent = 'air';
  else if (/defibrylator|aed|ratunek|serc|resuscyt|pierwsza pomoc/.test(q))
    intent = 'aed';
  else if (/pogod|temperatur|temperatura|ciśnienie|cisnienie|wilgotno|wiatr|opad|słońce|slonce|wschod|zachod|deszcz|śnieg|snieg|burz/.test(q))
    intent = 'weather';
  else if (/toalet|wc|ubikac|siusi/.test(q))
    intent = 'toilets';
  else if (/eko|pszok|smieci|śmieci|odpad|elektry|elektrośmieci|elektrosmieci|bateri|zużyty|zuzyty|segregac|recykling/.test(q))
    intent = 'eco';
  else if (/wod|rzek|poziom|powódź|powodz|powodzi|ostrzeżenie|ostrzezenie|hydrolog|stan wod|alarm przeciwpowodziowy|przemsza|czarna przemsza|biala przemsza|brynica/.test(q))
    intent = 'water';
  else if (/transport|autobus|tramwaj|gtfs|przystanek|bus|zbior komunik|mpk|kzk|gzm/.test(q))
    intent = 'transit';
  else if (/cześć|czesc|hej|dzień dobry|dzien dobry|witaj|siema|halo/.test(q))
    intent = 'greeting';
  else if (/co umiesz|co potrafisz|pomoc|help|funkcj|możesz|mozesz/.test(q))
    intent = 'help';

  console.log(`[ai-assistant] Query: "${query}" → intent: ${intent}`);
  return intent;
}

const GREETING = {
  answer: 'Cześć! Jestem asystentem Smart Mysłowice. Mogę Ci pomóc w sprawach: jakości powietrza, defibrylatorów AED, pogody, toalet publicznych, eko-punktów (PSZOK) oraz stanu wód. Zadaj pytanie!',
  suggestedPath: '/',
  data: { intent: 'greeting' },
};

const HELP = {
  answer: 'Oto co potrafię:\n• 🌫️ Jakość powietrza – "jaka jest jakość powietrza?"\n• 🚑 Defibrylatory AED – "gdzie jest najbliższy AED?"\n• ⛅ Pogoda – "jaka jest pogoda?"\n• 🚻 Toalety – "gdzie są toalety?"\n• ♻️ Eko-punkty – "gdzie oddać elektrośmieci?"\n• 💧 Stan wód – "czy jest ostrzeżenie hydrologiczne?"',
  suggestedPath: '/',
  data: { intent: 'help' },
};

/* ── Generowanie odpowiedzi ────────────────────────────────────────────── */
function formatTime(dateStr) {
  if (!dateStr) return '';
  return dateStr;
}

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts * 1000);
  return d.toLocaleString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

async function handleAirQuery() {
  const data = await fetchData('/api/air');
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return {
      answer: 'Nie udało się pobrać danych o jakości powietrza. Spróbuj ponownie za chwilę.',
      suggestedPath: '/',
      data: null,
    };
  }

  const sensors = Array.isArray(data) ? data : [data];
  const lines = sensors.slice(0, 3).map((s) => {
    const pm10 = s.pm10 != null ? `${s.pm10} µg/m³` : 'brak danych';
    const pm25 = s.pm25 != null ? `${s.pm25} µg/m³` : 'brak danych';
    const quality = s.quality === 'good' ? '✅ dobra' : s.quality === 'moderate' ? '⚠️ umiarkowana' : '❌ zła';
    return `• ${s.name} — ${quality}\n  PM10: ${pm10}, PM2.5: ${pm25}`;
  });

  return {
    answer: `Jakość powietrza w Mysłowicach:\n${lines.join('\n')}\n\nSzczegóły na stronie jakości powietrza.`,
    suggestedPath: '/',
    data: { sensors: sensors.slice(0, 3), _count: sensors.length },
  };
}

async function handleAedQuery(userCoords) {
  const data = await fetchData('/api/aed');
  if (!data || data.length === 0) {
    return {
      answer: 'Nie udało się pobrać lokalizacji defibrylatorów AED.',
      suggestedPath: '/aed',
      data: null,
    };
  }

  let result;
  if (userCoords) {
    const { lat, lng } = userCoords;
    const sorted = [...data].sort((a, b) => {
      const da = Math.hypot(a.coordinates.lat - lat, a.coordinates.lng - lng);
      const db = Math.hypot(b.coordinates.lat - lat, b.coordinates.lng - lng);
      return da - db;
    });
    const nearest = sorted[0];
    result = {
      answer: `Najbliższy defibrylator AED:\n• ${nearest.name}\n• ${nearest.address}\n• Dostęp: ${nearest.access}\n• ${nearest.description || ''}`,
      suggestedPath: '/aed',
      data: { nearest, total: data.length },
    };
  } else {
    const total = data.length;
    const random = data[Math.floor(Math.random() * data.length)];
    result = {
      answer: `W Mysłowicach znajduje się ${total} defibrylatorów AED.\n\nPrzykładowa lokalizacja:\n• ${random.name}\n• ${random.address}\n• Dostęp: ${random.access}`,
      suggestedPath: '/aed',
      data: { sample: random, total },
    };
  }

  return result;
}

async function handleWeatherQuery() {
  const data = await fetchData('/api/weather');
  if (!data) {
    return {
      answer: 'Nie udało się pobrać danych pogodowych.',
      suggestedPath: '/weather',
      data: null,
    };
  }

  const sunrise = formatDate(data.sunrise);
  const sunset = formatDate(data.sunset);

  return {
    answer: `Pogoda w Mysłowicach:\n• Temperatura: ${data.temp}°C (odczuwalna ${data.feelsLike}°C)\n• Opis: ${data.description}\n• Wilgotność: ${data.humidity}%\n• Wiatr: ${data.windKmh} km/h\n• Wschód słońca: ${sunrise}\n• Zachód słońca: ${sunset}`,
    suggestedPath: '/weather',
    data: { temp: data.temp, feelsLike: data.feelsLike, description: data.description, humidity: data.humidity, windKmh: data.windKmh, sunrise: data.sunrise, sunset: data.sunset },
  };
}

async function handleToiletsQuery() {
  const data = await fetchData('/api/toilets');
  if (!data || data.length === 0) {
    return {
      answer: 'Nie udało się pobrać danych o toaletach publicznych.',
      suggestedPath: '/toilets',
      data: null,
    };
  }

  const lines = data.slice(0, 5).map((t) =>
    `• ${t.name} — ${t.address} (${t.paid ? 'płatna' : 'bezpłatna'}, dostęp: ${t.access})`
  );

  return {
    answer: `Toalety publiczne w Mysłowicach:\n${lines.join('\n')}\n\nWięcej na stronie toalet.`,
    suggestedPath: '/toilets',
    data: { count: data.length, toilets: data.slice(0, 5) },
  };
}

async function handleEcoQuery() {
  const data = await fetchData('/api/eco');
  if (!data || data.length === 0) {
    return {
      answer: 'Nie udało się pobrać danych o eko-punktach.',
      suggestedPath: '/eco',
      data: null,
    };
  }

  const lines = data.map((e) =>
    `• ${e.name} — ${e.address}\n  Godziny: ${e.hours}, Tel: ${e.phone}\n  Przyjmuje: ${e.accepts}`
  );

  return {
    answer: `Punkty zbiórki odpadów (PSZOK) w Mysłowicach:\n${lines.join('\n')}\n\nWięcej na stronie eko-punktów.`,
    suggestedPath: '/eco',
    data: { points: data },
  };
}

async function handleWaterQuery() {
  const data = await fetchData('/api/water-level');
  if (!data || data.length === 0) {
    return {
      answer: 'Nie udało się pobrać danych o stanie wód.',
      suggestedPath: '/water',
      data: null,
    };
  }

  const lines = data.slice(0, 3).map((w) => {
    const level = w.level != null ? `${w.level} cm` : 'brak danych';
    const status = w.status === 'safe' ? '✅ bezpieczny' : w.status === 'warning' ? '⚠️ ostrzeżenie' : w.status === 'danger' ? '🔴 alarm' : '❓ nieznany';
    const measured = w.measuredAt ? formatTime(w.measuredAt) : '';
    return `• ${w.name} (${w.river}) — poziom: ${level}, stan: ${status}${measured ? `, pomiar: ${measured}` : ''}`;
  });

  return {
    answer: `Stan wód w regionie:\n${lines.join('\n')}\n\nSzczegóły na stronie stanu wód.`,
    suggestedPath: '/water',
    data: { stations: data.slice(0, 3) },
  };
}

function handleUnknownQuery(query) {
  return {
    answer: `Nie rozumiem pytania: "${query}".\n\nSpróbuj zapytać o:\n• 🌫️ jakość powietrza\n• 🚑 defibrylatory AED\n• ⛅ pogodę\n• 🚻 toalety\n• ♻️ eko-punkty\n• 💧 stan wód`,
    suggestedPath: '/',
    data: { originalQuery: query },
  };
}

/* ── LLM integration (opcjonalne) ──────────────────────────────────────── */
async function llmAnswer(query, context) {
  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.AI_MODEL || 'gpt-3.5-turbo';

  const systemPrompt = `Jesteś asystentem miasta Mysłowice. Odpowiadasz na podstawie danych miejskich: jakość powietrza (PM10, PM2.5), pogoda (temperatura, wilgotność, wiatr), defibrylatory AED, toalety publiczne, PSZOK, stan wód.

ZASADY:
1. Jeśli pytanie dotyczy pogody: podaj aktualną temperaturę, odczuwalną, wilgotność, wiatr.
2. Jeśli pytanie dotyczy powietrza: podaj PM10, PM2.5, indeks jakości.
3. Jeśli pytanie dotyczy AED: podaj najbliższą lokalizację.
4. Jeśli pytanie dotyczy wody: podaj poziom i stan rzeki.
5. NIE mów "nie mam dostępu" — dane są dostępne przez wewnętrzne API.
6. Odpowiadaj krótko i rzeczowo, w języku polskim.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: query },
  ];

  if (context.currentPage) {
    messages.splice(1, 0, { role: 'system', content: `Aktualna strona użytkownika: ${context.currentPage}` });
  }

  const body = { model, messages, temperature: 0.3, max_tokens: 500 };

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) throw new Error(`LLM API returned ${res.status}`);

    const json = await res.json();
    const answer = json.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error('Empty LLM response');

    return { answer, suggestedPath: null, data: { llm: true } };
  } catch (err) {
    console.warn(`[ai-assistant] LLM error: ${err.message}`);
    return null;
  }
}

/* ── Główna funkcja handlera ───────────────────────────────────────────── */
export default async function handler(req, res) {
  // Tylko POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: 'Zbyt wiele zapytań. Spróbuj ponownie za ' + rateCheck.retryAfter + ' sekund.',
    });
  }

  // Ręczne parsowanie body (bez body-parser / express.json())
  // Tylko gdy req.body nie został ustawiony przez middleware
  let body = req.body;
  if (body === undefined) {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString();
    if (rawBody) {
      try { body = JSON.parse(rawBody); } catch { body = {}; }
    } else {
      body = {};
    }
  }

  console.log('[ai-assistant] Received body:', body);
  console.log('[ai-assistant] Query:', body?.query);

  const { query, currentPage, selectedStationId, userCoordinates } = body || {};

  // Walidacja
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Brak wymaganego pola: query' });
  }
  if (query.length > 500) {
    return res.status(400).json({ error: 'Zapytanie zbyt długie (max 500 znaków)' });
  }

  // LLM wyłączony — asystent używa TYLKO rules-based engine z danymi z API
  // Aby włączyć: zmień false na process.env.AI_API_KEY
  if (false && process.env.AI_API_KEY) {
    const llmResult = await llmAnswer(query, { currentPage, selectedStationId, userCoordinates });
    if (llmResult) {
      return res.status(200).json(llmResult);
    }
    // Jeśli LLM zawiódł, fallback do rules-based
  }

  // Rules-based engine
  const intent = findIntent(query);
  let result;

  switch (intent) {
    case 'greeting':
      result = GREETING;
      break;
    case 'help':
      result = HELP;
      break;
    case 'air':
      result = await handleAirQuery();
      break;
    case 'aed':
      result = await handleAedQuery(userCoordinates);
      break;
    case 'weather':
      result = await handleWeatherQuery();
      break;
    case 'toilets':
      result = await handleToiletsQuery();
      break;
    case 'eco':
      result = await handleEcoQuery();
      break;
    case 'water':
      result = await handleWaterQuery();
      break;
    default:
      result = handleUnknownQuery(query);
  }

  res.status(200).json(result);
}

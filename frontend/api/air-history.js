const AIRLY_BASE = 'https://airapi.airly.eu/v2';

/* ── Mock danych historycznych (gdy brak klucza Airly) ── */
const MOCK_HISTORY = () => {
  const points = [];
  for (let i = 23; i >= 0; i--) {
    const d = new Date(Date.now() - i * 3600000);
    points.push({
      time: d.toISOString(),
      pm25: Math.round(15 + Math.random() * 20),
      pm10: Math.round(30 + Math.random() * 30),
    });
  }
  return points;
};

export default async function handler(req, res) {
  const { installationId } = req.query;
  if (!installationId) {
    return res.status(400).json({ error: 'Brak installationId' });
  }

  const key = process.env.AIRLY_API_KEY;
  if (!key) {
    console.warn(`[air-history] Brak AIRLY_API_KEY – zwracam dane mockowe dla ${installationId}`);
    return res.status(200).json(MOCK_HISTORY());
  }

  try {
    const r = await fetch(
      `${AIRLY_BASE}/measurements/installation?installationId=${installationId}`,
      {
        headers: { apikey: key, 'Accept-Language': 'pl' },
        signal: AbortSignal.timeout(10000),
      }
    );
    if (!r.ok) throw new Error(`Airly → ${r.status}`);
    const data = await r.json();

    const history = (data.history ?? []).map((entry) => {
      const get = (name) => {
        const v = (entry.values ?? []).find((x) => x.name === name)?.value;
        return v != null ? Math.round(v) : null;
      };
      return {
        time: entry.tillDateTime ?? entry.fromDateTime ?? null,
        pm25: get('PM25'),
        pm10: get('PM10'),
      };
    });

    res.status(200).json(history);
  } catch (err) {
    console.error(`[air-history] Błąd Airly: ${err.message}`);
    console.warn(`[air-history] Zwracam dane mockowe`);
    res.status(200).json(MOCK_HISTORY());
  }
}

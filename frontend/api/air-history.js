const AIRLY_BASE = 'https://airapi.airly.eu/v2';

export default async function handler(req, res) {
  const { installationId } = req.query;
  if (!installationId) {
    return res.status(400).json({ error: 'Brak installationId' });
  }

  const key = process.env.AIRLY_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'Brak AIRLY_API_KEY' });
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
    res.status(502).json({ error: err.message });
  }
}

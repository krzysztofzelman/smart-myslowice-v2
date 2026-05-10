/* ── Mock danych pogodowych (gdy brak klucza OWM) ── */
const MOCK_WEATHER = () => ({
  temp: 18,
  feelsLike: 16,
  description: 'pochmurnie z przejaśnieniami',
  humidity: 65,
  windKmh: 12,
  icon: '04d',
  sunrise: Math.floor(Date.now() / 1000) - 21600,
  sunset: Math.floor(Date.now() / 1000) + 21600,
});

export default async function handler(req, res) {
  const apiKey = process.env.OWM_API_KEY;
  if (!apiKey) {
    console.warn('[weather] Brak OWM_API_KEY – zwracam dane mockowe');
    return res.status(200).json(MOCK_WEATHER());
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Myslowice&units=metric&lang=pl&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`OWM error ${response.status}`);
    const data = await response.json();
    res.status(200).json({
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windKmh: Math.round(data.wind.speed * 3.6),
      icon: data.weather[0].icon,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    });
  } catch (err) {
    console.error(`[weather] Błąd OWM: ${err.message}`);
    console.warn('[weather] Zwracam dane mockowe');
    res.status(200).json(MOCK_WEATHER());
  }
}

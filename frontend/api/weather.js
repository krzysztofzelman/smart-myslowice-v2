export default async function handler(req, res) {
  try {
    const apiKey = process.env.OWM_API_KEY;
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
    res.status(502).json({ error: err.message });
  }
}

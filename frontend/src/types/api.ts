/* ───────── API response types ───────── */

export interface AirlyStation {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  pm25?: number;
  pm10?: number;
  aqi?: string;
  updated?: string;
}

export interface AirlyHistoryPoint {
  time: string;
  pm25: number | null;
  pm10: number | null;
}

export interface AedLocation {
  id: string;
  nazwa: string;
  adres: string;
  lat: number;
  lng: number;
  dostepnosc: string;
  uwagi?: string;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDir: number;
  icon: string;
  description: string;
  sunrise: number;
  sunset: number;
}

export interface ToiletLocation {
  id: string;
  nazwa: string;
  adres: string;
  lat: number;
  lng: number;
  rodzaj: string;
  uwagi?: string;
}

export interface EcoPoint {
  id: string;
  nazwa: string;
  adres: string;
  lat: number;
  lng: number;
  przyjmowane: string[];
  uwagi?: string;
}

export interface WaterLevel {
  id: string;
  nazwa: string;
  rzeka: string;
  stan: number;
  stanOstrzegawczy: number;
  stanAlarmowy: number;
  trend: 'rising' | 'falling' | 'stable';
  lat: number;
  lng: number;
}

export interface TransitVehicle {
  id: string;
  lat: number;
  lng: number;
  bearing: number;
  routeId: string;
  tripId: string;
  routeName?: string;
}

export interface TransitStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  code?: string;
}

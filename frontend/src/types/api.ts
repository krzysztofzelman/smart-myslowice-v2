/* ───────── Actual API response types (matching Vercel serverless functions) ───────── */

export interface AedLocation {
  id: number;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  access: string;
  description?: string;
}

export interface AirSensor {
  id: string;
  name: string;
  address: string;
  city: string;
  pm25: number | null;
  pm10: number | null;
  quality: string;
  updatedAt: string | null;
  source: 'gios' | 'airly';
}

export interface AirHistoryPoint {
  time: string;
  pm25: number | null;
  pm10: number | null;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windKmh: number;
  icon: string;
  sunrise: number;
  sunset: number;
}

export interface ToiletLocation {
  id: number;
  name: string;
  address: string;
  access: string;
  paid: boolean;
}

export interface EcoPoint {
  id: number;
  name: string;
  address: string;
  type?: string;
  hours: string;
  phone: string;
  accepts: string;
  coordinates?: { lat: number; lng: number };
}

export interface WaterLevel {
  id: string;
  name: string;
  river: string;
  province: string | null;
  level: number | null;
  measuredAt: string | null;
  warningLevel: number | null;
  alarmLevel: number | null;
  status: 'safe' | 'warning' | 'danger' | 'unknown';
  coordinates: [number, number] | null;
  dist: number | null;
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

/* ───────── AI Assistant types ───────── */

export interface AIAssistantRequest {
  query: string;
  currentPage?: string;
  selectedStationId?: string;
  userCoordinates?: { lat: number; lng: number };
}

export interface AIAssistantResponse {
  answer: string;
  suggestedPath?: string;
  data?: Record<string, unknown>;
}

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import type { WaterLevel } from '../types/api';
import { useThemeContext } from '../ThemeContext';
import { getStationCoordinates } from '../data/stationCoordinates';
import { getWaterStatus, WATER_STATUS } from '../utils/waterStatus';
import CityBorder from './CityBorder';
import Badge from './Badge';

/* ─── FlyTo — podąża za wybraną stacją z listy ─── */

function FlyTo({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 12, { duration: 1 });
  }, [coords, map]);
  return null;
}

/* ─── Component ─── */

interface WaterMapProps {
  stations: WaterLevel[];
  flyTo?: [number, number] | null;
  onFlyDone?: () => void;
}

export default function WaterMap({ stations, flyTo, onFlyDone }: WaterMapProps) {
  const { theme } = useThemeContext();

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const mapFilter = theme === 'dusk' ? 'brightness(0.7)' : 'none';
  const borderColor = theme === 'light' ? '#000000' : '#ffffff';

  // Domyślny środek mapy – Mysłowice
  const MAP_CENTER: [number, number] = [50.2406, 19.1378];

  /**
   * Zwraca współrzędne dla stacji:
   * 1. Jeśli API zwróciło realne współrzędne → użyj ich.
   * 2. W przeciwnym razie → fallback z mockowanych danych.
   * 3. Jeśli brak w obu źródłach → pomiń (zwróć null).
   */
  function resolveCoords(station: WaterLevel): [number, number] | null {
    if (station.coordinates) return station.coordinates;
    const fallback = getStationCoordinates(station.name);
    if (fallback) return [fallback.lat, fallback.lng];
    return null;
  }

  const stationsWithCoords = stations.filter(s => resolveCoords(s) !== null);

  return (
    <div style={{ filter: mapFilter, height: '100%', width: '100%' }}>
      <MapContainer
        center={MAP_CENTER}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          key={tileUrl}
          url={tileUrl}
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />
        <CityBorder borderColor={borderColor} />
        {flyTo && <FlyTo coords={flyTo} />}

        {stationsWithCoords.map(station => {
          const coords = resolveCoords(station)!;
          const st = getWaterStatus(station.level, station.warningLevel, station.alarmLevel);
          const c = WATER_STATUS[st]?.color ?? 'rgba(255,255,255,0.25)';

          return (
            <CircleMarker
              key={station.id}
              center={coords}
              radius={10}
              color={c}
              fillColor={c}
              fillOpacity={0.35}
              weight={2}
            >
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <strong style={{ fontSize: '1rem', display: 'block', marginBottom: 4 }}>
                    {station.name}
                    {!station.coordinates && (
                      <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: 6 }}>
                        (przybliżona lokalizacja)
                      </span>
                    )}
                  </strong>
                  <p style={{ marginBottom: 2, fontSize: '0.85rem' }}>🏞️ {station.river}</p>
                  <p style={{ marginBottom: 2, fontSize: '0.85rem' }}>
                    Poziom: {station.level !== null ? `${station.level} cm` : '--'}
                  </p>
                  {station.warningLevel !== null && (
                    <p style={{ marginBottom: 2, fontSize: '0.85rem', color: '#f59e0b' }}>
                      Ostrzegawczy: {station.warningLevel} cm
                    </p>
                  )}
                  {station.alarmLevel !== null && (
                    <p style={{ marginBottom: 2, fontSize: '0.85rem', color: '#ff3b4e' }}>
                      Alarmowy: {station.alarmLevel} cm
                    </p>
                  )}
                  <Badge variant={WATER_STATUS[st].variant}>{WATER_STATUS[st].label}</Badge>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

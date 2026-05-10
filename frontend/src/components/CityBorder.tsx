import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface CityBorderProps {
  borderColor: string;
}

export default function CityBorder({ borderColor }: CityBorderProps) {
  const map = useMap();
  const layerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url =
      'https://nominatim.openstreetmap.org/search?' +
      new URLSearchParams({
        q: 'Mysłowice, Poland',
        polygon_geojson: '1',
        format: 'json',
        limit: '1',
      });
    fetch(url)
      .then((r) => r.json())
      .then((data: Record<string, unknown>[]) => {
        if (cancelled) return;
        const geo = (data?.[0] as Record<string, unknown> | undefined)
          ?.geojson;
        if (!geo) return;
        const layer = L.geoJSON(
          { type: 'Feature', geometry: geo } as GeoJSON.Feature,
          {
            style: { color: borderColor, weight: 2, fillOpacity: 0 },
          }
        ).addTo(map);
        layerRef.current = layer;
      })
      .catch((err: Error) => console.warn('[CityBorder]', err));
    return () => {
      cancelled = true;
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, borderColor]);

  useEffect(() => {
    layerRef.current?.setStyle({ color: borderColor });
  }, [borderColor]);

  return null;
}

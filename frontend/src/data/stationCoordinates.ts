/**
 * Mockowane / przybliżone współrzędne geograficzne dla stacji hydrologicznych
 * w okolicy Mysłowic.
 *
 * Używane jako fallback, gdy API IMGW nie zwraca współrzędnych dla danej stacji.
 * W przyszłości można zastąpić rzeczywistymi danymi z geokodera Nominatim
 * lub precyzyjnymi danymi z IMGW.
 */

export interface StationCoords {
  lat: number;
  lng: number;
}

/**
 * Przybliżone współrzędne stacji hydrologicznych w regionie Mysłowic.
 * Klucz = nazwa stacji znormalizowana (małe litery, bez polskich znaków).
 *
 * Źródło: przybliżona lokalizacja na podstawie opisu stacji i mapy OpenStreetMap.
 * Docelowo pobieraj z geokodera Nominatim z cache'owaniem.
 */
const MOCK_COORDS: Record<string, StationCoords> = {
  // Stacje w Mysłowicach i najbliższej okolicy
  szabelnia:    { lat: 50.235, lng: 19.145 },
  niwka:        { lat: 50.235, lng: 19.145 },
  jeleń:        { lat: 50.235, lng: 19.145 },
  radocha:      { lat: 50.235, lng: 19.145 },

  // Górna Wisła
  czernichow:   { lat: 50.280, lng: 19.230 },
  swiniary:     { lat: 50.309, lng: 19.319 },
  brodla:       { lat: 50.028, lng: 19.575 },
  jawiszowice:  { lat: 49.962, lng: 19.178 },

  // Dopływy – Przemsza, Brynica, Czarna Przemsza
  sosnowiec:    { lat: 50.286, lng: 19.135 },
  katowice:     { lat: 50.258, lng: 19.028 },
  bogucice:     { lat: 50.260, lng: 19.020 },
  chodów:       { lat: 50.310, lng: 19.180 },
  zawiercie:    { lat: 50.488, lng: 19.428 },
  goczalkowice: { lat: 49.945, lng: 18.975 },

  // Śląsk – pozostałe
  tychy:        { lat: 50.130, lng: 18.980 },
  gliwice:      { lat: 50.294, lng: 18.665 },
  rybnik:       { lat: 50.095, lng: 18.547 },
  olza:         { lat: 49.954, lng: 18.339 },
  raciborz:     { lat: 50.092, lng: 18.219 },
  dzierżno:     { lat: 50.327, lng: 18.608 },
  dzierzno:     { lat: 50.327, lng: 18.608 },

  // Inne (częste w danych IMGW)
  raclawki:     { lat: 50.773, lng: 19.004 },
  jelonki:      { lat: 50.383, lng: 19.290 },
  pszczyna:     { lat: 49.980, lng: 18.953 },
};

/**
 * Zwraca przybliżone współrzędne dla stacji na podstawie jej nazwy.
 * Jeśli nie znaleziono dopasowania, zwraca `null`.
 *
 * @param stationName – nazwa stacji z API IMGW (np. "Szabelnia", "Czernichów")
 * @returns współrzędne {lat, lng} lub null
 */
export function getStationCoordinates(stationName: string): StationCoords | null {
  const key = stationName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();

  return MOCK_COORDS[key] ?? null;
}

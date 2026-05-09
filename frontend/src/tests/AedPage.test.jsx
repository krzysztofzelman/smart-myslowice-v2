import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Leaflet
vi.mock('leaflet', () => {
  const mockLayer = {
    addTo: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    setStyle: vi.fn(),
    bindPopup: vi.fn().mockReturnThis(),
  };
  const mockMap = {
    removeLayer: vi.fn(),
    setView: vi.fn(),
    addTo: vi.fn().mockReturnThis(),
    addControl: vi.fn(),
    invalidateSize: vi.fn(),
    on: vi.fn(),
    removeControl: vi.fn(),
    latLngBounds: vi.fn(),
    fitBounds: vi.fn(),
    flyTo: vi.fn(),
  };
  return {
    default: {
      map: vi.fn(() => mockMap),
      geoJSON: vi.fn(() => mockLayer),
      tileLayer: vi.fn(() => mockLayer),
      marker: vi.fn(() => ({ ...mockLayer })),
      icon: vi.fn(() => ({})),
      divIcon: vi.fn(() => ({})),
      control: { zoom: vi.fn(() => ({ position: vi.fn(() => mockLayer) })) },
      DomEvent: { on: vi.fn() },
      Icon: { Default: { prototype: {}, mergeOptions: vi.fn() } },
      Browser: { mobile: false },
    },
    map: vi.fn(() => mockMap),
    geoJSON: vi.fn(() => mockLayer),
    tileLayer: vi.fn(() => mockLayer),
    marker: vi.fn(() => ({ ...mockLayer })),
    icon: vi.fn(() => ({})),
    divIcon: vi.fn(() => ({})),
    control: { zoom: vi.fn(() => ({ position: vi.fn(() => mockLayer) })) },
    DomEvent: { on: vi.fn() },
    Icon: { Default: { prototype: {}, mergeOptions: vi.fn() } },
    Browser: { mobile: false },
  };
});

// Mock react-leaflet
vi.mock('react-leaflet', () => {
  const MockComponent = ({ children }) => <div>{children}</div>;
  return {
    MapContainer: MockComponent,
    TileLayer: () => null,
    Marker: ({ children }) => <div>{children}</div>,
    Popup: ({ children }) => <div>{children}</div>,
    useMap: () => ({
      flyTo: vi.fn(),
      removeLayer: vi.fn(),
      addTo: vi.fn(),
      on: vi.fn(),
      invalidateSize: vi.fn(),
    }),
    useMapEvents: vi.fn(),
  };
});

import AedPage from '../pages/AedPage';

describe('AedPage', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    );
  });

  it('should render the component', async () => {
    render(<AedPage />);
    expect(screen.getByText(/defibrylator/i)).toBeInTheDocument();
  });
});

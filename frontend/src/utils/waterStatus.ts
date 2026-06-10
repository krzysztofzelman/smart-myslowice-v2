/**
 * Współdzielone stałe i funkcje dla statusu stacji hydrologicznych.
 * Używane w WaterPage i WaterMap.
 */

export type WaterRiskStatus = 'safe' | 'warning' | 'danger' | 'unknown';

export const WATER_STATUS: Record<
  string,
  { variant: 'green' | 'amber' | 'red' | 'muted'; color: string }
> = {
  safe: {
    variant: 'green',
    color: '#22d3a5',
  },
  warning: {
    variant: 'amber',
    color: '#f59e0b',
  },
  danger: {
    variant: 'red',
    color: '#ff3b4e',
  },
  unknown: {
    variant: 'muted',
    color: 'rgba(255,255,255,0.25)',
  },
};

export function getWaterStatus(
  level: number | null,
  warning: number | null,
  alarm: number | null,
): WaterRiskStatus {
  if (level === null) return 'unknown';
  if (alarm !== null && level >= alarm) return 'danger';
  if (warning !== null && level >= warning) return 'warning';
  return 'safe';
}

export function getRiskColor(
  level: number | null,
  warning: number | null,
  alarm: number | null,
): string {
  if (level === null) return 'rgba(255,255,255,0.25)';
  if (alarm !== null && level >= alarm) return '#ff3b4e';
  if (warning !== null && level >= warning) return '#f59e0b';
  return '#22d3a5';
}

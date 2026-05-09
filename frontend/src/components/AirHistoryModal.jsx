import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './AirHistoryModal.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function formatHour(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      labels: { boxWidth: 12, padding: 16, font: { size: 12 } },
    },
    tooltip: {
      backgroundColor: 'var(--c-card, #1a1a2e)',
      borderColor: 'var(--c-border, #333)',
      borderWidth: 1,
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} µg/m³`,
      },
    },
  },
  scales: {
    x: {
      ticks: { font: { size: 10 }, color: 'var(--c-muted, #888)' },
      grid: { display: false },
    },
    y: {
      ticks: { font: { size: 11 }, color: 'var(--c-muted, #888)', callback: (v) => `${v} µg` },
      grid: { color: 'rgba(255,255,255,0.06)' },
    },
  },
};

export default function AirHistoryModal({ station, onClose }) {
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);

  const installationId = station.id.replace('airly-', '');

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`/api/air-history?installationId=${installationId}`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const points = data
          .filter((p) => p.pm25 !== null || p.pm10 !== null)
          .map((p) => ({ ...p, label: formatHour(p.time) }));
        setHistory(points);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      });
    return () => ctrl.abort();
  }, [installationId]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const chartData = history && history.length > 0
    ? {
        labels: history.map((p) => p.label),
        datasets: [
          {
            label: 'PM2.5',
            data: history.map((p) => p.pm25),
            borderColor: '#22d3a5',
            backgroundColor: 'rgba(34, 211, 165, 0.08)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
            spanGaps: true,
          },
          {
            label: 'PM10',
            data: history.map((p) => p.pm10),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
            spanGaps: true,
          },
        ],
      }
    : null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{station.name}</h3>
            <p className={styles.sub}>PM2.5 i PM10 — ostatnie 24h</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Zamknij">✕</button>
        </div>

        <div className={styles.chartWrap}>
          {!history && !error && <p className={styles.info}>Ładowanie…</p>}
          {error && <p className={styles.errMsg}>Błąd: {error}</p>}
          {history && history.length === 0 && (
            <p className={styles.info}>Brak danych historycznych</p>
          )}
          {history && history.length > 0 && chartData && (
            <div style={{ width: '100%', height: 260 }}>
              <Line data={chartData} options={CHART_OPTIONS} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import styles from './AirHistoryModal.module.css';

function formatHour(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

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
          {history && history.length > 0 && (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={history} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--c-muted)' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--c-muted)' }}
                  unit=" µg"
                  width={48}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--c-card)',
                    border: '1px solid var(--c-border)',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                  }}
                  formatter={(val, name) => [`${val} µg/m³`, name]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '0.82rem', paddingTop: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="pm25"
                  name="PM2.5"
                  stroke="#22d3a5"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="pm10"
                  name="PM10"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

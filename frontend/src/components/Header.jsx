import styles from './Header.module.css';

export default function Header({ themeLabel }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <div className={styles.badge}>IoT · Live Data</div>
          {themeLabel && <div className={styles.themePill}>{themeLabel}</div>}
        </div>
        <h1 className={styles.title}>Smart Mysłowice</h1>
        <p className={styles.sub}>Platforma Danych Miejskich — Twoje miasto w czasie rzeczywistym</p>
      </div>
      <div className={styles.glow} />
      <div className={styles.grid} />
    </header>
  );
}

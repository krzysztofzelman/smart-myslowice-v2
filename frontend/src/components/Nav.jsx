import styles from './Nav.module.css';

export default function Nav({ tabs, active, onSwitch }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
            onClick={() => onSwitch(tab.id)}
          >
            <span className={styles.icon}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

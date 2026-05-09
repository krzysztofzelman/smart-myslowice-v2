import styles from './Nav.module.css';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface NavProps {
  tabs: Tab[];
  active: string;
  onSwitch: (tab: string) => void;
}

export default function Nav({ tabs, active, onSwitch }: NavProps) {
  return (
    <nav className={styles.nav} role="navigation" aria-label="Główna nawigacja">
      <div className={styles.inner}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
            onClick={() => onSwitch(tab.id)}
            aria-label={tab.label}
            aria-current={active === tab.id ? 'page' : undefined}
          >
            <span className={styles.icon} aria-hidden="true">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

import { NavLink } from 'react-router-dom';
import styles from './Nav.module.css';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface NavProps {
  tabs: Tab[];
}

export default function Nav({ tabs }: NavProps) {
  return (
    <nav className={styles.nav} role="navigation" aria-label="Główna nawigacja">
      <div className={styles.inner}>
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.id === 'air' ? '/' : `/${tab.id}`}
            end={tab.id === 'air'}
            className={({ isActive }) =>
              `${styles.tab} ${isActive ? styles.active : ''}`
            }
            aria-label={tab.label}
          >
            <span className={styles.icon} aria-hidden="true">{tab.icon}</span>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

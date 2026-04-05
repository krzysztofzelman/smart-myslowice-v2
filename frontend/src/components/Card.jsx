import styles from './Card.module.css';

export default function Card({ children, accent, className = '' }) {
  return (
    <div
      className={`${styles.card} ${className}`}
      style={accent ? { borderTopColor: accent } : undefined}
    >
      {children}
    </div>
  );
}

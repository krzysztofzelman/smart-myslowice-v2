import styles from './Card.module.css';

export default function Card({ children, accent, className = '', style, onClick }) {
  return (
    <div
      className={`${styles.card} ${className}`}
      style={{ ...(accent ? { borderTopColor: accent } : {}), ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

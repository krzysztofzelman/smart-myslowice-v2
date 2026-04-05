import styles from './Badge.module.css';

const variants = {
  green:  styles.green,
  amber:  styles.amber,
  red:    styles.red,
  blue:   styles.blue,
  muted:  styles.muted,
};

export default function Badge({ children, variant = 'muted' }) {
  return (
    <span className={`${styles.badge} ${variants[variant] ?? styles.muted}`}>
      {children}
    </span>
  );
}

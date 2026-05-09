import type { ReactNode } from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  children: ReactNode;
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'muted';
}

const variants: Record<string, string> = {
  green: styles.green,
  amber: styles.amber,
  red: styles.red,
  blue: styles.blue,
  muted: styles.muted,
};

export default function Badge({ children, variant = 'muted' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${variants[variant] ?? styles.muted}`}>
      {children}
    </span>
  );
}

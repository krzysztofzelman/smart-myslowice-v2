import type { ReactNode, CSSProperties } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  title?: string;
  accent?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function Card({ children, accent, className = '', style, onClick, title }: CardProps) {
  const isClickable = Boolean(onClick);
  return (
    <div
      className={`${styles.card} ${className}`}
      style={{ ...(accent ? { borderTopColor: accent } : {}), ...style }}
      onClick={onClick}
      title={title}
      role={isClickable ? 'button' : 'article'}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); } : undefined}
      aria-label={title || undefined}
    >
      {children}
    </div>
  );
}

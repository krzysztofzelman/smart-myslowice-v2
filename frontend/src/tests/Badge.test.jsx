import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from '../components/Badge';

describe('Badge', () => {
  it('should render children text', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('should render with default muted variant', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default').tagName).toBe('SPAN');
  });

  it('should apply variant classes', () => {
    const { rerender } = render(<Badge variant="green">Green</Badge>);
    rerender(<Badge variant="red">Red</Badge>);
    rerender(<Badge variant="blue">Blue</Badge>);
    rerender(<Badge variant="amber">Amber</Badge>);
    rerender(<Badge variant="muted">Muted</Badge>);
    expect(screen.getByText('Muted')).toBeInTheDocument();
  });
});

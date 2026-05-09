import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from '../components/Card';

describe('Card', () => {
  it('should render children', () => {
    render(<Card><p>Card content</p></Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render with accent color', () => {
    const { container } = render(
      <Card accent="#ff0000">Accent</Card>,
    );
    const div = container.firstChild;
    expect(div.style.borderTopColor).toBe('rgb(255, 0, 0)');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Card className="custom-class">Custom</Card>,
    );
    expect(container.firstChild.className).toContain('custom-class');
  });

  it('should render with title', () => {
    render(<Card title="Card title">Titled</Card>);
    expect(screen.getByTitle('Card title')).toBeInTheDocument();
  });

  it('should apply custom styles', () => {
    const { container } = render(
      <Card style={{ backgroundColor: 'red' }}>Styled</Card>,
    );
    expect(container.firstChild.style.backgroundColor).toBe('red');
  });
});

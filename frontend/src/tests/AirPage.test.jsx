import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AirPage from '../pages/AirPage.jsx';

describe('AirPage', () => {
  it('should render the component title', () => {
    render(<AirPage />);
    // Text includes emoji prefix "🌫️ Jakość Powietrza"
    expect(screen.getByText(/Jakość Powietrza/)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AirPage from '../pages/AirPage';

describe('AirPage', () => {
  it('should render the component title', () => {
    render(
      <MemoryRouter>
        <AirPage />
      </MemoryRouter>
    );
    // Text includes emoji prefix "🌫️ Jakość Powietrza"
    expect(screen.getByText(/Jakość Powietrza/)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageProvider } from '../i18n/LanguageContext';
import ErrorBoundary from '../components/ErrorBoundary';

function BrokenComponent() {
  throw new Error('Test error from BrokenComponent');
}

function SafeComponent() {
  return <p>Everything is fine</p>;
}

// Suppress console.error in the thrown-error test
const origError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});
afterEach(() => {
  console.error = origError;
});

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <LanguageProvider defaultLang="pl">
        <ErrorBoundary>
          <SafeComponent />
        </ErrorBoundary>
      </LanguageProvider>
    );
    expect(screen.getByText('Everything is fine')).toBeInTheDocument();
  });

  it('should catch error and show fallback', () => {
    render(
      <LanguageProvider defaultLang="pl">
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      </LanguageProvider>
    );
    expect(screen.getByText(/Coś poszło nie tak/)).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    render(
      <LanguageProvider defaultLang="pl">
        <ErrorBoundary fallback={<p>Custom error UI</p>}>
          <BrokenComponent />
        </ErrorBoundary>
      </LanguageProvider>
    );
    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
  });
});

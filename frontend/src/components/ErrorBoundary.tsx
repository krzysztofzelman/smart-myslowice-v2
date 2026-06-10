import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { captureException } from '@sentry/react';
import { LanguageContext } from '../i18n/LanguageContext';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    captureException(error, { extra: { componentStack: errorInfo.componentStack } });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <LanguageContext.Consumer>
          {(ctx) => {
            const t = ctx!.t;
            return (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  minHeight: '50vh',
                  color: 'var(--c-text, #e8eaf0)',
                  background: 'var(--c-bg, #0c0e14)',
                }}
              >
                <span style={{ fontSize: '3rem' }}>⚠️</span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>{t.errorBoundary.title}</h2>
                <p style={{ fontSize: '0.9rem', opacity: 0.7, maxWidth: 400 }}>
                  {t.errorBoundary.message}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={this.handleReset}
                    style={{
                      padding: '0.6rem 1.4rem',
                      borderRadius: 10,
                      border: 'none',
                      background: 'var(--c-blue, #3b82f6)',
                      color: '#fff',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    {t.errorBoundary.retry}
                  </button>
                  <button
                    onClick={() => { window.location.href = '/'; }}
                    style={{
                      padding: '0.6rem 1.4rem',
                      borderRadius: 10,
                      border: '1px solid var(--c-border, rgba(255,255,255,0.15))',
                      background: 'transparent',
                      color: 'var(--c-text, #e8eaf0)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    {t.errorBoundary.home}
                  </button>
                </div>
                {import.meta.env.DEV && this.state.error && (
                  <pre
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: 'rgba(255,0,0,0.1)',
                      borderRadius: 8,
                      fontSize: '0.75rem',
                      maxWidth: '100%',
                      overflow: 'auto',
                      textAlign: 'left',
                      color: '#ff3b4e',
                    }}
                  >
                    {this.state.error.message}
                    {'\n'}
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            );
          }}
        </LanguageContext.Consumer>
      );
    }

    return this.props.children;
  }
}

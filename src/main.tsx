import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './lib/auth/AuthContext';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
  }

  private handleResetCache = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.error('Failed to clear storage:', e);
      }
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'Unknown runtime error occurred';
      const errorStack = this.state.error?.stack || '';

      return (
        <div style={{
          minHeight: '100vh',
          background: '#0B0B0B',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            background: '#111111',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
              ACE UiPath Community
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#9CA3AF', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              The community platform encountered an unexpected issue while rendering.
            </p>

            {/* Error Message Box */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F87171', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                Error Details
              </div>
              <div style={{ fontSize: '0.85rem', color: '#FECACA', fontFamily: 'monospace', wordBreak: 'break-word' }}>
                {errorMessage}
              </div>
              {errorStack && (
                <details style={{ marginTop: '0.5rem' }}>
                  <summary style={{ fontSize: '0.75rem', color: '#9CA3AF', cursor: 'pointer' }}>View Stack Trace</summary>
                  <pre style={{
                    fontSize: '0.7rem',
                    color: '#D1D5DB',
                    marginTop: '0.5rem',
                    maxHeight: '160px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '0.5rem',
                    borderRadius: '4px'
                  }}>
                    {errorStack}
                  </pre>
                </details>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/';
                  }
                }}
                style={{
                  background: '#FA4616',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Reload Platform
              </button>

              <button
                onClick={this.handleResetCache}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#D1D5DB',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
                title="Clears corrupted local storage data and restores defaults"
              >
                Reset Local Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RootErrorBoundary>
  </React.StrictMode>,
);

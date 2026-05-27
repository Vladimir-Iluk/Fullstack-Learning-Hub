/**
 * ═══════════════════════════════════════════════════════
 * Component: ErrorBoundary (Class Component)
 * Topic #7: Робота з помилками — React Error Boundary
 * Topic #1: Класовий підхід (class-based error boundary)
 * ═══════════════════════════════════════════════════════
 * Note: Error Boundaries MUST be class components in React.
 * This is also a demonstration of Topic #1.
 */

import React, { Component, ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('🚨 ErrorBoundary caught:', error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '32px',
          margin: '24px',
          background: 'rgba(244, 63, 94, 0.08)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h3 style={{ color: '#f43f5e', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>
            Упс! Щось пішло не так
          </h3>
          <p style={{
            color: '#94a3b8',
            marginBottom: '16px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          }}>
            Виникла помилка при рендерингу цього компонента.
          </p>
          {this.state.error && (
            <pre style={{
              background: 'rgba(15, 15, 35, 0.5)',
              padding: '16px',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '12px',
              fontFamily: "'JetBrains Mono', monospace",
              textAlign: 'left',
              overflow: 'auto',
              maxHeight: '200px',
              marginBottom: '16px',
            }}>
              {this.state.error.message}
              {'\n\n'}
              {this.state.errorInfo?.componentStack}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Спробувати знову
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

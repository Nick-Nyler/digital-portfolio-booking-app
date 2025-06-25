import React from 'react';
import { toast } from 'react-toastify';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    toast.error('An unexpected error occurred. Please try again or contact support.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="detail-container">
          <h2>Something went wrong.</h2>
          <p>Error: {this.state.error?.message || 'Unknown error'}</p>
          <button onClick={() => window.location.reload()} aria-label="Refresh page">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
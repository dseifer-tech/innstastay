"use client";
import { Component, ReactNode } from "react";
import { log } from "@/lib/core/log";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };
  
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    log.ui.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-sm text-gray-500 p-4 text-center">
          Something went wrong loading this content.
        </div>
      );
    }
    
    return this.props.children;
  }
}

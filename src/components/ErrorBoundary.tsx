"use client";

import { Component } from "react";
import type { ReactNode } from "react";

import { ERROR_BOUNDARY_COPY } from "./ErrorBoundary.copy";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Unhandled error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-semibold">
            {ERROR_BOUNDARY_COPY.title}
          </h1>
          <p className="text-muted-foreground">{ERROR_BOUNDARY_COPY.message}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: undefined });
            }}
            className="text-primary underline underline-offset-4"
          >
            {ERROR_BOUNDARY_COPY.retry}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

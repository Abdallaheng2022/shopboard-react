// LoadBoundary.tsx: the wrapper for any part of the page that loads data (slide 32: "say it
// once"). While the part loads, Suspense shows `fallback`. If it fails, the Error Boundary
// shows LoadError with "Try again"; onReset runs first, so the part starts a new request.
// It knows nothing about products or the cart: everything comes in through props.
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LoadError } from "./LoadError";

interface LoadBoundaryProps {
  // What to show while the part loads.
  fallback: ReactNode;
  // Forgets the failed request, so "Try again" loads again.
  onReset: () => void;
  // When one of these changes (like the product id), the boundary starts over.
  resetKeys?: unknown[];
  children: ReactNode;
}

export function LoadBoundary({ fallback, onReset, resetKeys, children }: LoadBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={LoadError}
      onReset={onReset}
      resetKeys={resetKeys}
      onError={console.error}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

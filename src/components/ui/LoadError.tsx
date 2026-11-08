// LoadError.tsx: what an Error Boundary shows when a part of the page fails to load.
// "Try again" resets the boundary, so its part renders and loads again. When the connection
// comes back, it does the same by itself. The user sees a plain message; the boundary's
// onError sends the details to the console.
import { useEffect } from "react";
import type { FallbackProps } from "react-error-boundary";
import { getErrorMessage } from "../../shared/api/errors";
import { StatusMessage } from "./StatusMessage";

export function LoadError({ error, resetErrorBoundary }: FallbackProps) {
  // The browser's "online" event is outside React, so listening to it is an effect.
  // The cleanup removes the listener when this message leaves the page.
  useEffect(() => {
    window.addEventListener("online", resetErrorBoundary);
    return () => window.removeEventListener("online", resetErrorBoundary);
  }, [resetErrorBoundary]);

  return <StatusMessage message={getErrorMessage(error)} onRetry={resetErrorBoundary} />;
}

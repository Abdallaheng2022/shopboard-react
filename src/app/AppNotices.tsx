// AppNotices.tsx: app-wide toasts. Offline/online changes, and any error nothing else caught.
// Draws nothing itself.
import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/Toast/useToast";
import { useOnlineStatus } from "@/shared/hooks/useOnlineStatus";

const UNEXPECTED_MESSAGE = "Something went wrong. Please refresh the page.";

export function AppNotices() {
  const { showToast } = useToast();
  const isOnline = useOnlineStatus();
  const previousOnline = useRef(isOnline);

  // A toast on every connection change, never on the first render.
  useEffect(() => {
    if (previousOnline.current === isOnline) return;
    previousOnline.current = isOnline;
    if (isOnline) {
      showToast("You're back online.");
    } else {
      showToast("You're offline. Some features won't work until you reconnect.", { kind: "error" });
    }
  }, [isOnline, showToast]);

  // The last safety net: errors that escaped every try/catch, including rejected promises.
  useEffect(() => {
    const handleError = (event: ErrorEvent): void => {
      console.error(event.error);
      showToast(UNEXPECTED_MESSAGE, { kind: "error" });
    };
    const handleRejection = (event: PromiseRejectionEvent): void => {
      console.error(event.reason);
      showToast(UNEXPECTED_MESSAGE, { kind: "error" });
    };
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [showToast]);

  return null;
}

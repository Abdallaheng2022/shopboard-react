// useOnReconnect.ts: calls `callback` each time the browser comes back online, while `enabled` is true.
// Only the offline → online change counts, so a failure while online never loops.
import { useEffect, useEffectEvent } from "react";

export function useOnReconnect(callback: () => void, enabled: boolean): void {
  const onReconnect = useEffectEvent(callback);

  useEffect(() => {
    if (!enabled) return;
    const handleOnline = (): void => onReconnect();
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [enabled]);
}

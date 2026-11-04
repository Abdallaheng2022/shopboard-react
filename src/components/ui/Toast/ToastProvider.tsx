// ToastProvider.tsx: holds the toasts on screen and draws them at the bottom of the page.
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ToastContext } from "./toast.context";
import type { ToastApi, ToastKind, ToastLink, ToastOptions } from "./toast.types";
import styles from "./Toast.module.css";

// How long a toast stays, in milliseconds. Errors stay longer so there is time to read them.
const TOAST_DURATION_MS: Record<ToastKind, number> = {
  success: 2500,
  error: 5000,
};

interface Toast {
  readonly id: number;
  readonly message: string;
  readonly kind: ToastKind;
  readonly link?: ToastLink;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<readonly Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  // Clear pending timers when the provider unmounts.
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    const kind = options.kind ?? "success";
    nextId.current += 1;
    const toast: Toast = { id: nextId.current, message, kind, link: options.link };
    setToasts((current) => [...current, toast]);
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setToasts((current) => current.filter((item) => item.id !== toast.id));
    }, TOAST_DURATION_MS[kind]);
    timers.current.add(timer);
  }, []);

  const api = useMemo<ToastApi>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext value={api}>
      {children}
      <ul className={styles.region} role="status" aria-live="polite">
        {toasts.map((toast) => (
          <li key={toast.id} className={`${styles.toast} ${styles[toast.kind]}`}>
            <span>{toast.message}</span>
            {toast.link !== undefined && (
              <Link className={styles.link} to={toast.link.to}>
                {toast.link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </ToastContext>
  );
}

// toast.types.ts: what a toast is.

// Good news or an error. Each kind has its own color and duration.
export type ToastKind = "success" | "error";

// An optional link inside the toast, like "View cart".
export interface ToastLink {
  readonly to: string;
  readonly label: string;
}

export interface ToastOptions {
  readonly kind?: ToastKind;
  readonly link?: ToastLink;
}

export interface ToastApi {
  showToast(message: string, options?: ToastOptions): void;
}

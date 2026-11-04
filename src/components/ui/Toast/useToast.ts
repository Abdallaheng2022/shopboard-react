// useToast.ts: shows a toast from any component under ToastProvider.
import { useContext } from "react";
import { ToastContext } from "./toast.context";
import type { ToastApi } from "./toast.types";

export function useToast(): ToastApi {
  const toast = useContext(ToastContext);
  if (toast === null) throw new Error("useToast must be used inside <ToastProvider>");
  return toast;
}

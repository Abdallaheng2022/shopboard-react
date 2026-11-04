// toast.context.ts: the toast context. Read it with useToast(), never with useContext directly.
import { createContext } from "react";
import type { ToastApi } from "./toast.types";

export const ToastContext = createContext<ToastApi | null>(null);

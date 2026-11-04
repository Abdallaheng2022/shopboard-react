// ProductsProvider.tsx: loads the products once and shares them with every page.
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { getErrorMessage, isAbortError } from "@/shared/api/errors";
import { useOnReconnect } from "@/shared/hooks/useOnReconnect";
import type { LoadState } from "@/shared/loadState";
import { fetchProducts } from "./products.api";
import { ProductsContext, type ProductsContextValue } from "./products.context";
import { findProductById } from "./products.logic";
import type { Product } from "./products.types";

const NO_PRODUCTS: readonly Product[] = [];

interface ProductsProviderProps {
  children: ReactNode;
}

export function ProductsProvider({ children }: ProductsProviderProps) {
  const [state, setState] = useState<LoadState<readonly Product[]>>({ status: "loading" });
  // Changing this number runs the load effect again. That is all a retry does.
  const [attempt, setAttempt] = useState(0);

  // The state starts as "loading", and reload() sets it back to "loading" before a new attempt,
  // so the effect itself only starts the request.
  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        // Cancelled because the effect ran again or the provider unmounted: nothing to show.
        if (isAbortError(error)) return;
        console.error(error);
        setState({ status: "error", message: getErrorMessage(error) });
      });

    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((count) => count + 1);
  }, []);

  // A failed load tries again by itself when the connection returns.
  useOnReconnect(reload, state.status === "error");

  const value = useMemo<ProductsContextValue>(() => {
    const products = state.status === "success" ? state.data : NO_PRODUCTS;
    return {
      state,
      products,
      findById: (id) => findProductById(products, id),
      reload,
    };
  }, [state, reload]);

  return <ProductsContext value={value}>{children}</ProductsContext>;
}

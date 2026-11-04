// ProductsProvider.tsx: loads the products once and shares them with every page.
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { getErrorMessage } from "@/shared/api/errors";
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
    // Set to true when this attempt is replaced or the provider unmounts, so a late answer
    // from an old request never overwrites the state. StrictMode runs this effect twice in dev.
    let ignore = false;

    fetchProducts()
      .then((data) => {
        if (!ignore) setState({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (ignore) return;
        console.error(error);
        setState({ status: "error", message: getErrorMessage(error) });
      });

    return () => {
      ignore = true;
    };
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

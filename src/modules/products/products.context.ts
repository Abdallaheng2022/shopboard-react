// products.context.ts: the products context. Read it with useProducts(), never with useContext.
import { createContext } from "react";
import type { LoadState } from "@/shared/loadState";
import type { Product } from "./products.types";

export interface ProductsContextValue {
  // Where loading the products stands: loading, error or success with the list.
  readonly state: LoadState<readonly Product[]>;
  // Every product once loaded; an empty list before that. Handy when only the data matters.
  readonly products: readonly Product[];
  // One product by id, or undefined if the store doesn't have it (or hasn't loaded yet).
  findById(id: number): Product | undefined;
  // Loads the products again, for the "Try again" button.
  reload(): void;
}

export const ProductsContext = createContext<ProductsContextValue | null>(null);

// useProducts.ts: the products loaded by ProductsProvider.
import { useContext } from "react";
import { ProductsContext, type ProductsContextValue } from "./products.context";

export function useProducts(): ProductsContextValue {
  const value = useContext(ProductsContext);
  if (value === null) throw new Error("useProducts must be used inside <ProductsProvider>");
  return value;
}

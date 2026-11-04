// index.ts: the products feature's public entry. Code outside this folder imports only from here.
export { ProductsProvider } from "./ProductsProvider";
export { useProducts } from "./useProducts";
export { useProductFilters } from "./useProductFilters";
export { ProductFilters } from "./components/ProductFilters";
export { ProductResults } from "./components/ProductResults";
export type { ProductsContextValue } from "./products.context";
export type { Filters, Product, SortOrder } from "./products.types";

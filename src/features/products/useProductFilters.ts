// useProductFilters.ts: the search, category and sort the user picked, and the products that match.
import { useMemo, useState } from "react";
import { ALL_CATEGORIES, applyFilters, getCategories } from "./products.logic";
import type { Filters, Product } from "./products.types";

const DEFAULT_FILTERS: Filters = { query: "", category: ALL_CATEGORIES, sort: "default" };

export interface ProductFiltersResult {
  readonly filters: Filters;
  // Changes only the fields given: updateFilters({ sort: "price-asc" }).
  updateFilters(changes: Partial<Filters>): void;
  readonly categories: readonly string[];
  readonly visibleProducts: readonly Product[];
}

export function useProductFilters(products: readonly Product[]): ProductFiltersResult {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const categories = useMemo(() => getCategories(products), [products]);
  const visibleProducts = useMemo(() => applyFilters(products, filters), [products, filters]);

  return {
    filters,
    updateFilters: (changes) => setFilters((current) => ({ ...current, ...changes })),
    categories,
    visibleProducts,
  };
}

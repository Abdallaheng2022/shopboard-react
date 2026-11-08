// products.state.ts: the first value of the filters, and which screen the loaded products show.
// No React here: ProductsSection keeps the filters in useState. Loading and errors are not here:
// Suspense and the Error Boundary around the section show them.
import { ALL_CATEGORIES } from "./products.logic";
import type { Filters } from "./products.types";

// The filters when the page opens: no search, every category, the API's order.
export const INITIAL_FILTERS: Filters = {
  query: "",
  category: ALL_CATEGORIES,
  sort: "default",
};

// The three screens the loaded products can show.
export type ProductsView = "empty-store" | "no-match" | "list";

// Picks the screen. The order of the checks matters: an empty store is not "no match".
export function getProductsView(totalCount: number, visibleCount: number): ProductsView {
  if (totalCount === 0) return "empty-store";
  if (visibleCount === 0) return "no-match";
  return "list";
}

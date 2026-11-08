// ProductsSection.tsx: the products part of the page. It reads the loaded products and owns
// the filters. While the products load, Suspense shows ProductsSkeleton instead of this part;
// if loading fails, the Error Boundary shows LoadError instead.
import { use, useMemo, useState } from "react";
import { getProducts } from "../products.cache";
import { applyFilters, getCategories } from "../products.logic";
import { getProductsView, INITIAL_FILTERS } from "../products.state";
import type { Filters } from "../products.types";
import { ProductControls } from "./ProductControls";
import { ProductsContent } from "./ProductsContent";

export function ProductsSection() {
  // Suspends until the products arrive. A failed request throws to the Error Boundary.
  const products = use(getProducts());
  // Only this part uses the filters, so the state stays here.
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);

  // Computed from state and the loaded products, never stored.
  // useMemo: the categories depend on the products only. Typing changes `filters`, not
  // `products`, so with thousands of products this loop is skipped on every key.
  const categories = useMemo(() => getCategories(products), [products]);
  // No useMemo here: this component renders only when `filters` changes, and then the filter
  // must run again anyway, so useMemo would never skip (it would only add a comparison).
  const visibleProducts = applyFilters(products, filters);

  return (
    <section id="products" className="page-section" aria-labelledby="products-title">
      <h2 id="products-title" className="page-title">
        Products
      </h2>
      <div className="with-sidebar">
        <ProductControls
          filters={filters}
          categories={categories}
          disabled={products.length === 0}
          onChange={setFilters}
        />
        <div>
          <ProductsContent
            view={getProductsView(products.length, visibleProducts.length)}
            products={visibleProducts}
          />
        </div>
      </div>
    </section>
  );
}

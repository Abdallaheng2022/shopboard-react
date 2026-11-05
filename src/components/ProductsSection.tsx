// ProductsSection.tsx: the products part of the page. It loads the products, shows the loading,
// error, empty and "no match" states, and owns the search, category and sort.
import { useEffect, useState } from "react";
import { removeUnknownItems } from "../modules/cart/cart.state";
import type { Cart } from "../modules/cart/cart.types";
import { fetchProducts } from "../modules/products/products.api";
import { ALL_CATEGORIES, applyFilters, getCategories } from "../modules/products/products.logic";
import type { Filters, Product } from "../modules/products/products.types";
import { getErrorMessage } from "../shared/api/errors";
import { ProductControls } from "./ProductControls";
import { ProductList } from "./ProductList";
import { StatusMessage } from "./StatusMessage";

// Where loading the products stands.
type Status = "loading" | "error" | "loaded";

// One id per placeholder card shown while the products load. Fixed ids, never the index.
const SKELETON_IDS = [
  "skeleton-1",
  "skeleton-2",
  "skeleton-3",
  "skeleton-4",
  "skeleton-5",
  "skeleton-6",
];

interface ProductsSectionProps {
  // The products App keeps, because the cart needs them too.
  products: readonly Product[];
  // Gives App the loaded products. Pass a useState setter, so it never changes.
  onLoaded: (products: readonly Product[]) => void;
  // Gives App the cart after saved lines for unknown products are dropped. A useState setter too.
  onCartChange: (cart: Cart) => void;
  onAdd: (product: Product) => void;
}

export function ProductsSection({ products, onLoaded, onCartChange, onAdd }: ProductsSectionProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  // Changing this number loads the products again. That is all "Try again" does.
  const [attempt, setAttempt] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    query: "",
    category: ALL_CATEGORIES,
    sort: "default",
  });

  // Loads the products when the page opens, and again after every "Try again".
  useEffect(() => {
    // True once this load is replaced or the page closes, so an old answer is ignored.
    // In development, StrictMode runs this effect twice; the first answer is ignored.
    let ignore = false;

    fetchProducts()
      .then((list) => {
        if (ignore) return;
        onLoaded(list);
        // Drop saved cart lines for products the store no longer has.
        onCartChange(removeUnknownItems(list.map((product) => product.id)));
        setStatus("loaded");
      })
      .catch((error: unknown) => {
        if (ignore) return;
        console.error(error);
        setErrorMessage(getErrorMessage(error));
        setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [attempt, onLoaded, onCartChange]);

  // When the connection comes back after a failed load, load the products again.
  useEffect(() => {
    function handleOnline(): void {
      if (status === "error") {
        setStatus("loading");
        setAttempt((count) => count + 1);
      }
    }
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [status]);

  function handleRetry(): void {
    setStatus("loading");
    setAttempt((count) => count + 1);
  }

  // Computed on every render from state and props, never stored.
  const visibleProducts = applyFilters(products, filters);

  return (
    <section id="products" className="page-section" aria-labelledby="products-title">
      <h2 id="products-title" className="page-title">
        Products
      </h2>
      <div className="with-sidebar">
        <ProductControls
          filters={filters}
          categories={getCategories(products)}
          disabled={status !== "loaded" || products.length === 0}
          onChange={setFilters}
        />
        <div>
          {status === "loading" && (
            <>
              <StatusMessage message="Loading products…" />
              {/* Grey placeholder cards, the same size as the real ones. */}
              <div className="product-grid" aria-busy="true">
                {SKELETON_IDS.map((id) => (
                  <div key={id} className="skeleton-card" aria-hidden="true" />
                ))}
              </div>
            </>
          )}
          {status === "error" && <StatusMessage message={errorMessage} onRetry={handleRetry} />}
          {status === "loaded" && products.length === 0 && (
            <StatusMessage message="No products are available right now. Please check back later." />
          )}
          {status === "loaded" && products.length > 0 && visibleProducts.length === 0 && (
            <StatusMessage message="No products match your search. Try another name or category." />
          )}
          {status === "loaded" && visibleProducts.length > 0 && (
            <ProductList products={visibleProducts} onAdd={onAdd} />
          )}
        </div>
      </div>
    </section>
  );
}

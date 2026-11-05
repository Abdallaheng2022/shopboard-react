// App.tsx: the whole shop. App owns every piece of state and passes it down as props.
import { useEffect, useState } from "react";
import { CartPanel } from "./components/CartPanel";
import { Header } from "./components/Header";
import { ProductControls } from "./components/ProductControls";
import { ProductList } from "./components/ProductList";
import { StatusMessage } from "./components/StatusMessage";
import { getItemCount } from "./modules/cart/cart.logic";
import {
  addItem,
  clearCart,
  decreaseItem,
  didLastSaveFail,
  getCart,
  increaseItem,
  removeItem,
  removeUnknownItems,
} from "./modules/cart/cart.state";
import type { Cart, CartAction } from "./modules/cart/cart.types";
import { fetchProducts } from "./modules/products/products.api";
import {
  ALL_CATEGORIES,
  applyFilters,
  findProductById,
  getCategories,
} from "./modules/products/products.logic";
import type { Filters, Product } from "./modules/products/products.types";
import { getErrorMessage } from "./shared/api/errors";

// Where loading the products stands.
type Status = "loading" | "error" | "loaded";

// Which cart.state function runs for each button on a cart row.
const cartActions: Record<CartAction, (productId: number) => Cart> = {
  increase: increaseItem,
  decrease: decreaseItem,
  remove: removeItem,
};

export function App() {
  const [products, setProducts] = useState<readonly Product[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  // Changing this number loads the products again. That is all "Try again" does.
  const [attempt, setAttempt] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    query: "",
    category: ALL_CATEGORIES,
    sort: "default",
  });
  // The cart starts as the one saved in localStorage.
  const [cart, setCart] = useState<Cart>(getCart);
  const [saveFailed, setSaveFailed] = useState(false);

  // Loads the products when the page opens, and again after every "Try again".
  useEffect(() => {
    // True once this load is replaced or the page closes, so an old answer is ignored.
    // In development, StrictMode runs this effect twice; the first answer is ignored.
    let ignore = false;

    fetchProducts()
      .then((list) => {
        if (ignore) return;
        setProducts(list);
        setStatus("loaded");
        // Drop saved cart lines for products the store no longer has.
        setCart(removeUnknownItems(list.map((product) => product.id)));
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
  }, [attempt]);

  // Every cart change goes through here: show the new cart, and remember if saving failed.
  function updateCart(next: Cart): void {
    setCart(next);
    setSaveFailed(didLastSaveFail());
  }

  function handleRetry(): void {
    setStatus("loading");
    setAttempt(attempt + 1);
  }

  function handleAdd(product: Product): void {
    if (!product.inStock) return;
    updateCart(addItem(product.id));
  }

  function handleCartAction(action: CartAction, productId: number): void {
    // A product that is out of stock can't go up.
    const product = findProductById(products, productId);
    if (action === "increase" && (product === undefined || !product.inStock)) return;
    updateCart(cartActions[action](productId));
  }

  // Computed on every render from state, never stored.
  const visibleProducts = applyFilters(products, filters);

  return (
    <>
      <Header itemCount={getItemCount(cart)} />
      <main className="layout">
        <section className="products" aria-labelledby="products-title">
          <h1 id="products-title">Products</h1>
          <ProductControls
            filters={filters}
            categories={getCategories(products)}
            disabled={status !== "loaded" || products.length === 0}
            onChange={setFilters}
          />
          {status === "loading" && <StatusMessage message="Loading products…" />}
          {status === "error" && <StatusMessage message={errorMessage} onRetry={handleRetry} />}
          {status === "loaded" && products.length === 0 && (
            <StatusMessage message="No products are available right now. Please check back later." />
          )}
          {status === "loaded" && products.length > 0 && visibleProducts.length === 0 && (
            <StatusMessage message="No products match your search. Try another name or category." />
          )}
          {status === "loaded" && visibleProducts.length > 0 && (
            <ProductList products={visibleProducts} onAdd={handleAdd} />
          )}
        </section>
        <CartPanel
          cart={cart}
          products={products}
          saveFailed={saveFailed}
          onAction={handleCartAction}
          onClear={() => updateCart(clearCart())}
        />
      </main>
      <footer className="site-footer">
        <p>© 2026 ShopBoard</p>
      </footer>
    </>
  );
}

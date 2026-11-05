// App.tsx: the whole shop. App owns every piece of state and passes it down as props.
import { useEffect, useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { Header } from "./components/Header";
import { ProductControls } from "./components/ProductControls";
import { ProductList } from "./components/ProductList";
import { RegisterForm } from "./components/RegisterForm";
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

// One id per placeholder card shown while the products load. Fixed ids, never the index.
const SKELETON_IDS = [
  "skeleton-1",
  "skeleton-2",
  "skeleton-3",
  "skeleton-4",
  "skeleton-5",
  "skeleton-6",
];

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
  const [showCart, setShowCart] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  // The name of the user who just signed up, for the welcome message. Empty until then.
  const [welcomeName, setWelcomeName] = useState("");

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

  // Every cart change goes through here: show the new cart, and remember if saving failed.
  function updateCart(next: Cart): void {
    setCart(next);
    setSaveFailed(didLastSaveFail());
  }

  function handleRetry(): void {
    setStatus("loading");
    setAttempt((count) => count + 1);
  }

  function handleRegister(name: string): void {
    setWelcomeName(name);
    setShowRegister(false);
  }

  function handleAdd(product: Product): void {
    if (!product.inStock) return;
    updateCart(addItem(product.id));
    // Open the cart so the user sees the product was added.
    setShowCart(true);
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
      <Header
        itemCount={getItemCount(cart)}
        onSignUp={() => setShowRegister(true)}
        onOpenCart={() => setShowCart(true)}
      />
      <main className="site-main">
        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title" className="hero-title">
            Sell smarter.
          </h1>
          <p className="hero-text">Everything your shop needs, in one board.</p>
          <div>
            <a className="btn btn-primary btn-lg" href="#products">
              Shop now
            </a>
          </div>
        </section>

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
                <ProductList products={visibleProducts} onAdd={handleAdd} />
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2026 ShopBoard</p>
      </footer>

      {showCart && (
        <CartDrawer
          cart={cart}
          products={products}
          saveFailed={saveFailed}
          onAction={handleCartAction}
          onClear={() => updateCart(clearCart())}
          onClose={() => setShowCart(false)}
        />
      )}
      {showRegister && (
        <RegisterForm onRegister={handleRegister} onClose={() => setShowRegister(false)} />
      )}
      {welcomeName !== "" && (
        <ul className="toast-region" role="status">
          <li className="toast toast-success">Account created. Welcome, {welcomeName}!</li>
        </ul>
      )}
    </>
  );
}

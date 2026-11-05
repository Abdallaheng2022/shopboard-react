// App.tsx: puts the page together. It holds only what more than one part needs: the products
// (the product list and the cart both use them), the cart (the header count, "Add to cart" and
// the drawer), and whether the cart drawer is open. Each part handles the rest itself.
import { useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProductsSection } from "./components/ProductsSection";
import { getItemCount } from "./modules/cart/cart.logic";
import { addItem, getCart } from "./modules/cart/cart.state";
import type { Cart } from "./modules/cart/cart.types";
import type { Product } from "./modules/products/products.types";

export function App() {
  const [products, setProducts] = useState<readonly Product[]>([]);
  // The cart starts as the one saved in localStorage.
  const [cart, setCart] = useState<Cart>(getCart);
  const [showCart, setShowCart] = useState(false);

  function handleAdd(product: Product): void {
    if (!product.inStock) return;
    setCart(addItem(product.id));
    // Open the cart so the user sees the product was added.
    setShowCart(true);
  }

  return (
    <>
      <Header itemCount={getItemCount(cart)} onOpenCart={() => setShowCart(true)} />
      <main className="site-main">
        <Hero />
        <ProductsSection
          products={products}
          onLoaded={setProducts}
          onCartChange={setCart}
          onAdd={handleAdd}
        />
      </main>
      <Footer />
      {showCart && (
        <CartDrawer
          cart={cart}
          products={products}
          onCartChange={setCart}
          onClose={() => setShowCart(false)}
        />
      )}
    </>
  );
}

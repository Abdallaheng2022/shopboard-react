// CartPage.tsx: "/cart". Every line with its quantity, the total, and "Clear cart".
import type { ReactNode } from "react";
import { Button, ButtonLink } from "@/components/ui/Button/Button";
import { useToast } from "@/components/ui/Toast/useToast";
import { CartList, CartSummary, useCart } from "@/features/cart";
import { useProducts } from "@/features/products";
import styles from "./Page.module.css";

export function CartPage() {
  const cart = useCart();
  const products = useProducts();
  const { showToast } = useToast();

  function handleClear(): void {
    cart.clear();
    showToast("Cart cleared.");
  }

  let content: ReactNode;
  if (cart.cart.length === 0) {
    content = (
      <div className={styles.message} role="status">
        <p>Your cart is empty.</p>
        <ButtonLink to="/products" variant="secondary">
          Browse products
        </ButtonLink>
      </div>
    );
  } else if (products.state.status === "error") {
    // Saved lines need the products to show their names and prices.
    content = (
      <div className={styles.message} role="status">
        <p>{products.state.message}</p>
        <Button variant="secondary" onClick={products.reload}>
          Try again
        </Button>
      </div>
    );
  } else if (products.state.status === "loading") {
    content = (
      <div className={styles.message} role="status">
        <p>Your cart will show here once the products load.</p>
      </div>
    );
  } else {
    content = (
      <>
        <CartList
          lines={cart.lines}
          onIncrease={cart.increase}
          onDecrease={cart.decrease}
          onRemove={cart.remove}
        />
        <CartSummary total={cart.total} canClear onClear={handleClear} />
      </>
    );
  }

  return (
    <section className={styles.section} aria-labelledby="cart-title">
      <h1 id="cart-title" className={styles.title}>
        Your cart
      </h1>
      {content}
    </section>
  );
}

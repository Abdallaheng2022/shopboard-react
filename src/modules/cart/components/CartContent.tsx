// CartContent.tsx: what is in the cart: the empty message, or the lines, the total, "Clear
// cart" and "Checkout". It needs the products for each line's name and price; the
// LoadBoundary in CartPage shows the loading and error states.
import { use, useCallback } from "react";
import { Link } from "react-router";
import { useCart, useCartActions } from "../cart.context";
import { getTotal } from "../cart.logic";
import type { CartAction } from "../cart.types";
import { getProducts } from "../../products/products.cache";
import { findProductById } from "../../products/products.logic";
import type { Product } from "../../products/products.types";
import { formatPrice } from "../../../shared/ui/format";
import { CartRow } from "./CartRow";

export function CartContent() {
  // The same cached request as the product list, so the products never load twice.
  const products = use(getProducts());
  const cart = useCart();
  const { increase, decrease, remove, clear } = useCartActions();

  // useCallback: CartRow is wrapped in memo, so onAction must stay the same function between
  // renders (slide 38). Its deps are the cart's actions, which never change.
  const handleAction = useCallback(
    (action: CartAction, product: Product): void => {
      if (action === "increase") increase(product);
      if (action === "decrease") decrease(product.id);
      if (action === "remove") remove(product.id);
    },
    [increase, decrease, remove],
  );

  if (cart.length === 0) {
    return (
      <div className="page-message" role="status">
        <p>Your cart is empty.</p>
        <Link className="btn btn-secondary" to="/">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="cart-list" aria-label="Cart items">
        {cart.map((item) => {
          const product = findProductById(products, item.productId);
          // A saved line whose product isn't in the store isn't drawn.
          if (product === undefined) return null;
          return (
            <CartRow key={item.productId} item={item} product={product} onAction={handleAction} />
          );
        })}
      </ul>
      <div className="cart-summary">
        <p className="cart-total">Total: {formatPrice(getTotal(cart, products))}</p>
        <button type="button" className="btn btn-secondary" onClick={clear}>
          Clear cart
        </button>
        <Link className="btn btn-primary" to="/checkout">
          Checkout
        </Link>
      </div>
    </>
  );
}

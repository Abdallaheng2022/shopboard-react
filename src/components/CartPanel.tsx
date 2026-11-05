// CartPanel.tsx: the cart section: every row, the total and "Clear cart".
import { getTotal } from "../modules/cart/cart.logic";
import type { Cart, CartAction } from "../modules/cart/cart.types";
import { findProductById } from "../modules/products/products.logic";
import type { Product } from "../modules/products/products.types";
import { formatPrice } from "../shared/ui/format";
import { CartRow } from "./CartRow";

interface CartPanelProps {
  cart: Cart;
  products: readonly Product[];
  // True when the last change couldn't be saved on this device.
  saveFailed: boolean;
  onAction: (action: CartAction, productId: number) => void;
  onClear: () => void;
}

export function CartPanel({ cart, products, saveFailed, onAction, onClear }: CartPanelProps) {
  return (
    <section id="cart" className="page-section" aria-labelledby="cart-title">
      <h2 id="cart-title" className="page-title">
        Your cart
      </h2>
      {saveFailed && (
        <p className="toast toast-error" role="alert">
          Your cart can't be saved on this device. It will reset when you leave.
        </p>
      )}
      {cart.length === 0 && (
        <div className="page-message" role="status">
          <p>Your cart is empty.</p>
          <a className="btn btn-secondary" href="#products">
            Browse products
          </a>
        </div>
      )}
      {cart.length > 0 && products.length === 0 && (
        <div className="page-message" role="status">
          <p>Your cart will show here once the products load.</p>
        </div>
      )}
      {cart.length > 0 && products.length > 0 && (
        <>
          <ul className="cart-list" aria-label="Cart items">
            {cart.map((item) => {
              const product = findProductById(products, item.productId);
              // A saved line whose product isn't in the store isn't drawn.
              if (product === undefined) return null;
              return (
                <CartRow key={item.productId} item={item} product={product} onAction={onAction} />
              );
            })}
          </ul>
          <div className="cart-summary">
            <p className="cart-total">Total: {formatPrice(getTotal(cart, products))}</p>
            <button type="button" className="btn btn-secondary" onClick={onClear}>
              Clear cart
            </button>
          </div>
        </>
      )}
    </section>
  );
}

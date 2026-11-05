// CartPanel.tsx: the cart: every row, the total and "Clear cart".
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
    <aside id="cart" className="cart-panel" aria-labelledby="cart-title">
      <h2 id="cart-title">Your cart</h2>
      {saveFailed && (
        <p className="warning">
          Your cart can't be saved on this device. It will reset when you leave.
        </p>
      )}
      {cart.length === 0 && <p className="hint">Your cart is empty.</p>}
      {cart.length > 0 && products.length === 0 && (
        <p className="hint">Your cart will show here once the products load.</p>
      )}
      <ul className="cart-list">
        {cart.map((item) => {
          const product = findProductById(products, item.productId);
          // A saved line whose product hasn't loaded yet isn't drawn.
          if (product === undefined) return null;
          return <CartRow key={item.productId} item={item} product={product} onAction={onAction} />;
        })}
      </ul>
      <div className="cart-summary">
        <p className="cart-total">Total: {formatPrice(getTotal(cart, products))}</p>
        <button
          type="button"
          className="button-secondary"
          disabled={cart.length === 0}
          onClick={onClear}
        >
          Clear cart
        </button>
      </div>
    </aside>
  );
}

// CartDrawer.tsx: the cart, sliding in from the right side over the page.
// App shows it when the cart icon is clicked or a product is added.
import { getTotal } from "../modules/cart/cart.logic";
import type { Cart, CartAction } from "../modules/cart/cart.types";
import { findProductById } from "../modules/products/products.logic";
import type { Product } from "../modules/products/products.types";
import { formatPrice } from "../shared/ui/format";
import { CartRow } from "./CartRow";

interface CartDrawerProps {
  cart: Cart;
  products: readonly Product[];
  // True when the last change couldn't be saved on this device.
  saveFailed: boolean;
  onAction: (action: CartAction, productId: number) => void;
  onClear: () => void;
  onClose: () => void;
}

export function CartDrawer({
  cart,
  products,
  saveFailed,
  onAction,
  onClear,
  onClose,
}: CartDrawerProps) {
  return (
    // A click on the dark layer itself (not on the drawer) closes the cart.
    <div
      className="drawer-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="cart-drawer-header">
          <h2 id="cart-title" className="cart-drawer-title">
            Your cart
          </h2>
          <button
            type="button"
            className="btn btn-secondary"
            aria-label="Close cart"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {saveFailed && (
          <p className="toast toast-error" role="alert">
            Your cart can't be saved on this device. It will reset when you leave.
          </p>
        )}
        {cart.length === 0 && (
          <div className="page-message" role="status">
            <p>Your cart is empty.</p>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Browse products
            </button>
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
      </aside>
    </div>
  );
}

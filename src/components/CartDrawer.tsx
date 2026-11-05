// CartDrawer.tsx: the cart, sliding in from the right side over the page.
// App shows it when the cart icon is clicked or a product is added. The drawer handles every
// change to the cart itself: +, −, Remove and Clear cart.
import { getTotal } from "../modules/cart/cart.logic";
import {
  clearCart,
  decreaseItem,
  didLastSaveFail,
  increaseItem,
  removeItem,
} from "../modules/cart/cart.state";
import type { Cart, CartAction } from "../modules/cart/cart.types";
import { findProductById } from "../modules/products/products.logic";
import type { Product } from "../modules/products/products.types";
import { formatPrice } from "../shared/ui/format";
import { CartRow } from "./CartRow";

// Which cart.state function runs for each button on a cart row.
const cartActions: Record<CartAction, (productId: number) => Cart> = {
  increase: increaseItem,
  decrease: decreaseItem,
  remove: removeItem,
};

interface CartDrawerProps {
  cart: Cart;
  products: readonly Product[];
  // Gives App the new cart after every change, so the header count updates too.
  onCartChange: (cart: Cart) => void;
  onClose: () => void;
}

export function CartDrawer({ cart, products, onCartChange, onClose }: CartDrawerProps) {
  function handleAction(action: CartAction, productId: number): void {
    // A product that is out of stock can't go up.
    const product = findProductById(products, productId);
    if (action === "increase" && (product === undefined || !product.inStock)) return;
    onCartChange(cartActions[action](productId));
  }

  // cart.state.ts remembers whether the last change could be saved on this device.
  const saveFailed = didLastSaveFail();

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
                  <CartRow
                    key={item.productId}
                    item={item}
                    product={product}
                    onAction={handleAction}
                  />
                );
              })}
            </ul>
            <div className="cart-summary">
              <p className="cart-total">Total: {formatPrice(getTotal(cart, products))}</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onCartChange(clearCart())}
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

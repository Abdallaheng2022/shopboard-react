// cart.reducer.ts: every change to the cart. Pure: no localStorage, no toasts, no DOM.
// Stock is checked by CartProvider before an action reaches the reducer.
import type { Cart, CartAction } from "./cart.types";

// How much one click on + or - changes a quantity.
const QUANTITY_STEP = 1;

// The smallest quantity a line can have. Below this, the line is removed.
export const MIN_QUANTITY = 1;

// Changes one product's quantity by `step`, and drops the line if it falls below the minimum.
function changeQuantity(cart: Cart, productId: number, step: number): Cart {
  return cart
    .map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity + step } : item,
    )
    .filter((item) => item.quantity >= MIN_QUANTITY);
}

export function cartReducer(cart: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "add": {
      // Already in the cart: the quantity goes up instead of adding a second line.
      const isInCart = cart.some((item) => item.productId === action.productId);
      if (isInCart) return changeQuantity(cart, action.productId, QUANTITY_STEP);
      return [...cart, { productId: action.productId, quantity: QUANTITY_STEP }];
    }
    case "increase":
      return changeQuantity(cart, action.productId, QUANTITY_STEP);
    case "decrease":
      return changeQuantity(cart, action.productId, -QUANTITY_STEP);
    case "remove":
      return cart.filter((item) => item.productId !== action.productId);
    case "clear":
      return cart.length === 0 ? cart : [];
    case "removeUnknown": {
      // Drops saved lines for products the store no longer has. Same cart back if nothing changed.
      const next = cart.filter((item) => action.knownIds.includes(item.productId));
      return next.length === cart.length ? cart : next;
    }
  }
}

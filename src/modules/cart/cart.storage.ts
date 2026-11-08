// cart.storage.ts: reads and writes the cart in localStorage. The only file that touches it.
import type { Cart, CartItem } from "./cart.types";

// The localStorage key the cart is saved under.
const CART_STORAGE_KEY = "shopboard-cart";

// Checks that a value read from localStorage really looks like a cart line.
function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "productId" in value &&
    Number.isInteger(value.productId) &&
    "quantity" in value &&
    Number.isInteger(value.quantity) &&
    typeof value.quantity === "number" &&
    value.quantity >= 1
  );
}

// Reads the saved cart. Missing, broken or blocked storage gives an empty cart, not an error.
export function loadCart(): Cart {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved === null) return [];
    const data: unknown = JSON.parse(saved);
    return Array.isArray(data) ? data.filter(isCartItem) : [];
  } catch (error) {
    console.warn("Couldn't read the saved cart", error);
    return [];
  }
}

// Saves the cart. If storage is full or blocked, the cart still works for this visit.
export function saveCart(cart: Cart): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn("Couldn't save the cart", error);
  }
}

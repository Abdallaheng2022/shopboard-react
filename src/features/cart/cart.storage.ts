// cart.storage.ts: the only file that reads and writes localStorage. Every call is in try/catch.
import { MIN_QUANTITY } from "./cart.reducer";
import type { Cart, CartItem } from "./cart.types";

// The localStorage key the cart is saved under. Same key as the vanilla app, so carts carry over.
export const CART_STORAGE_KEY = "shopboard-cart";

// Checks that a value read from localStorage really looks like a cart line.
export function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "productId" in value &&
    typeof value.productId === "number" &&
    Number.isInteger(value.productId) &&
    "quantity" in value &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    value.quantity >= MIN_QUANTITY
  );
}

// Reads the saved cart. Missing, broken or blocked storage gives an empty cart instead of an error.
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

// Saves the cart. Returns false when storage is full or blocked; the cart still works for this visit.
export function saveCart(cart: Cart): boolean {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return true;
  } catch (error) {
    console.warn("Couldn't save the cart", error);
    return false;
  }
}

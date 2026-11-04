// index.ts: the cart feature's public entry. Code outside this folder imports only from here.
export { CartProvider } from "./CartProvider";
export { useCart } from "./useCart";
export { CartBadge } from "./components/CartBadge";
export { CartList } from "./components/CartList";
export { CartSummary } from "./components/CartSummary";
export type { CartContextValue, CartEntry } from "./cart.context";
export type { Cart, CartItem } from "./cart.types";

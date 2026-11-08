// cart.context.ts: the shared cart, in two contexts. CartProvider fills both.
// - CartContext holds the cart lines. It changes on every cart change.
// - CartActionsContext holds the actions. They never change, so a component that only
//   changes the cart (like ProductCard's "Add to cart") doesn't re-render when the cart changes.
import { createContext, useContext } from "react";
import type { Product } from "../products/products.types";
import type { Cart } from "./cart.types";

export interface CartActions {
  // add and increase take the product, because they check that it is in stock.
  add: (product: Product) => void;
  increase: (product: Product) => void;
  decrease: (productId: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
}

// null until a CartProvider is above the component. The hooks turn that into a clear error.
export const CartContext = createContext<Cart | null>(null);
export const CartActionsContext = createContext<CartActions | null>(null);

// The cart lines. The component re-renders on every cart change.
export function useCart(): Cart {
  const cart = useContext(CartContext);
  if (cart === null) throw new Error("useCart() must be used inside <CartProvider>");
  return cart;
}

// The actions only. They keep the same identity, so reading them never causes a re-render.
export function useCartActions(): CartActions {
  const actions = useContext(CartActionsContext);
  if (actions === null) throw new Error("useCartActions() must be used inside <CartProvider>");
  return actions;
}

// cart.context.ts: the cart context. Read it with useCart(), never with useContext directly.
import { createContext } from "react";
import type { Product } from "@/modules/products";
import type { Cart, CartItem } from "./cart.types";

// A cart line with its product, ready to draw.
export interface CartEntry {
  readonly item: CartItem;
  readonly product: Product;
}

export interface CartContextValue {
  readonly cart: Cart;
  // Lines with their product details. Empty until the products load.
  readonly lines: readonly CartEntry[];
  readonly itemCount: number;
  readonly total: number;
  // Each returns false when nothing changed, for example a product that is out of stock.
  add(productId: number): boolean;
  increase(productId: number): boolean;
  decrease(productId: number): void;
  remove(productId: number): void;
  clear(): void;
}

export const CartContext = createContext<CartContextValue | null>(null);

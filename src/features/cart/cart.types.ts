// cart.types.ts: what the cart looks like and every way it can change.
import type { Product } from "@/features/products";

// One line in the cart: which product, and how many of it.
export interface CartItem {
  readonly productId: number;
  readonly quantity: number;
}

// The whole cart. readonly: every change makes a NEW cart instead of editing the old one.
export type Cart = readonly CartItem[];

// Everything the reducer can do to the cart.
export type CartAction =
  | { readonly type: "add"; readonly productId: number }
  | { readonly type: "increase"; readonly productId: number }
  | { readonly type: "decrease"; readonly productId: number }
  | { readonly type: "remove"; readonly productId: number }
  | { readonly type: "clear" }
  | { readonly type: "removeUnknown"; readonly knownIds: readonly number[] };

// A cart line with its product, ready to draw.
export interface CartLineData {
  readonly item: CartItem;
  readonly product: Product;
}

// How the cart looks a product up. The provider passes the products feature's findById.
export type FindProduct = (productId: number) => Product | undefined;

// cart.logic.ts: counts, totals and lines. No React and no localStorage: data in, data out.
import type { Cart, CartLineData, FindProduct } from "./cart.types";

// Counts every item, so 2 tote bags + 1 watch = 3.
export function getItemCount(cart: Cart): number {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Adds up price × quantity for every line. Lines for unknown products count as 0.
export function getTotal(cart: Cart, findProduct: FindProduct): number {
  return cart.reduce((total, item) => {
    const product = findProduct(item.productId);
    return product === undefined ? total : total + product.price * item.quantity;
  }, 0);
}

// Pairs every line with its product. Lines whose product isn't known (yet) are left out.
export function getCartLines(cart: Cart, findProduct: FindProduct): readonly CartLineData[] {
  return cart.flatMap((item) => {
    const product = findProduct(item.productId);
    return product === undefined ? [] : [{ item, product }];
  });
}

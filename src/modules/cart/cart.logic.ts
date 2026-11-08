// cart.logic.ts: pure cart functions. Each one takes a cart and returns a NEW cart or a number.
// No React, no DOM and no localStorage here: data in, data out.
import { findProductById } from "../products/products.logic";
import type { Product } from "../products/products.types";
import type { Cart } from "./cart.types";

// How much one click on + or − changes a quantity.
const QUANTITY_STEP = 1;

// The smallest quantity a line can have. Below this, the line is removed.
const MIN_QUANTITY = 1;

// Changes one product's quantity by `step`, and drops the line if it falls below the minimum.
function changeQuantity(cart: Cart, productId: number, step: number): Cart {
  return cart
    .map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity + step } : item,
    )
    .filter((item) => item.quantity >= MIN_QUANTITY);
}

// Adds one of a product. If it's already in the cart, its quantity goes up instead.
export function addItem(cart: Cart, productId: number): Cart {
  const isInCart = cart.some((item) => item.productId === productId);
  if (isInCart) return changeQuantity(cart, productId, QUANTITY_STEP);
  return [...cart, { productId, quantity: QUANTITY_STEP }];
}

// Adds one more of a product that is already in the cart.
export function increaseItem(cart: Cart, productId: number): Cart {
  return changeQuantity(cart, productId, QUANTITY_STEP);
}

// Takes one away. A quantity of 1 removes the line, so it never shows 0.
export function decreaseItem(cart: Cart, productId: number): Cart {
  return changeQuantity(cart, productId, -QUANTITY_STEP);
}

// Removes only this product. Every other line stays.
export function removeItem(cart: Cart, productId: number): Cart {
  return cart.filter((item) => item.productId !== productId);
}

// Counts every item, so 2 tote bags + 1 watch = 3.
export function getItemCount(cart: Cart): number {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Adds up price × quantity for every line. Lines for unknown products count as 0.
export function getTotal(cart: Cart, products: readonly Product[]): number {
  return cart.reduce((total, item) => {
    const product = findProductById(products, item.productId);
    return product === undefined ? total : total + product.price * item.quantity;
  }, 0);
}

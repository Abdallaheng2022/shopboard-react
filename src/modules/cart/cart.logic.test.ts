import { describe, expect, it } from "vitest";
import type { Product } from "@/modules/products";
import { getItemCount, getTotal } from "./cart.logic";
import type { Cart } from "./cart.types";

const products: readonly Product[] = [
  { id: 1, name: "Canvas Tote", category: "Bags", price: 89, inStock: true },
  { id: 3, name: "Desk Lamp", category: "Home", price: 45, inStock: true },
];

const cart: Cart = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
  { productId: 99, quantity: 5 },
];

describe("cart logic", () => {
  it("counts every item", () => {
    expect(getItemCount(cart)).toBe(8);
  });

  it("totals price × quantity, counting unknown products as 0", () => {
    expect(getTotal(cart, products)).toBe(223);
  });

  it("gives 0 items and a 0 total for an empty cart", () => {
    expect(getItemCount([])).toBe(0);
    expect(getTotal([], products)).toBe(0);
  });
});

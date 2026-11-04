import { describe, expect, it } from "vitest";
import type { Product } from "@/features/products";
import { getCartLines, getItemCount, getTotal } from "./cart.logic";
import type { Cart } from "./cart.types";

const tote: Product = { id: 1, name: "Canvas Tote", category: "Bags", price: 89, inStock: true };
const lamp: Product = { id: 3, name: "Desk Lamp", category: "Home", price: 45, inStock: true };
const findProduct = (id: number): Product | undefined => [tote, lamp].find((p) => p.id === id);

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
    expect(getTotal(cart, findProduct)).toBe(223);
  });

  it("pairs lines with their product and leaves unknown ones out", () => {
    expect(getCartLines(cart, findProduct).map((line) => line.product.name)).toEqual([
      "Canvas Tote",
      "Desk Lamp",
    ]);
  });
});

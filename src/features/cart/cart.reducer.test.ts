import { describe, expect, it } from "vitest";
import { cartReducer } from "./cart.reducer";
import type { Cart } from "./cart.types";

const cart: Cart = [
  { productId: 1, quantity: 2 },
  { productId: 3, quantity: 1 },
];

describe("cartReducer", () => {
  it("adds a new product as a line with quantity 1", () => {
    expect(cartReducer([], { type: "add", productId: 5 })).toEqual([{ productId: 5, quantity: 1 }]);
  });

  it("adding a product already in the cart raises its quantity instead of adding a line", () => {
    expect(cartReducer(cart, { type: "add", productId: 1 })).toEqual([
      { productId: 1, quantity: 3 },
      { productId: 3, quantity: 1 },
    ]);
  });

  it("increases and decreases one line only", () => {
    expect(cartReducer(cart, { type: "increase", productId: 3 })[1]).toEqual({
      productId: 3,
      quantity: 2,
    });
    expect(cartReducer(cart, { type: "decrease", productId: 1 })[0]).toEqual({
      productId: 1,
      quantity: 1,
    });
  });

  it("removes the line when the quantity reaches zero", () => {
    expect(cartReducer(cart, { type: "decrease", productId: 3 })).toEqual([
      { productId: 1, quantity: 2 },
    ]);
  });

  it("removes only the chosen product", () => {
    expect(cartReducer(cart, { type: "remove", productId: 1 })).toEqual([
      { productId: 3, quantity: 1 },
    ]);
  });

  it("clears the cart", () => {
    expect(cartReducer(cart, { type: "clear" })).toEqual([]);
  });

  it("drops lines for unknown products, and returns the same cart when nothing changes", () => {
    expect(cartReducer(cart, { type: "removeUnknown", knownIds: [1] })).toEqual([
      { productId: 1, quantity: 2 },
    ]);
    expect(cartReducer(cart, { type: "removeUnknown", knownIds: [1, 3, 9] })).toBe(cart);
  });

  it("never changes the cart it was given", () => {
    const before = JSON.stringify(cart);
    cartReducer(cart, { type: "add", productId: 1 });
    cartReducer(cart, { type: "decrease", productId: 3 });
    expect(JSON.stringify(cart)).toBe(before);
  });
});

import { describe, expect, it, vi } from "vitest";
import { CART_STORAGE_KEY, isCartItem, loadCart, saveCart } from "./cart.storage";

describe("isCartItem", () => {
  it("accepts a whole-number id and a quantity of at least 1", () => {
    expect(isCartItem({ productId: 1, quantity: 2 })).toBe(true);
  });

  it("rejects zero, fractions, wrong types and non-objects", () => {
    expect(isCartItem({ productId: 1, quantity: 0 })).toBe(false);
    expect(isCartItem({ productId: 1, quantity: 1.5 })).toBe(false);
    expect(isCartItem({ productId: "1", quantity: 1 })).toBe(false);
    expect(isCartItem(null)).toBe(false);
  });
});

describe("loadCart", () => {
  it("returns an empty cart when nothing is saved", () => {
    expect(loadCart()).toEqual([]);
  });

  it("reads a saved cart and drops invalid lines", () => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([{ productId: 1, quantity: 2 }, { productId: 2, quantity: -1 }, "junk"]),
    );
    expect(loadCart()).toEqual([{ productId: 1, quantity: 2 }]);
  });

  it("returns an empty cart for broken JSON or a value that isn't a list", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    localStorage.setItem(CART_STORAGE_KEY, "{not json");
    expect(loadCart()).toEqual([]);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ productId: 1 }));
    expect(loadCart()).toEqual([]);
  });

  it("returns an empty cart when storage is blocked", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });
    expect(loadCart()).toEqual([]);
  });
});

describe("saveCart", () => {
  it("saves the cart and returns true", () => {
    expect(saveCart([{ productId: 4, quantity: 1 }])).toBe(true);
    expect(localStorage.getItem(CART_STORAGE_KEY)).toBe('[{"productId":4,"quantity":1}]');
  });

  it("returns false instead of throwing when storage is full", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Full", "QuotaExceededError");
    });
    expect(saveCart([{ productId: 4, quantity: 1 }])).toBe(false);
  });
});

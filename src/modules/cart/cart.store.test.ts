import { describe, expect, it, vi } from "vitest";
import { changeCart, subscribeToCart } from "./cart.store";
import type { Cart } from "./cart.types";

const EMPTY: Cart = [];

describe("cart store", () => {
  it("runs the change, then tells every subscriber", () => {
    const change = vi.fn(() => EMPTY);
    const listener = vi.fn();
    const unsubscribe = subscribeToCart(listener);

    changeCart(change);

    expect(change).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledOnce();
    unsubscribe();
  });

  it("stops telling a subscriber after it unsubscribes", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToCart(listener);
    unsubscribe();

    changeCart(() => EMPTY);

    expect(listener).not.toHaveBeenCalled();
  });
});

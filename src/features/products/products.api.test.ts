import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api/errors";
import { isApiProduct, parseProducts } from "./products.api";

// Returns what `fn` throws, so the error's fields can be checked.
function thrownBy(fn: () => unknown): unknown {
  try {
    fn();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the function to throw");
}

const apiTote = {
  id: 1,
  title: "Canvas Tote",
  category_name: "Bags",
  price_cents: 8900,
  in_stock: true,
};

describe("isApiProduct", () => {
  it("accepts a product with every field of the right type", () => {
    expect(isApiProduct(apiTote)).toBe(true);
  });

  it("rejects missing fields, wrong types and non-objects", () => {
    expect(isApiProduct({ ...apiTote, price_cents: "8900" })).toBe(false);
    expect(isApiProduct({ id: 1, title: "No price" })).toBe(false);
    expect(isApiProduct(null)).toBe(false);
    expect(isApiProduct("product")).toBe(false);
  });
});

describe("parseProducts", () => {
  it("maps the API names to ours and turns cents into dollars", () => {
    expect(parseProducts({ items: [apiTote], total: 1 })).toEqual([
      { id: 1, name: "Canvas Tote", category: "Bags", price: 89, inStock: true },
    ]);
  });

  it("skips invalid products and warns", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(parseProducts({ items: [apiTote, { id: 2 }] })).toHaveLength(1);
    expect(warn).toHaveBeenCalledOnce();
  });

  it("returns an empty list for an empty store", () => {
    expect(parseProducts({ items: [] })).toEqual([]);
  });

  it("throws invalid-response when there is no items list", () => {
    expect(thrownBy(() => parseProducts({ products: [] }))).toBeInstanceOf(ApiError);
    expect(thrownBy(() => parseProducts(null))).toMatchObject({ kind: "invalid-response" });
  });

  it("throws invalid-response when every product is invalid", () => {
    expect(thrownBy(() => parseProducts({ items: [{ id: 1 }, { id: 2 }] }))).toMatchObject({
      kind: "invalid-response",
    });
  });
});

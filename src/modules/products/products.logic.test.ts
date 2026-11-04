import { describe, expect, it } from "vitest";
import {
  applyFilters,
  filterByCategory,
  findProductById,
  getCategories,
  isSortOrder,
  searchByName,
  sortByPrice,
} from "./products.logic";
import type { Product } from "./products.types";

const products: readonly Product[] = [
  { id: 1, name: "Canvas Tote", category: "Bags", price: 89, inStock: true },
  { id: 2, name: "Field Watch", category: "Time", price: 120, inStock: false },
  { id: 3, name: "Desk Lamp", category: "Home", price: 45, inStock: true },
  { id: 4, name: "Weekender Bag", category: "Bags", price: 150, inStock: true },
];

describe("searchByName", () => {
  it("matches part of the name, ignoring case and spaces around the query", () => {
    expect(searchByName(products, "  BAG ").map((p) => p.id)).toEqual([4]);
  });

  it("returns every product for an empty query", () => {
    expect(searchByName(products, "   ")).toBe(products);
  });
});

describe("filterByCategory", () => {
  it("keeps only the chosen category", () => {
    expect(filterByCategory(products, "Bags").map((p) => p.id)).toEqual([1, 4]);
  });

  it("keeps everything for 'all'", () => {
    expect(filterByCategory(products, "all")).toBe(products);
  });
});

describe("sortByPrice", () => {
  it("sorts low to high and high to low without changing the original", () => {
    expect(sortByPrice(products, "price-asc").map((p) => p.price)).toEqual([45, 89, 120, 150]);
    expect(sortByPrice(products, "price-desc").map((p) => p.price)).toEqual([150, 120, 89, 45]);
    expect(products.map((p) => p.id)).toEqual([1, 2, 3, 4]);
  });

  it("keeps the original order for 'default'", () => {
    expect(sortByPrice(products, "default")).toBe(products);
  });
});

describe("applyFilters", () => {
  it("searches, filters and sorts together", () => {
    const result = applyFilters(products, { query: "", category: "Bags", sort: "price-desc" });
    expect(result.map((p) => p.id)).toEqual([4, 1]);
  });
});

describe("getCategories", () => {
  it("lists each category once, in first-seen order", () => {
    expect(getCategories(products)).toEqual(["Bags", "Time", "Home"]);
  });
});

describe("findProductById", () => {
  it("finds a product or returns undefined", () => {
    expect(findProductById(products, 3)?.name).toBe("Desk Lamp");
    expect(findProductById(products, 99)).toBeUndefined();
  });
});

describe("isSortOrder", () => {
  it("accepts only the three sort orders", () => {
    expect(isSortOrder("price-asc")).toBe(true);
    expect(isSortOrder("name")).toBe(false);
  });
});

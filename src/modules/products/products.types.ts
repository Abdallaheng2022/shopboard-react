// products.types.ts: what a product looks like, and what the user can pick to search, filter and sort.

// The categories the shop sells. A union, not a string: a typo like "Bag" is a type error.
export type Category = "Bags" | "Shoes" | "Accessories";

// What the category select can hold: one category, or every category.
export type CategoryFilter = Category | "all";

// One product in the shop.
export interface Product {
  readonly id: number;
  readonly name: string;
  readonly category: Category;
  readonly price: number;
  readonly inStock: boolean;
}

// The three ways the list can be sorted. Must match the <option> values in ProductControls.
export type SortOrder = "default" | "price-asc" | "price-desc";

// Everything the user picked in the controls above the product grid.
export interface Filters {
  query: string;
  category: CategoryFilter;
  sort: SortOrder;
}

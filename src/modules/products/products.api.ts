// products.api.ts: gets the products from the server and turns them into our Product shape.
import { getJson } from "../../shared/api/client";
import { ApiError } from "../../shared/api/errors";
import { isCategory } from "./products.logic";
import type { Category, Product } from "./products.types";

// Where the products live on the API server.
const PRODUCTS_PATH = "/products";

// The API sends prices in cents. 8900 cents = $89.
const CENTS_PER_DOLLAR = 100;

// One product exactly as the API sends it, once checked. The names are different from our
// Product. A product whose category we don't sell fails the check and is skipped.
interface ApiProduct {
  id: number;
  title: string;
  category_name: Category;
  price_cents: number;
  in_stock: boolean;
}

// Checks that one value from the server really is an API product.
function isApiProduct(value: unknown): value is ApiProduct {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "title" in value &&
    typeof value.title === "string" &&
    "category_name" in value &&
    typeof value.category_name === "string" &&
    isCategory(value.category_name) &&
    "price_cents" in value &&
    typeof value.price_cents === "number" &&
    "in_stock" in value &&
    typeof value.in_stock === "boolean"
  );
}

// Turns the API's shape into ours, so the rest of the app never sees the API's names.
function toProduct(apiProduct: ApiProduct): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.title,
    category: apiProduct.category_name,
    price: apiProduct.price_cents / CENTS_PER_DOLLAR,
    inStock: apiProduct.in_stock,
  };
}

// The API wraps the list: { items: [...], total: 12 }. This takes the list out.
function getItems(data: unknown): unknown[] {
  if (typeof data === "object" && data !== null && "items" in data && Array.isArray(data.items)) {
    return data.items;
  }
  throw new ApiError("invalid-response", "Products response has no items list");
}

// Downloads the products. Invalid products are skipped; if every product is invalid, it throws.
export async function fetchProducts(): Promise<readonly Product[]> {
  const items = getItems(await getJson(PRODUCTS_PATH));
  const valid = items.filter(isApiProduct);
  if (items.length > 0 && valid.length === 0) {
    throw new ApiError("invalid-response", "No item in the products response is a valid product");
  }
  if (valid.length < items.length) {
    console.warn(`Skipped ${items.length - valid.length} invalid products from the API`);
  }
  return valid.map(toProduct);
}

// The API answers 404 when it has no product with this id.
const STATUS_NOT_FOUND = 404;

// Downloads one product by its id. Returns null when the API has no such product, so the page
// can say "not found" instead of showing an error.
export async function fetchProduct(id: number): Promise<Product | null> {
  let data: unknown;
  try {
    data = await getJson(`${PRODUCTS_PATH}/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === STATUS_NOT_FOUND) return null;
    throw error;
  }
  if (!isApiProduct(data)) {
    throw new ApiError("invalid-response", `Product ${id} in the response is not valid`);
  }
  return toProduct(data);
}

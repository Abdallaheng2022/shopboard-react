// products.api.ts: gets the products from the server and turns them into our Product shape.
// Endpoints used by this feature (relative to API_BASE_URL in shared/api/client.ts):
//   GET /products → { items: ApiProduct[], total: number }, prices in cents
import { createApiClient } from "@/shared/api/client";
import { ApiError } from "@/shared/api/errors";
import type { Product } from "./products.types";

// The products feature's part of the API. Every request below is under /products.
const productsApi = createApiClient("/products");

// The API sends prices in cents. 8900 cents = $89.
const CENTS_PER_DOLLAR = 100;

// One product exactly as the API sends it. The names are different from our Product.
interface ApiProduct {
  id: number;
  title: string;
  category_name: string;
  price_cents: number;
  in_stock: boolean;
}

// Checks that one value from the server really is an API product.
export function isApiProduct(value: unknown): value is ApiProduct {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "title" in value &&
    typeof value.title === "string" &&
    "category_name" in value &&
    typeof value.category_name === "string" &&
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

// Checks the whole response: { items: [...] }. Invalid products are skipped;
// if every product is invalid, or there is no items list, it throws an invalid-response ApiError.
export function parseProducts(data: unknown): readonly Product[] {
  if (
    typeof data !== "object" ||
    data === null ||
    !("items" in data) ||
    !Array.isArray(data.items)
  ) {
    throw new ApiError("invalid-response", "Products response has no items list");
  }
  const items: unknown[] = data.items;
  const valid = items.filter(isApiProduct);
  if (items.length > 0 && valid.length === 0) {
    throw new ApiError("invalid-response", "No item in the products response is a valid product");
  }
  if (valid.length < items.length) {
    console.warn(`Skipped ${items.length - valid.length} invalid products from the API`);
  }
  return valid.map(toProduct);
}

// Downloads the products. `signal` cancels the request when the caller no longer needs it.
export async function fetchProducts(signal?: AbortSignal): Promise<readonly Product[]> {
  return parseProducts(await productsApi.get("", { signal }));
}

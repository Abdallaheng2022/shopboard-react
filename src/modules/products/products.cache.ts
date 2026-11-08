// products.cache.ts: keeps each request's promise, so every component that asks for the same
// data gets the same request. Components read them with use(), which suspends.
import { fetchProduct, fetchProducts } from "./products.api";
import type { Product } from "./products.types";

// The one request for the product list. null until someone asks, and again after a reset.
let productsPromise: Promise<readonly Product[]> | null = null;

// One request per product id. null means the API has no product with that id.
const productPromises = new Map<number, Promise<Product | null>>();

// Starts the request the first time, then returns the same promise every time after.
// Without this, each render would start a new request and Suspense would wait forever.
export function getProducts(): Promise<readonly Product[]> {
  productsPromise ??= fetchProducts();
  return productsPromise;
}

// Forgets a failed list request, so "Try again" starts a new one.
export function resetProducts(): void {
  productsPromise = null;
}

// The same idea for one product, by its id.
export function getProduct(id: number): Promise<Product | null> {
  let promise = productPromises.get(id);
  if (promise === undefined) {
    promise = fetchProduct(id);
    productPromises.set(id, promise);
  }
  return promise;
}

// Forgets every single-product request, so "Try again" starts a new one.
export function resetProduct(): void {
  productPromises.clear();
}

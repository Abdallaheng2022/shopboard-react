// client.ts: the only file that calls fetch. Every request to the server goes through here.
// It owns the base URL. Each feature asks for a client for its own subpath with createApiClient,
// for example createApiClient("/products"), and never builds a full URL itself.
import { ApiError } from "./errors";

// The root of the ShopBoard API. Every feature subpath is added after this.
export const API_BASE_URL = "https://shopboard-api.vercel.app/api";

// A request that takes longer than this is stopped and reported as a timeout.
const REQUEST_TIMEOUT_MS = 10_000;

// HTTP 204 means "done, no content", so there is no JSON to read.
const STATUS_NO_CONTENT = 204;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryParams = Readonly<Record<string, string | number | boolean>>;

// What every method of the client accepts besides the path and the body.
export interface CallOptions {
  // Added to the URL as ?key=value. Values are encoded for you.
  readonly query?: QueryParams;
  // Cancels the request, for example when the component that asked for it unmounts.
  readonly signal?: AbortSignal;
}

export interface RequestOptions extends CallOptions {
  readonly method?: HttpMethod;
  // Sent as JSON. Leave it out for requests with no body, like GET.
  readonly body?: unknown;
}

// The client one feature gets. Every path is relative to that feature's subpath.
export interface ApiClient {
  get(path?: string, options?: CallOptions): Promise<unknown>;
  post(path: string, body: unknown, options?: CallOptions): Promise<unknown>;
  put(path: string, body: unknown, options?: CallOptions): Promise<unknown>;
  patch(path: string, body: unknown, options?: CallOptions): Promise<unknown>;
  delete(path: string, options?: CallOptions): Promise<unknown>;
}

// Joins URL parts with exactly one "/" between them: ("/products", "/12") → "products/12".
export function joinPath(...parts: readonly string[]): string {
  return parts
    .map((part) => part.replace(/^\/+|\/+$/g, ""))
    .filter((part) => part !== "")
    .join("/");
}

// Builds the full URL: base URL + path + query string.
export function buildUrl(path: string, query?: QueryParams): string {
  const url = new URL(`${API_BASE_URL}/${joinPath(path)}`);
  if (query !== undefined) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

// Sends one request and returns its JSON. Every failure is thrown as an ApiError with its kind,
// except a request cancelled by the caller's signal: that one throws the original AbortError.
// `path` is relative to API_BASE_URL. Features should use createApiClient instead of calling this.
export async function request(path: string, options: RequestOptions = {}): Promise<unknown> {
  const method = options.method ?? "GET";
  const url = buildUrl(path, options.query);
  const label = `${method} ${url}`;

  if (!navigator.onLine) {
    throw new ApiError("offline", `${label} skipped: the browser is offline`);
  }

  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal =
    options.signal === undefined ? timeout : AbortSignal.any([options.signal, timeout]);
  const headers: Record<string, string> = { Accept: "application/json" };
  const init: RequestInit = { method, headers, signal };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(options.body);
  }

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    // The caller cancelled it: not an error to show.
    if (options.signal?.aborted === true) throw error;
    if (timeout.aborted) {
      throw new ApiError("timeout", `${label} timed out`, undefined, error);
    }
    throw new ApiError("network", `${label} could not reach the server`, undefined, error);
  }

  if (!response.ok) {
    throw new ApiError("http", `${label} failed with status ${response.status}`, response.status);
  }

  if (response.status === STATUS_NO_CONTENT) return undefined;

  try {
    const data: unknown = await response.json();
    return data;
  } catch (error) {
    if (options.signal?.aborted === true) throw error;
    throw new ApiError(
      "invalid-response",
      `Response from ${label} is not valid JSON`,
      undefined,
      error,
    );
  }
}

// Gives a feature its own client. `subpath` is the feature's part of the API, like "/products".
// Every call adds its path after it: createApiClient("/products").get("/12") → GET .../api/products/12
export function createApiClient(subpath: string): ApiClient {
  const to = (path = ""): string => joinPath(subpath, path);
  return {
    get: (path, options) => request(to(path), { ...options, method: "GET" }),
    post: (path, body, options) => request(to(path), { ...options, method: "POST", body }),
    put: (path, body, options) => request(to(path), { ...options, method: "PUT", body }),
    patch: (path, body, options) => request(to(path), { ...options, method: "PATCH", body }),
    delete: (path, options) => request(to(path), { ...options, method: "DELETE" }),
  };
}

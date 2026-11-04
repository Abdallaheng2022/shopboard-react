import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL, buildUrl, createApiClient, joinPath, request } from "./client";
import { ApiError } from "./errors";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Waits for `promise` to reject and returns the error, so its fields can be checked.
async function rejectionOf(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error("Expected the promise to reject");
}

describe("URLs", () => {
  it("joins parts with exactly one slash", () => {
    expect(joinPath("/products/", "/12")).toBe("products/12");
    expect(joinPath("/products", "")).toBe("products");
  });

  it("adds the base URL and the query string", () => {
    expect(buildUrl("products", { q: "bag", page: 2 })).toBe(
      `${API_BASE_URL}/products?q=bag&page=2`,
    );
  });
});

describe("request", () => {
  it("returns the JSON of a successful response", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ items: [] }));
    await expect(request("products")).resolves.toEqual({ items: [] });
  });

  it("returns undefined for 204 No Content", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(request("products/1", { method: "DELETE" })).resolves.toBeUndefined();
  });

  it("sends a body as JSON with its content type", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));
    await request("users", { method: "POST", body: { name: "A" } });
    const init = fetchMock.mock.calls[0]?.[1];
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe('{"name":"A"}');
    expect(init?.headers).toMatchObject({ "Content-Type": "application/json" });
  });

  it("throws offline without calling fetch when the browser is offline", async () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    expect(await rejectionOf(request("products"))).toMatchObject({ kind: "offline" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws network when fetch fails", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    expect(await rejectionOf(request("products"))).toMatchObject({ kind: "network" });
  });

  it("throws http with the status for a non-2xx response", async () => {
    fetchMock.mockResolvedValue(new Response("nope", { status: 503 }));
    const error = await rejectionOf(request("products"));
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ kind: "http", status: 503 });
  });

  it("throws invalid-response when the body isn't JSON", async () => {
    fetchMock.mockResolvedValue(new Response("<html>", { status: 200 }));
    expect(await rejectionOf(request("products"))).toMatchObject({ kind: "invalid-response" });
  });

  it("re-throws the AbortError when the caller cancels, instead of an ApiError", async () => {
    // A fetch that never answers and rejects when its signal fires, like the real one.
    fetchMock.mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
        }),
    );
    const controller = new AbortController();
    const pending = request("products", { signal: controller.signal });
    controller.abort();
    const error = await rejectionOf(pending);
    expect(error).not.toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ name: "AbortError" });
  });
});

describe("createApiClient", () => {
  it("puts every call under the feature's subpath", async () => {
    // A body can be read once, so every call gets a new Response.
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({})));
    const api = createApiClient("/products");
    await api.get();
    await api.get("/12", { query: { full: true } });
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      `${API_BASE_URL}/products`,
      `${API_BASE_URL}/products/12?full=true`,
    ]);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getJson } from "./client";
import { ApiError } from "./errors";

const URL = "https://shopboard-api.vercel.app/api/products";
const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

// Waits for `promise` to reject and returns the error, so its fields can be checked.
async function rejectionOf(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error("Expected the promise to reject");
}

describe("getJson", () => {
  it("returns the JSON of a successful response", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ items: [] }), { status: 200 }));
    await expect(getJson(URL)).resolves.toEqual({ items: [] });
  });

  it("throws offline without calling fetch when the browser is offline", async () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    expect(await rejectionOf(getJson(URL))).toMatchObject({ kind: "offline" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws network when fetch fails", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    expect(await rejectionOf(getJson(URL))).toMatchObject({ kind: "network" });
  });

  it("throws timeout when the request is stopped by its timeout", async () => {
    fetchMock.mockRejectedValue(new DOMException("Timed out", "TimeoutError"));
    expect(await rejectionOf(getJson(URL))).toMatchObject({ kind: "timeout" });
  });

  it("throws http with the status for a non-2xx response", async () => {
    fetchMock.mockResolvedValue(new Response("nope", { status: 503 }));
    const error = await rejectionOf(getJson(URL));
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ kind: "http", status: 503 });
  });

  it("throws invalid-response when the body isn't JSON", async () => {
    fetchMock.mockResolvedValue(new Response("<html>", { status: 200 }));
    expect(await rejectionOf(getJson(URL))).toMatchObject({ kind: "invalid-response" });
  });
});

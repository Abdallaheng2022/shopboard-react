// client.ts: the only file that calls fetch. Every request to the server goes through here.
import { API_BASE_URL } from "./config";
import { ApiError } from "./errors";

// A request that takes longer than this is stopped and reported as a timeout.
const REQUEST_TIMEOUT_MS = 10_000;

// Gets a path on the API server (like "/products") and returns its JSON.
// Every failure is thrown as an ApiError with its kind.
export async function getJson(path: string): Promise<unknown> {
  // A path without "/" would glue onto the base URL ("…/apiproducts"), so it is a bug.
  if (!path.startsWith("/")) throw new Error(`API path must start with "/": ${path}`);
  const url = `${API_BASE_URL}${path}`;

  if (!navigator.onLine) {
    throw new ApiError("offline", `Request to ${url} skipped: the browser is offline`);
  }

  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new ApiError("timeout", `Request to ${url} timed out`, undefined, error);
    }
    throw new ApiError("network", `Request to ${url} could not reach the server`, undefined, error);
  }

  if (!response.ok) {
    throw new ApiError(
      "http",
      `Request to ${url} failed with status ${response.status}`,
      response.status,
    );
  }

  try {
    const data: unknown = await response.json();
    return data;
  } catch (error) {
    throw new ApiError(
      "invalid-response",
      `Response from ${url} is not valid JSON`,
      undefined,
      error,
    );
  }
}

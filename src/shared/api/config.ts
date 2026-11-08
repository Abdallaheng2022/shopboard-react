// config.ts: where the API lives. The only file that knows the server address.
const DEFAULT_API_BASE_URL = "https://shopboard-api.vercel.app/api";

// Reads VITE_API_BASE_URL from .env, or uses the default. Never ends with "/".
function readBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  const url = fromEnv !== undefined && fromEnv !== "" ? fromEnv : DEFAULT_API_BASE_URL;
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export const API_BASE_URL = readBaseUrl();

import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// https://vite.dev/config/
// Test settings live in vitest.config.ts, so the dev server never needs vitest.
export default defineConfig({
  plugins: [react()],
  resolve: {
    // "@/features/products" → "src/features/products". Same alias in tsconfig.app.json.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});

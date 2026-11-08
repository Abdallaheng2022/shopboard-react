import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // Tailwind is only for the shadcn/ui components; the rest of the app uses style.css.
  plugins: [react(), tailwindcss()],
  resolve: {
    // "@/…" means "src/…". The shadcn/ui components import each other this way.
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
});

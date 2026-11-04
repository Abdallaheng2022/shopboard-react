import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

// https://vitest.dev/config/ : reuses vite.config.ts (React plugin, "@" alias) and adds the test setup.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
    },
  }),
);

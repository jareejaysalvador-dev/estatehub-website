import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Unit tests for pure modules under src/lib. The "@/" alias mirrors tsconfig.json.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});

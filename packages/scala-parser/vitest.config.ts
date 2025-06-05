import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.{ts,js}"],
    exclude: ["**/node_modules/**", "**/lib/**"],
    isolate: true,
    timeout: 5000,
    testTimeout: 5000,
  },
  esbuild: {
    target: "es2022",
  },
});

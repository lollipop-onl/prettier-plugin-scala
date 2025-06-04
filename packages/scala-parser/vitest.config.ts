import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.{ts,js}"],
    exclude: ["**/node_modules/**", "**/lib/**"],
    isolate: false,
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    timeout: 10000,
    testTimeout: 10000,
  },
  esbuild: {
    target: "node18",
  },
});

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.{ts,js}", "packages/*/test/**/*.test.{ts,js}"],
    exclude: ["**/node_modules/**", "**/lib/**", "**/dist/**"],
    typecheck: {
      enabled: false,
    },
    // Optimize file watching and collection
    isolate: false, // Faster test execution by sharing context
    poolOptions: {
      threads: {
        singleThread: true, // Use single thread for faster startup
      },
    },
    // Reduced timeouts for faster feedback
    timeout: 10000, // 10 seconds per test
    testTimeout: 10000,
    // Faster file watching
    watchExclude: ["**/node_modules/**", "**/lib/**", "**/dist/**"],
  },
  // Optimize esbuild for faster transforms
  esbuild: {
    target: "node18",
  },
});

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // TypeScript support
    globals: true,
    environment: "node",
    // Test file patterns
    include: ["test/**/*.test.{ts,js}", "packages/*/test/**/*.test.{ts,js}"],
    // TypeScript configuration
    typecheck: {
      enabled: false, // We handle TypeScript checking separately
    },
    // Coverage settings (optional)
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["**/node_modules/**", "**/lib/**", "**/test/**"],
    },
    // Timeout settings
    timeout: 30000, // 30 seconds per test
    testTimeout: 30000,
  },
});

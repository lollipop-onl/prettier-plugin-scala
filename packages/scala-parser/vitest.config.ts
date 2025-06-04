import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.{ts,js}"],
    timeout: 30000,
    testTimeout: 30000,
  },
});

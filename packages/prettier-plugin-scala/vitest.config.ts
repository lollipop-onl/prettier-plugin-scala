import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.{ts,js}"],
    exclude: ["**/node_modules/**", "**/lib/**"],
    isolate: true,
    timeout: 30000, // 30秒に延長（複雑なパース処理対応）
    testTimeout: 30000,
  },
  esbuild: {
    target: "es2022",
  },
});

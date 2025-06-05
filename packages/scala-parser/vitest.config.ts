import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.{ts,js}"],
    exclude: ["**/node_modules/**", "**/lib/**"],
    isolate: true,
    timeout: 15000,
    testTimeout: 15000,
    hookTimeout: 10000,
    teardownTimeout: 5000,
    // 安定化設定
    logHeapUsage: false,
    silent: false,
    reporter: ["basic"],
    // 並行実行を制限してメモリ使用量を抑制
    threads: true,
    maxConcurrency: 2,
    minThreads: 1,
    maxThreads: 2,
  },
  esbuild: {
    target: "es2022",
  },
  logLevel: "warn",
});

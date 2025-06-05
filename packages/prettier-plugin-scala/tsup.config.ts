import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "node18",
  treeshake: true,
  splitting: false,
  minify: false,
  external: ["scala-parser", "prettier"],
});

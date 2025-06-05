import path from "path";
import * as prettier from "prettier";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginPath = path.join(
  __dirname,
  "packages",
  "prettier-plugin-scala",
  "dist",
  "index.js",
);

console.log("Plugin path:", pluginPath);

async function testFormat(code) {
  try {
    console.log("Input:", code);

    // Check if plugin is loaded correctly
    const info = await prettier.getFileInfo(pluginPath);
    console.log("Plugin file info:", info);

    const result = await prettier.format(code, {
      parser: "scala",
      plugins: [pluginPath],
      printWidth: 80,
    });
    console.log("Output:", JSON.stringify(result));
    console.log("Output trimmed:", JSON.stringify(result.trim()));
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
  }
}

console.log("=== Testing simple class ===");
await testFormat("class Box");

console.log("\n=== Testing class with type parameter ===");
await testFormat("class Box[T]");

console.log("\n=== Testing val definition ===");
await testFormat("val x = 42");

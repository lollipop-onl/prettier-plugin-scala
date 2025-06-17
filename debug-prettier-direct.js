import prettierPluginScala from "./packages/prettier-plugin-scala/lib/index.js";
import prettier from "prettier";

const code = `class Rectangle(width: Double, height: Double) {
  def this(size: Double) = this(size, size)
}`;

console.log("--- Input Code ---");
console.log(code);

console.log("\n--- Formatting with Prettier ---");
try {
  const formatted = await prettier.format(code, {
    parser: "scala",
    plugins: [prettierPluginScala],
  });
  console.log("Formatted result:");
  console.log("Result:", JSON.stringify(formatted));
  console.log("Length:", formatted.length);

  if (formatted.trim() === "") {
    console.log("ERROR: Formatted result is empty!");
  } else {
    console.log("SUCCESS: Formatted result is not empty");
    console.log("Formatted code:");
    console.log(formatted);
  }
} catch (error) {
  console.error("Format error:", error.message);
  console.error("Stack:", error.stack);
}

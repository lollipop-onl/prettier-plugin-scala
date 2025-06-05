import plugin from "./packages/prettier-plugin-scala/dist/index.js";

console.log("Plugin structure:");
console.log("Languages:", plugin.languages);
console.log("Parsers:", Object.keys(plugin.parsers));
console.log("Printers:", Object.keys(plugin.printers));

// Test parser directly
console.log("\n=== Testing parser directly ===");
try {
  const ast = plugin.parsers.scala.parse("class Box");
  console.log("AST:", JSON.stringify(ast, null, 2));
} catch (error) {
  console.error("Parse error:", error.message);
}

// Test printer directly
console.log("\n=== Testing printer directly ===");
try {
  const ast = plugin.parsers.scala.parse("class Box");
  const mockPath = {
    getValue: () => ast,
  };
  const mockContext = {
    path: mockPath,
    options: { printWidth: 80 },
  };

  const result = plugin.printers["scala-cst"].print(
    mockPath,
    mockContext.options,
    () => {},
  );
  console.log("Print result:", JSON.stringify(result));
} catch (error) {
  console.error("Print error:", error.message);
  console.error("Stack:", error.stack);
}

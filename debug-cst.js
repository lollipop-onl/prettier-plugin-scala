import { parse } from "./packages/scala-parser/dist/index.js";

console.log("=== Parsing class Box ===");
try {
  const result1 = parse("class Box");
  console.log("CST structure:", JSON.stringify(result1.cst, null, 2));
  console.log("CST name:", result1.cst.name);
  console.log("CST children keys:", Object.keys(result1.cst.children || {}));
} catch (e) {
  console.error("Parse error:", e.message);
}

console.log("\n=== Parsing class Box[T] ===");
try {
  const result2 = parse("class Box[T]");
  console.log("CST structure (truncated):", {
    name: result2.cst.name,
    childrenKeys: Object.keys(result2.cst.children || {}),
  });

  if (result2.cst.children) {
    for (const [key, value] of Object.entries(result2.cst.children)) {
      console.log(`Child ${key}:`, value.length, "items");
      if (value.length > 0) {
        console.log(
          `  First ${key}:`,
          value[0].name || value[0].image || "unknown",
        );
      }
    }
  }
} catch (e) {
  console.error("Parse error:", e.message);
}

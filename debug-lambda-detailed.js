import { parse } from "./packages/scala-parser/dist/index.js";

const code = `list.map { x =>
  val doubled = x * 2;
  doubled + 1
}`;

console.log("=== Parsing Scala Code ===");
console.log(code);
console.log("\n=== Parser Result ===");

try {
  const result = parse(code);
  console.log("Parse successful:", result.errors.length === 0);

  if (result.errors.length > 0) {
    console.log("\nErrors:");
    result.errors.forEach((error) => console.log("  -", error));
  }

  console.log("\n=== CST Structure ===");
  function printCST(node, depth = 0) {
    const indent = "  ".repeat(depth);
    if (node.name) {
      console.log(`${indent}${node.name}:`);
      if (node.children) {
        Object.keys(node.children).forEach((childType) => {
          console.log(`${indent}  ${childType}:`);
          node.children[childType].forEach((child, idx) => {
            if (child.name) {
              printCST(child, depth + 2);
            } else if (child.image !== undefined) {
              console.log(`${indent}    [${idx}] "${child.image}"`);
            } else {
              console.log(`${indent}    [${idx}] ${JSON.stringify(child)}`);
            }
          });
        });
      }
    }
  }

  if (result.cst) {
    printCST(result.cst);
  }
} catch (error) {
  console.error("Parse failed:", error);
}

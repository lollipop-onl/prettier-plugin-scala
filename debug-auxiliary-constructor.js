import { parse } from "./packages/scala-parser/dist/index.js";

const code = `class Rectangle(width: Double, height: Double) {
  def this(size: Double) = this(size, size)
}`;

console.log("--- Input Code ---");
console.log(code);
console.log("\n--- Parsing ---");

try {
  const result = parse(code);
  console.log("Parse result:", result);

  if (result.cst) {
    console.log("\n--- CST Structure ---");
    console.log(JSON.stringify(result.cst, null, 2));

    // Look for class body nodes
    function findClassBody(node, path = "") {
      if (!node || typeof node !== "object") return;

      if (node.name === "classBody") {
        console.log(`\n--- Found classBody at ${path} ---`);
        console.log("classBody:", JSON.stringify(node, null, 2));

        // Look for def definitions in class body
        if (node.children && node.children.classMember) {
          console.log("\n--- Class Members ---");
          node.children.classMember.forEach((member, i) => {
            console.log(`Member ${i}:`, JSON.stringify(member, null, 2));
          });
        }
      }

      if (node.children) {
        Object.keys(node.children).forEach((key) => {
          if (Array.isArray(node.children[key])) {
            node.children[key].forEach((child, i) => {
              findClassBody(child, `${path}.${key}[${i}]`);
            });
          }
        });
      }
    }

    findClassBody(result.cst);

    // Specifically check auxiliaryConstructor structure
    function findAuxConstructor(node, path = "") {
      if (!node || typeof node !== "object") return;

      if (node.name === "auxiliaryConstructor") {
        console.log(`\n--- Found auxiliaryConstructor at ${path} ---`);
        console.log(
          "auxiliaryConstructor children:",
          Object.keys(node.children || {}),
        );

        // Check each child
        Object.keys(node.children || {}).forEach((key) => {
          console.log(`Child ${key}:`, node.children[key]);
        });
      }

      if (node.children) {
        Object.keys(node.children).forEach((key) => {
          if (Array.isArray(node.children[key])) {
            node.children[key].forEach((child, i) => {
              findAuxConstructor(child, `${path}.${key}[${i}]`);
            });
          }
        });
      }
    }

    findAuxConstructor(result.cst);
  }

  if (result.errors && result.errors.length > 0) {
    console.log("\n--- Parse Errors ---");
    result.errors.forEach((error) => {
      console.log(error);
    });
  }
} catch (error) {
  console.error("Parse error:", error);
}

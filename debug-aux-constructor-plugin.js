import { format } from "./packages/prettier-plugin-scala/lib/index.js";
import { parse } from "./packages/scala-parser/dist/index.js";

const code = `class Rectangle(width: Double, height: Double) {
  def this(size: Double) = this(size, size)
}`;

console.log("--- Input Code ---");
console.log(code);

console.log("\n--- Parsing CST ---");
const parseResult = parse(code);
console.log("Parse errors:", parseResult.errors.length);

if (parseResult.errors.length > 0) {
  parseResult.errors.forEach((error) => console.log("Error:", error));
}

// Find class member details
function findClassMembers(node, path = "") {
  if (!node || typeof node !== "object") return;

  if (node.name === "classMember") {
    console.log(`\n--- Found classMember at ${path} ---`);
    console.log("classMember children:", Object.keys(node.children || {}));

    if (node.children && node.children.auxiliaryConstructor) {
      console.log("\n--- auxiliaryConstructor details ---");
      const auxCon = node.children.auxiliaryConstructor[0];
      console.log(
        "auxiliaryConstructor children:",
        Object.keys(auxCon.children || {}),
      );

      // Check parameterLists structure
      if (auxCon.children && auxCon.children.parameterLists) {
        console.log("\n--- parameterLists structure ---");
        auxCon.children.parameterLists.forEach((paramList, i) => {
          console.log(
            `parameterLists[${i}]:`,
            Object.keys(paramList.children || {}),
          );
        });
      }
    }
  }

  if (node.children) {
    Object.keys(node.children).forEach((key) => {
      if (Array.isArray(node.children[key])) {
        node.children[key].forEach((child, i) => {
          findClassMembers(child, `${path}.${key}[${i}]`);
        });
      }
    });
  }
}

if (parseResult.cst) {
  findClassMembers(parseResult.cst);
}

console.log("\n--- Formatting ---");
try {
  const formatted = format(code, { parser: "scala" });
  console.log("Formatted result:");
  console.log(JSON.stringify(formatted));
  console.log("Result length:", formatted.length);
  console.log("Result string:", JSON.stringify(formatted));
} catch (error) {
  console.error("Format error:", error);
}

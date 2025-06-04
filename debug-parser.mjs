import { parseScala } from "./packages/scala-parser/lib/index.js";

const input = 'val result = if (x > 0) "positive" else "non-positive"';
console.log("Input:", input);

try {
  const result = parseScala(input);
  console.log("Errors:", result.errors);
  console.log("CST exists:", !!result.cst);

  if (result.errors.length > 0) {
    result.errors.forEach((error) => {
      console.log("Error:", error.message);
      console.log("Location:", error.token);
    });
  }

  // Find val definition
  if (
    result.cst &&
    result.cst.children &&
    result.cst.children.topLevelDefinition
  ) {
    const topDef = result.cst.children.topLevelDefinition[0];
    console.log("Top level definition:", topDef.name);
    if (topDef.children && topDef.children.valDefinition) {
      const valDef = topDef.children.valDefinition[0];
      console.log("Val definition children:", Object.keys(valDef.children));
      console.log("Expression:", valDef.children.expression);
    }
  }
} catch (e) {
  console.error("Parse error:", e);
}

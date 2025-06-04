import { parseScala } from "./packages/scala-parser/lib/index.js";

const input = 'val result = if (x > 0) "positive" else "non-positive"';
const result = parseScala(input);

console.log("Errors:", result.errors);
console.log("CST exists:", !!result.cst);

if (result.errors.length > 0) {
  result.errors.forEach((error) => {
    console.log("Error message:", error.message);
  });
}

// Pretty print CST
if (result.cst) {
  console.log("CST Structure:");
  console.log(JSON.stringify(result.cst, null, 2));
}

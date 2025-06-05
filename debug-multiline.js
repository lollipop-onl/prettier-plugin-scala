import { parse } from "./packages/scala-parser/dist/index.js";

console.log("Testing single line...");
try {
  const result1 = parse('name := "test"');
  console.log("Single line: SUCCESS");
} catch (e) {
  console.log("Single line ERROR:", e.message);
}

console.log("\nTesting two lines...");
try {
  const result2 = parse('name := "test"\nversion := "1.0"');
  console.log("Two lines: SUCCESS");
} catch (e) {
  console.log("Two lines ERROR:", e.message);
}

console.log("\nTesting with semicolons...");
try {
  const result3 = parse('name := "test"; version := "1.0"');
  console.log("With semicolons: SUCCESS");
} catch (e) {
  console.log("With semicolons ERROR:", e.message);
}

console.log("\nTesting blank lines...");
try {
  const result4 = parse('name := "test"\n\nversion := "1.0"');
  console.log("With blank lines: SUCCESS");
} catch (e) {
  console.log("With blank lines ERROR:", e.message);
}

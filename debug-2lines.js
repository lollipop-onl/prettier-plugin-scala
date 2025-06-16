#!/usr/bin/env node
import { parse } from "./packages/scala-parser/dist/index.js";

console.log("Testing 2 assignment lines:");
const code = `name := "my-project"
version := "1.0.0"`;

console.log(`Input: ${JSON.stringify(code)}`);

try {
  const result = parse(code);
  console.log("Parse successful");
} catch (error) {
  console.error("Parse failed:", error.message);
}

console.log("\nTesting 2 lines with empty line:");
const codeWithEmpty = `name := "my-project"

version := "1.0.0"`;

console.log(`Input: ${JSON.stringify(codeWithEmpty)}`);

try {
  const result = parse(codeWithEmpty);
  console.log("Parse successful");
} catch (error) {
  console.error("Parse failed:", error.message);
}

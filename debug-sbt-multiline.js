#!/usr/bin/env node
import { parse } from "./packages/scala-parser/dist/index.js";

console.log("Testing multiline sbt assignments:");
try {
  const code = `name := "my-project"

version := "1.0.0"`;
  console.log(`Input: ${code}`);
  const result = parse(code);
  console.log("Parse successful");
} catch (error) {
  console.error("Parse failed:", error.message);
}

// Let's try each line separately
console.log("\nTesting line by line:");

const code = `name := "my-project"

version := "1.0.0"`;

const lines = code.split("\n").filter((line) => line.trim());
for (let i = 0; i < lines.length; i++) {
  console.log(`Line ${i + 1}: ${lines[i]}`);
  try {
    const lineResult = parse(lines[i]);
    console.log(`  ✓ Parsed successfully`);
  } catch (lineError) {
    console.error(`  ✗ Failed: ${lineError.message}`);
  }
}

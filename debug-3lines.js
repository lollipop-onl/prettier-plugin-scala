#!/usr/bin/env node
import { parse } from "./packages/scala-parser/dist/index.js";

console.log("Testing first 3 assignment lines:");
const code = `
name := "my-project"

version := "1.0.0"

scalaVersion := "3.3.0"`;

console.log(`Input: ${JSON.stringify(code)}`);

try {
  const result = parse(code);
  console.log("Parse successful");
} catch (error) {
  console.error("Parse failed:", error.message);
}

console.log("\nTesting without leading newline:");
const codeNoLeading = `name := "my-project"

version := "1.0.0"

scalaVersion := "3.3.0"`;

console.log(`Input: ${JSON.stringify(codeNoLeading)}`);

try {
  const result = parse(codeNoLeading);
  console.log("Parse successful");
} catch (error) {
  console.error("Parse failed:", error.message);
}

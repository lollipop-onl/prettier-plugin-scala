#!/usr/bin/env node
import { parse } from "./packages/scala-parser/dist/index.js";

console.log("Testing simple sbt assignment:");
try {
  const code = `name := "test"`;
  console.log(`Input: ${code}`);
  const result = parse(code);
  console.log("Parse successful");
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error("Parse failed:", error.message);
}

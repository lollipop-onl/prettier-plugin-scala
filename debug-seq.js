#!/usr/bin/env node
import { parse } from "./packages/scala-parser/dist/index.js";

console.log("Testing seq expression alone:");
const seqCode = `Seq(
  "org.typelevel" %% "cats-core" % "2.9.0",
  "org.typelevel" %% "cats-effect" % "3.5.0"
)`;

console.log(`Input: ${JSON.stringify(seqCode)}`);

try {
  const result = parse(seqCode);
  console.log("Parse successful");
} catch (error) {
  console.error("Parse failed:", error.message);
}

console.log("\nTesting simple ++= assignment:");
const assignmentCode = `libraryDependencies ++= Seq("test")`;
console.log(`Input: ${JSON.stringify(assignmentCode)}`);

try {
  const result = parse(assignmentCode);
  console.log("Parse successful");
} catch (error) {
  console.error("Parse failed:", error.message);
}

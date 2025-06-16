#!/usr/bin/env node
import { parse } from "./packages/scala-parser/dist/index.js";

console.log("Testing actual failing test case:");
const code = `
name := "my-project"

version := "1.0.0"

scalaVersion := "3.3.0"

libraryDependencies ++= Seq(
  "org.typelevel" %% "cats-core" % "2.9.0",
  "org.typelevel" %% "cats-effect" % "3.5.0"
)`;

console.log(`Input: ${JSON.stringify(code)}`);

try {
  const result = parse(code);
  console.log("Parse successful");
} catch (error) {
  console.error("Parse failed:", error.message);
}

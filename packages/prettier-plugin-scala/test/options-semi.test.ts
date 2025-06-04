import plugin from "../lib/index.js";
import assert from "node:assert";
import { test } from "node:test";
import { format } from "prettier";

test("semi option integration - should not add semicolons when semi=false (default for Scala)", async () => {
  const code = `class Person { val name = "John"; def age = 25; def greet() = println("Hello") }`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    semi: false,
  });

  // Should remove unnecessary semicolons in Scala
  const lines = result.split("\n");
  const statementLines = lines.filter(
    (line) =>
      line.trim().includes("val ") ||
      line.trim().includes("def ") ||
      line.trim().includes("println"),
  );

  // Check that statements don't end with semicolons
  statementLines.forEach((line) => {
    assert(
      !line.trim().endsWith(";"),
      `Line should not end with semicolon: ${line.trim()}`,
    );
  });
});

test("semi option integration - should preserve semicolons when semi=true", async () => {
  const code = `class Person { val name = "John"; def age = 25; def greet() = println("Hello") }`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    semi: true,
  });

  // Should preserve or add semicolons when semi=true
  const lines = result.split("\n");
  const statementLines = lines.filter(
    (line) =>
      line.trim().includes("val ") ||
      line.trim().includes("def ") ||
      line.trim().includes("println"),
  );

  // At least some statements should end with semicolons when semi=true
  const hasSemicolons = statementLines.some((line) =>
    line.trim().endsWith(";"),
  );
  assert(hasSemicolons, "Should have some semicolons when semi=true");
});

test("semi option integration - should handle multiple statements correctly", async () => {
  const code = `val x = 1; val y = 2; val z = x + y`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    semi: false,
  });

  // Should format multiple statements without trailing semicolons
  assert(!result.includes(";\n"), "Should not have semicolons at line endings");
  assert(result.includes("val x = 1"), "Should preserve first statement");
  assert(result.includes("val y = 2"), "Should preserve second statement");
  assert(result.includes("val z = x + y"), "Should preserve third statement");
});

test("semi option integration - should handle method definitions correctly", async () => {
  const code = `def process() = calculate()`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    semi: false,
  });

  // Should handle method definitions correctly without semicolons
  assert(
    result.includes("def process() = calculate()"),
    "Should preserve method definition",
  );
  assert(
    !result.trim().endsWith(";"),
    "Should not end with semicolon when semi=false",
  );
});

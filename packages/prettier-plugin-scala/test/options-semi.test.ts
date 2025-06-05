import plugin from "../dist/index.js";
import { format } from "prettier";
import { test, expect } from "vitest";

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
    // Line should not end with semicolon
    expect(line.trim().endsWith(";")).toBe(false);
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
  // Should have some semicolons when semi=true
  expect(hasSemicolons).toBe(true);
});

test("semi option integration - should handle multiple statements correctly", async () => {
  const code = `val x = 1; val y = 2; val z = x + y`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    semi: false,
  });

  // Should format multiple statements without trailing semicolons
  expect(result.includes(";\n")).toBe(false); // Should not have semicolons at line endings
  expect(result).toContain("val x = 1"); // Should preserve first statement
  expect(result).toContain("val y = 2"); // Should preserve second statement
  expect(result).toContain("val z = x + y"); // Should preserve third statement
});

test("semi option integration - should handle method definitions correctly", async () => {
  const code = `def process() = calculate()`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    semi: false,
  });

  // Should handle method definitions correctly without semicolons
  expect(result).toContain("def process() = calculate()"); // Should preserve method definition
  expect(result.trim().endsWith(";")).toBe(false); // Should not end with semicolon when semi=false
});

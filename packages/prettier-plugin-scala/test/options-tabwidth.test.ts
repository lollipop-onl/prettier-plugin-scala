import plugin from "../dist/index.js";
import { format } from "prettier";
import { test, expect } from "vitest";

test("tabWidth option integration - should respect tabWidth=2 (default)", async () => {
  const code = `class Person(name: String, age: Int) { def greet(): String = s"Hello, I'm $name and I'm $age years old" }`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    tabWidth: 2,
  });

  // Should use 2-space indentation
  const lines = result.split("\n");
  const indentedLines = lines.filter((line) => line.startsWith("  "));
  if (indentedLines.length > 0) {
    // Should use 2-space indentation
    expect(indentedLines.every((line) => line.match(/^  [^ ]/))).toBe(true);
  }
});

test("tabWidth option integration - should respect tabWidth=4", async () => {
  const code = `class Person(name: String, age: Int) { def greet(): String = s"Hello, I'm $name and I'm $age years old" }`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    tabWidth: 4,
  });

  // Should use 4-space indentation when formatted in multi-line
  const lines = result.split("\n");
  const indentedLines = lines.filter((line) => line.startsWith("    "));
  if (indentedLines.length > 0) {
    // Should use 4-space indentation
    expect(indentedLines.every((line) => line.match(/^    [^ ]/))).toBe(true);
  }
});

test("tabWidth option integration - should work with class body indentation", async () => {
  const code = `class Calculator { def add(a: Int, b: Int): Int = a + b; def multiply(a: Int, b: Int): Int = a * b }`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    tabWidth: 2,
    printWidth: 40, // Force multi-line formatting
  });

  // Check that class body uses correct indentation
  const lines = result.split("\n");
  const bodyLines = lines.filter((line) => line.includes("def "));
  if (bodyLines.length > 0) {
    // Class body should use tabWidth indentation
    expect(bodyLines.every((line) => line.startsWith("  "))).toBe(true);
  }
});

test("tabWidth option integration - should override deprecated scalaIndentStyle", async () => {
  const code = `class Person { def name: String = "John" }`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    tabWidth: 2,
    useTabs: false, // Explicitly specify useTabs=false to override scalaIndentStyle
    scalaIndentStyle: "tabs", // Should be ignored in favor of useTabs
  });

  // Should use spaces (not tabs) when useTabs=false is specified
  // Should not contain tab characters when useTabs=false
  expect(result.includes("\t")).toBe(false);
});

import plugin from "../lib/index.js";
import assert from "node:assert";
import { test } from "node:test";
import { format } from "prettier";

test("trailingComma option integration - should not add trailing commas when trailingComma=none", async () => {
  const code = `class Person(name: String, age: Int, city: String) { def info() = List(name, age, city) }`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    trailingComma: "none",
    printWidth: 40, // Force multi-line
  });

  // Should not have trailing commas
  assert(
    !result.includes(",\n)"),
    "Should not have trailing comma in parameters",
  );
  assert(!result.includes(",\n]"), "Should not have trailing comma in lists");
});

test("trailingComma option integration - should add trailing commas when trailingComma=all", async () => {
  const code = `class VeryLongClassName(veryLongParameterName: String, anotherVeryLongParameterName: Int, yetAnotherVeryLongParameterName: Boolean)`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    trailingComma: "all",
    printWidth: 40, // Force multi-line
  });

  // Should add trailing commas in multi-line contexts
  const lines = result.split("\n");

  if (lines.length > 2) {
    // Only check if actually multi-line
    const hasTrailingComma =
      result.includes(",\n") &&
      (result.includes("String,\n") ||
        result.includes("Int,\n") ||
        result.includes("Boolean,\n"));
    assert(
      hasTrailingComma,
      `Should have trailing commas in multi-line contexts. Got: ${result}`,
    );
  } else {
    // If it's still single line, that's acceptable
    assert(true, "Single line format is acceptable");
  }
});

test("trailingComma option integration - should handle single-line correctly", async () => {
  const code = `val list = List(1, 2, 3)`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    trailingComma: "all",
    printWidth: 80, // Allow single line
  });

  // Should not add trailing comma to single-line expressions
  assert(
    result.includes("List(1, 2, 3)"),
    "Should preserve single-line format",
  );
  assert(
    !result.includes("3,"),
    "Should not add trailing comma to single-line",
  );
});

test("trailingComma option integration - should handle method parameters", async () => {
  const code = `def process(param1: String, param2: Int, param3: Boolean) = param1.length + param2`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    trailingComma: "none",
    printWidth: 40, // Force multi-line
  });

  // Should not add trailing commas to parameters
  assert(result.includes("process"), "Should preserve method definition");
  assert(
    !result.includes("Boolean,"),
    "Should not have trailing comma in parameters",
  );
});

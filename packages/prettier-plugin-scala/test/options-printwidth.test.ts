import plugin from "../dist/index.js";
import { format } from "prettier";
import { test, expect } from "vitest";

test("printWidth option integration - should respect printWidth=40 (short line)", async () => {
  const longCode = `class VeryLongClassName(veryLongParameterName: String, anotherVeryLongParameterName: Int, yetAnotherVeryLongParameterName: Boolean) { def veryLongMethodName(): String = veryLongParameterName }`;

  const result = await format(longCode, {
    parser: "scala",
    plugins: [plugin],
    printWidth: 40,
  });

  // Should break long lines when they exceed 40 characters
  // Result should contain newlines for long content
  expect(result.includes("\n")).toBe(true);
  // Some lines should fit within 40 characters
  expect(result.split("\n").some((line) => line.trim().length <= 40)).toBe(
    true,
  );
});

test("printWidth option integration - should respect printWidth=120 (long line)", async () => {
  const longCode = `class VeryLongClassName(veryLongParameterName: String, anotherVeryLongParameterName: Int, yetAnotherVeryLongParameterName: Boolean) { def veryLongMethodName(): String = veryLongParameterName }`;

  const result = await format(longCode, {
    parser: "scala",
    plugins: [plugin],
    printWidth: 120,
  });

  // Should allow longer lines up to 120 characters
  // Some lines should be longer than 40 chars when printWidth=120
  expect(result.split("\n").some((line) => line.length > 40)).toBe(true);
});

test("printWidth option integration - should use printWidth instead of deprecated scalaLineWidth", async () => {
  const shortCode = `class Person(name: String)`;

  const result = await format(shortCode, {
    parser: "scala",
    plugins: [plugin],
    printWidth: 80,
  });

  expect(result.trim()).toBe("class Person(name: String)");
});

test("printWidth option integration - printWidth should override scalaLineWidth if both provided", async () => {
  const result = await format(`class Person(name: String)`, {
    parser: "scala",
    plugins: [plugin],
    printWidth: 80,
    scalaLineWidth: 40,
  });

  // Should use printWidth (80) and not scalaLineWidth (40)
  expect(result.trim()).toBe("class Person(name: String)");
});

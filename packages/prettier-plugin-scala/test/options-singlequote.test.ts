import plugin from "../dist/index.js";
import { format } from "prettier";
import { test, expect } from "vitest";

test("singleQuote option integration - should preserve double quotes when singleQuote=false (default)", async () => {
  const code = `val message = "Hello World"; val name = "John"; val greeting = "Welcome"`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    singleQuote: false,
  });

  // Should preserve double quotes (Scala standard)
  // Should use double quotes for strings
  expect(result.includes('"Hello World"')).toBe(true);
  // Should use double quotes for strings
  expect(result.includes('"John"')).toBe(true);
  // Should use double quotes for strings
  expect(result.includes('"Welcome"')).toBe(true);
});

test("singleQuote option integration - should use single quotes when singleQuote=true", async () => {
  const code = `val message = "Hello World"; val name = "John"; val greeting = "Welcome"`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    singleQuote: true,
  });

  // Should convert double quotes to single quotes (if supported)
  // Note: In Scala, single quotes are typically for Char literals, but this option allows string formatting choice
  // Should use single quotes for strings
  expect(result.includes("'Hello World'")).toBe(true);
  // Should use single quotes for strings
  expect(result.includes("'John'")).toBe(true);
  // Should use single quotes for strings
  expect(result.includes("'Welcome'")).toBe(true);
});

test("singleQuote option integration - should handle simple string correctly", async () => {
  const code = `val simple = "test"`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    singleQuote: false,
  });

  // Should preserve double quotes
  // Should use double quotes
  expect(result.includes('"test"')).toBe(true);
  // Should preserve variable declaration
  expect(result.includes("val simple")).toBe(true);
});

test("singleQuote option integration - should preserve string interpolation quotes", async () => {
  const code = `val name = "John"; val message = s"Hello \${name}"`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    singleQuote: true,
  });

  // Should handle string interpolation appropriately
  // Should use single quotes for simple strings
  expect(result.includes("'John'")).toBe(true);
  // String interpolation might need to preserve double quotes for compatibility
  // Should preserve interpolation content
  expect(result.includes("Hello")).toBe(true);
});

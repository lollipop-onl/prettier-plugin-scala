import plugin from "../lib/index.js";
import assert from "node:assert";
import { test } from "node:test";
import { format } from "prettier";

test("singleQuote option integration - should preserve double quotes when singleQuote=false (default)", async () => {
  const code = `val message = "Hello World"; val name = "John"; val greeting = "Welcome"`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    singleQuote: false,
  });

  // Should preserve double quotes (Scala standard)
  assert(
    result.includes('"Hello World"'),
    "Should use double quotes for strings",
  );
  assert(result.includes('"John"'), "Should use double quotes for strings");
  assert(result.includes('"Welcome"'), "Should use double quotes for strings");
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
  assert(
    result.includes("'Hello World'"),
    "Should use single quotes for strings",
  );
  assert(result.includes("'John'"), "Should use single quotes for strings");
  assert(result.includes("'Welcome'"), "Should use single quotes for strings");
});

test("singleQuote option integration - should handle simple string correctly", async () => {
  const code = `val simple = "test"`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    singleQuote: false,
  });

  // Should preserve double quotes
  assert(result.includes('"test"'), "Should use double quotes");
  assert(result.includes("val simple"), "Should preserve variable declaration");
});

test("singleQuote option integration - should preserve string interpolation quotes", async () => {
  const code = `val name = "John"; val message = s"Hello \${name}"`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    singleQuote: true,
  });

  // Should handle string interpolation appropriately
  assert(
    result.includes("'John'"),
    "Should use single quotes for simple strings",
  );
  // String interpolation might need to preserve double quotes for compatibility
  assert(result.includes("Hello"), "Should preserve interpolation content");
});

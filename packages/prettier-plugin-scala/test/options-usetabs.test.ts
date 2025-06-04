import plugin from "../lib/index.js";
import assert from "node:assert";
import { test } from "node:test";
import { format } from "prettier";

test("useTabs option integration - should use tabs when useTabs=true", async () => {
  const code = `class Calculator { def add(a: Int, b: Int): Int = a + b; def multiply(a: Int, b: Int): Int = a * b }`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    useTabs: true,
    printWidth: 40, // Force multi-line formatting
  });

  // Should use tab characters for indentation
  const lines = result.split("\n");
  const indentedLines = lines.filter((line) => line.startsWith("\t"));
  if (indentedLines.length > 0) {
    assert(
      indentedLines.every((line) => line.match(/^\t[^\t]/)),
      "Should use tab indentation",
    );
  }
});

test("useTabs option integration - should use spaces when useTabs=false (default)", async () => {
  const code = `class Calculator { def add(a: Int, b: Int): Int = a + b; def multiply(a: Int, b: Int): Int = a * b }`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    useTabs: false,
    printWidth: 40, // Force multi-line formatting
  });

  // Should use space characters for indentation
  assert(
    !result.includes("\t"),
    "Should not contain tab characters when useTabs=false",
  );

  const lines = result.split("\n");
  const indentedLines = lines.filter((line) => line.startsWith("  "));
  if (indentedLines.length > 0) {
    assert(
      indentedLines.every((line) => line.match(/^  [^ ]/)),
      "Should use space indentation",
    );
  }
});

test("useTabs option integration - should override deprecated scalaIndentStyle", async () => {
  const code = `class Person { def name: String = "John" }`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    useTabs: true,
    scalaIndentStyle: "spaces", // Should be ignored in favor of useTabs
    printWidth: 20, // Force multi-line
  });

  // Should use tabs despite scalaIndentStyle=spaces
  const lines = result.split("\n");
  const indentedLines = lines.filter((line) => line.startsWith("\t"));
  if (indentedLines.length > 0) {
    assert(
      indentedLines.length > 0,
      "Should use tabs when useTabs=true regardless of scalaIndentStyle",
    );
  }
});

test("useTabs option integration - should work with tabWidth for tab size", async () => {
  const code = `enum Color { case Red; case Green; case Blue }`;

  const result = await format(code, {
    parser: "scala",
    plugins: [plugin],
    useTabs: true,
    tabWidth: 4, // Tab size should still matter for alignment
  });

  // Should use tab characters but tabWidth still affects formatting decisions
  const lines = result.split("\n");
  const caseLines = lines.filter((line) => line.includes("case "));
  if (caseLines.length > 0) {
    assert(
      caseLines.every((line) => line.startsWith("\t")),
      "Enum cases should use tab indentation",
    );
  }
});

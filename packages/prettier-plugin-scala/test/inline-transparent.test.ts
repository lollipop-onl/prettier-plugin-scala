import plugin from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";
import { format } from "prettier";

describe("Inline and Transparent keywords formatting", () => {
  const formatCode = (code, options = {}) => {
    return format(code, {
      parser: "scala",
      plugins: [plugin],
      ...options,
    });
  };

  it("formats inline method definition", async () => {
    const code = "inline def debug(x: Int): Unit = println(x)";
    const expected = "inline def debug(x: Int): Unit = println(x)\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats transparent method definition", async () => {
    const code = "transparent def identity[T](x: T): T = x";
    const expected = "transparent def identity[T](x: T): T = x\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats inline transparent method definition", async () => {
    const code = "inline transparent def combine(x: Int, y: Int): Int = x + y";
    const expected =
      "inline transparent def combine(x: Int, y: Int): Int = x + y\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats inline val definition", async () => {
    const code = "inline val MAX_SIZE = 100";
    const expected = "inline val MAX_SIZE = 100\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats transparent val definition", async () => {
    const code = "transparent val config = Configuration";
    const expected = "transparent val config = Configuration\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats inline class modifier", async () => {
    const code = "inline class Wrapper(val value: Int) extends AnyVal";
    const expected =
      "inline class Wrapper(\n  val value: Int\n) extends AnyVal\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats transparent class modifier", async () => {
    const code = "transparent class Container[T](val data: T)";
    const expected = "transparent class Container[T](\n  val data: T\n)\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats inline with other modifiers", async () => {
    const code = "private inline def helper(x: String): String = x";
    const expected = "private inline def helper(x: String): String = x\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats transparent with other modifiers", async () => {
    const code = "final transparent def process[T](value: T): T = value";
    const expected = "final transparent def process[T](value: T): T = value\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats inline given definition", async () => {
    const code = "inline given Ord[Int] = intOrdering";
    const expected = "inline given Ord[Int] = intOrdering\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats transparent given definition", async () => {
    const code = "transparent given Conversion[String, Int] = stringToInt";
    const expected =
      "transparent given Conversion[String, Int] = stringToInt\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats multiple inline/transparent definitions", async () => {
    const code = `inline def add(x: Int, y: Int): Int = x + y
transparent def multiply(x: Int, y: Int): Int = x * y`;
    const expected =
      "inline def add(x: Int, y: Int): Int = x + y\ntransparent def multiply(x: Int, y: Int): Int = x * y\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });
});

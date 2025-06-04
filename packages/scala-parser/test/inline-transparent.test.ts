import { parse } from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Inline and Transparent keywords parsing", () => {
  it("parses inline method definition", () => {
    const result = parse("inline def debug(x: Int): Unit = println(x)");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 1);
  });

  it("parses transparent method definition", () => {
    const result = parse("transparent def identity[T](x: T): T = x");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses inline transparent method definition", () => {
    const result = parse(
      "inline transparent def combine(x: Int, y: Int): Int = x + y",
    );
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses inline val definition", () => {
    const result = parse("inline val MAX_SIZE = 100");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses transparent val definition", () => {
    const result = parse("transparent val config = Configuration.default");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses inline class modifier", () => {
    const result = parse("inline class Wrapper(val value: Int) extends AnyVal");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses transparent class modifier", () => {
    const result = parse("transparent class Container[T](val data: T)");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses inline with other modifiers", () => {
    const result = parse(
      "private inline def helper(x: String): String = x.toUpperCase",
    );
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses transparent with other modifiers", () => {
    const result = parse(
      "final transparent def process[T](value: T): T = value",
    );
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses inline given definition", () => {
    const result = parse("inline given Ord[Int] = intOrdering");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses transparent given definition", () => {
    const result = parse(
      "transparent given Conversion[String, Int] = stringToInt",
    );
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses multiple inline/transparent definitions", () => {
    const code = `
inline def add(x: Int, y: Int): Int = x + y
transparent def multiply(x: Int, y: Int): Int = x * y
`;
    const result = parse(code);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 2);
  });
});

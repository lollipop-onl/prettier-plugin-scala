import { parse } from "../lib/index.js";
import { describe, it, expect } from "vitest";

describe("Inline and Transparent keywords parsing", () => {
  it("parses inline method definition", () => {
    const result = parse("inline def debug(x: Int): Unit = println(x)");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
    expect(result.cst.children.topLevelDefinition.length).toBe(1);
  });

  it("parses transparent method definition", () => {
    const result = parse("transparent def identity[T](x: T): T = x");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses inline transparent method definition", () => {
    const result = parse(
      "inline transparent def combine(x: Int, y: Int): Int = x + y",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses inline val definition", () => {
    const result = parse("inline val MAX_SIZE = 100");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses transparent val definition", () => {
    const result = parse("transparent val config = Configuration.default");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses inline class modifier", () => {
    const result = parse("inline class Wrapper(val value: Int) extends AnyVal");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses transparent class modifier", () => {
    const result = parse("transparent class Container[T](val data: T)");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses inline with other modifiers", () => {
    const result = parse(
      "private inline def helper(x: String): String = x.toUpperCase",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses transparent with other modifiers", () => {
    const result = parse(
      "final transparent def process[T](value: T): T = value",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses inline given definition", () => {
    const result = parse("inline given Ord[Int] = intOrdering");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses transparent given definition", () => {
    const result = parse(
      "transparent given Conversion[String, Int] = stringToInt",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses multiple inline/transparent definitions", () => {
    const code = `
inline def add(x: Int, y: Int): Int = x + y
transparent def multiply(x: Int, y: Int): Int = x * y
`;
    const result = parse(code);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition.length).toBe(2);
  });
});

import { parse } from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Union and Intersection types parsing", () => {
  it("parses basic union types", () => {
    const result = parse("type StringOrInt = String | Int");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 1);
  });

  it("parses multiple union types", () => {
    const result = parse("type ThreeTypes = String | Int | Boolean");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses basic intersection types", () => {
    const result = parse("type Combined = Named & Aged");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses parenthesized union types", () => {
    const result = parse("type ParenUnion = (String | Int)");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses parenthesized intersection types", () => {
    const result = parse("type ParenInter = (Named & Aged)");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses complex union and intersection combinations", () => {
    const result = parse("type Complex = (String | Int) & (Named | Aged)");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses union types with generics", () => {
    const result = parse("type ListUnion = List[String | Int]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses generic type definitions with union types", () => {
    const result = parse("type Result[T] = T | String");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses multiple type parameters with union types", () => {
    const result = parse("type Container[A, B] = A | B");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses complex nested union types", () => {
    const result = parse(
      "type Nested = List[String | Int] | Map[String, Boolean]",
    );
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses mixed union and intersection with complex nesting", () => {
    const result = parse(
      "type Mixed = (List[String] | Set[Int]) & (Named | Aged)",
    );
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("union and intersection types should not cause parsing errors", () => {
    const code = `
type StringOrInt = String | Int
type Combined = Named & Aged
type Complex = (String | Int) & Named

class TestClass
    `;
    const result = parse(code);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 4);
  });
});

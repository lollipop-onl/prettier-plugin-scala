import { parse } from "../dist/index.js";
import { describe, it, expect } from "vitest";

describe("Union and Intersection types parsing", () => {
  it("parses basic union types", () => {
    const result = parse("type StringOrInt = String | Int");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
    expect(result.cst.children.topLevelDefinition.length).toBe(1);
  });

  it("parses multiple union types", () => {
    const result = parse("type ThreeTypes = String | Int | Boolean");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses basic intersection types", () => {
    const result = parse("type Combined = Named & Aged");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses parenthesized union types", () => {
    const result = parse("type ParenUnion = (String | Int)");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses parenthesized intersection types", () => {
    const result = parse("type ParenInter = (Named & Aged)");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses complex union and intersection combinations", () => {
    const result = parse("type Complex = (String | Int) & (Named | Aged)");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses union types with generics", () => {
    const result = parse("type ListUnion = List[String | Int]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses generic type definitions with union types", () => {
    const result = parse("type Result[T] = T | String");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses multiple type parameters with union types", () => {
    const result = parse("type Container[A, B] = A | B");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses complex nested union types", () => {
    const result = parse(
      "type Nested = List[String | Int] | Map[String, Boolean]",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses mixed union and intersection with complex nesting", () => {
    const result = parse(
      "type Mixed = (List[String] | Set[Int]) & (Named | Aged)",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("union and intersection types should not cause parsing errors", () => {
    const code = `
type StringOrInt = String | Int
type Combined = Named & Aged
type Complex = (String | Int) & Named

class TestClass
    `;
    const result = parse(code);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition.length).toBe(4);
  });
});

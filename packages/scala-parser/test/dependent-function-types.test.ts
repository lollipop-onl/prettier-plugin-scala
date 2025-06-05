import { parse } from "../dist/index.js";
import { describe, it, expect } from "vitest";

describe("Dependent function types parsing", () => {
  it("parses basic dependent function type", () => {
    const result = parse("type Fn = (x: Int) => List[x.type]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
    expect(result.cst.children.topLevelDefinition.length).toBe(1);
  });

  it("parses dependent function type with single parameter", () => {
    const result = parse("type Identity = (x: String) => x.type");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses dependent function type with multiple parameters", () => {
    const result = parse(
      "type Binary = (x: Int, y: String) => Map[x.type, y.type]",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses dependent function type with complex types", () => {
    const result = parse(
      "type Complex = (list: List[String]) => Vector[list.type]",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses dependent function type with generic parameter types", () => {
    const result = parse(
      "type Generic = (x: Option[Int]) => Container[x.type]",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses dependent function type with union types", () => {
    const result = parse("type UnionDep = (x: String | Int) => List[x.type]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses dependent function type with intersection types", () => {
    const result = parse(
      "type IntersectionDep = (x: Named & Aged) => Container[x.type]",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses nested dependent function types", () => {
    const result = parse(
      "type Nested = (x: Int) => (y: String) => Map[x.type, y.type]",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses dependent function type returning simple type", () => {
    const result = parse("type Simple = (x: Int) => String");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses dependent function type with no parameters", () => {
    const result = parse("type NoParams = () => String");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses multiple dependent function type definitions", () => {
    const code = `
type Identity = (x: String) => x.type
type Transform = (x: Int, y: String) => Map[x.type, y.type]
`;
    const result = parse(code);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition.length).toBe(2);
  });

  it("parses dependent function type with tuple parameter", () => {
    const result = parse(
      "type TupleParam = (pair: (Int, String)) => List[pair.type]",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });
});

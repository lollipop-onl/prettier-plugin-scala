import { parse } from "../lib/index.js";
import { describe, it, expect } from "vitest";

describe("Opaque types parsing", () => {
  it("parses basic opaque type definitions", () => {
    const result = parse("opaque type UserId = String");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
    expect(result.cst.children.topLevelDefinition.length).toBe(1);
  });

  it("parses opaque type with type parameters", () => {
    const result = parse("opaque type Id[T] = T");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses opaque type with complex type definition", () => {
    const result = parse("opaque type Email = String");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses opaque type with generic bounds", () => {
    const result = parse("opaque type Handle[T <: AnyRef] = T");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses opaque type with union types", () => {
    const result = parse("opaque type StringOrInt = String | Int");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses opaque type with intersection types", () => {
    const result = parse("opaque type Combined = Named & Aged");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses opaque type with complex nested types", () => {
    const result = parse("opaque type Config = Map[String, List[String]]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses multiple opaque type definitions", () => {
    const code = `
opaque type UserId = String
opaque type Email = String
opaque type Config[T] = Map[String, T]
`;
    const result = parse(code);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition.length).toBe(3);
  });

  it("parses opaque types mixed with regular type definitions", () => {
    const code = `
type RegularType = String | Int
opaque type OpaqueType = String
class TestClass
`;
    const result = parse(code);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition.length).toBe(3);
  });

  it("parses opaque type with variance annotations", () => {
    const result = parse("opaque type Container[+T] = List[T]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses opaque type with multiple type parameters", () => {
    const result = parse("opaque type Pair[A, B] = (A, B)");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses opaque type with complex generic type", () => {
    const result = parse("opaque type EventId[T <: Event] = UUID");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });
});

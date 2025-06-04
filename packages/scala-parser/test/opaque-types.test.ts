import { parse } from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Opaque types parsing", () => {
  it("parses basic opaque type definitions", () => {
    const result = parse("opaque type UserId = String");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 1);
  });

  it("parses opaque type with type parameters", () => {
    const result = parse("opaque type Id[T] = T");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses opaque type with complex type definition", () => {
    const result = parse("opaque type Email = String");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses opaque type with generic bounds", () => {
    const result = parse("opaque type Handle[T <: AnyRef] = T");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses opaque type with union types", () => {
    const result = parse("opaque type StringOrInt = String | Int");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses opaque type with intersection types", () => {
    const result = parse("opaque type Combined = Named & Aged");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses opaque type with complex nested types", () => {
    const result = parse("opaque type Config = Map[String, List[String]]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses multiple opaque type definitions", () => {
    const code = `
opaque type UserId = String
opaque type Email = String
opaque type Config[T] = Map[String, T]
`;
    const result = parse(code);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 3);
  });

  it("parses opaque types mixed with regular type definitions", () => {
    const code = `
type RegularType = String | Int
opaque type OpaqueType = String
class TestClass
`;
    const result = parse(code);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 3);
  });

  it("parses opaque type with variance annotations", () => {
    const result = parse("opaque type Container[+T] = List[T]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses opaque type with multiple type parameters", () => {
    const result = parse("opaque type Pair[A, B] = (A, B)");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses opaque type with complex generic type", () => {
    const result = parse("opaque type EventId[T <: Event] = UUID");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });
});

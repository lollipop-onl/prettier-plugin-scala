import { parse } from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Kind Projector parsing", () => {
  it("parses basic Kind Projector notation", () => {
    const result = parse("type StringMap[V] = Map[String, *]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 1);
  });

  it("parses Kind Projector with single placeholder", () => {
    const result = parse("type ListFunctor = List[*]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses Kind Projector with multiple placeholders", () => {
    const result = parse("type Function2Partial[R] = Function2[*, *, R]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses Kind Projector at beginning of type params", () => {
    const result = parse("type EitherLeft[R] = Either[*, R]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses Kind Projector in nested types", () => {
    const result = parse("type NestedMap = Map[String, List[*]]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses Kind Projector with concrete types", () => {
    const result = parse("type MixedTypes = Map[String, Either[Int, *]]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses Kind Projector in complex type definition", () => {
    const result = parse(
      "type ComplexType[A] = List[Map[String, Either[A, *]]]",
    );
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses multiple Kind Projector type definitions", () => {
    const code = `
type StringMap = Map[String, *]
type IntList = List[*]
type EitherString = Either[String, *]
`;
    const result = parse(code);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 3);
  });

  it("parses Kind Projector with type bounds", () => {
    const result = parse("type BoundedMap[T <: AnyRef] = Map[T, *]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses Kind Projector with variance annotations", () => {
    const result = parse("type CovariantMap[+V] = Map[String, *]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses Kind Projector with union types", () => {
    const result = parse("type UnionMap = Map[String | Int, *]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses Kind Projector with intersection types", () => {
    const result = parse("type IntersectionMap = Map[Named & Aged, *]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });
});

import plugin from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";
import { format } from "prettier";

describe("Kind Projector formatting", () => {
  const formatCode = (code, options = {}) => {
    return format(code, {
      parser: "scala",
      plugins: [plugin],
      ...options,
    });
  };

  it("formats basic Kind Projector notation", async () => {
    const code = "type StringMap[V] = Map[String, *]";
    const expected = "type StringMap[V] = Map[String, *]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats Kind Projector with single placeholder", async () => {
    const code = "type ListFunctor = List[*]";
    const expected = "type ListFunctor = List[*]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats Kind Projector with multiple placeholders", async () => {
    const code = "type Function2Partial[R] = Function2[*, *, R]";
    const expected = "type Function2Partial[R] = Function2[*, *, R]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats Kind Projector at beginning of type params", async () => {
    const code = "type EitherLeft[R] = Either[*, R]";
    const expected = "type EitherLeft[R] = Either[*, R]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats Kind Projector in nested types", async () => {
    const code = "type NestedMap = Map[String, List[*]]";
    const expected = "type NestedMap = Map[String, List[*]]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats Kind Projector with concrete types", async () => {
    const code = "type MixedTypes = Map[String, Either[Int, *]]";
    const expected = "type MixedTypes = Map[String, Either[Int, *]]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats Kind Projector in complex type definition", async () => {
    const code = "type ComplexType[A] = List[Map[String, Either[A, *]]]";
    const expected = "type ComplexType[A] = List[Map[String, Either[A, *]]]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats multiple Kind Projector type definitions", async () => {
    const code = `type StringMap = Map[String, *]
type IntList = List[*]
type EitherString = Either[String, *]`;
    const expected =
      "type StringMap = Map[String, *]\ntype IntList = List[*]\ntype EitherString = Either[String, *]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats Kind Projector with type bounds", async () => {
    const code = "type BoundedMap[T <: AnyRef] = Map[T, *]";
    const expected = "type BoundedMap[T <: AnyRef] = Map[T, *]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats Kind Projector with variance annotations", async () => {
    const code = "type CovariantMap[+V] = Map[String, *]";
    const expected = "type CovariantMap[+V] = Map[String, *]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats Kind Projector with union types", async () => {
    const code = "type UnionMap = Map[String | Int, *]";
    const expected = "type UnionMap = Map[String | Int, *]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats Kind Projector with intersection types", async () => {
    const code = "type IntersectionMap = Map[Named & Aged, *]";
    const expected = "type IntersectionMap = Map[Named & Aged, *]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });
});

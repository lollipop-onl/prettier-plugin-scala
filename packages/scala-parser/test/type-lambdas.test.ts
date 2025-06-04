import { parse } from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Type lambdas parsing", () => {
  it("parses basic type lambda", () => {
    const result = parse("type Identity = [X] =>> X");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 1);
  });

  it("parses type lambda with single parameter", () => {
    const result = parse("type Identity = [X] =>> X");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses type lambda with multiple parameters", () => {
    const result = parse("type BinaryTypeFunction = [X, Y] =>> Map[X, Y]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses type lambda with variance annotations", () => {
    const result = parse("type CovariantFunction = [+X] =>> List[X]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses type lambda with contravariant annotation", () => {
    const result = parse(
      "type ContravariantFunction = [-X] =>> Function[X, String]",
    );
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses type lambda with type bounds", () => {
    const result = parse("type BoundedFunction = [X <: AnyRef] =>> Option[X]");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses type lambda with lower type bounds", () => {
    const result = parse(
      "type LowerBoundedFunction = [X >: Nothing] =>> List[X]",
    );
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses complex type lambda with multiple constraints", () => {
    const result = parse(
      "type ComplexFunction = [+X <: AnyRef, -Y >: Nothing] =>> Map[X, Y]",
    );
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses nested type lambda", () => {
    const result = parse("type NestedFunction = [F] =>> [X] =>> F");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses type lambda with union result type", () => {
    const result = parse("type UnionFunction = [X] =>> X | String");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses type lambda with intersection result type", () => {
    const result = parse(
      "type IntersectionFunction = [X] =>> X & Serializable",
    );
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses multiple type lambda definitions", () => {
    const code = `
type Identity = [X] =>> X
type ConstFunction = [X, Y] =>> X
`;
    const result = parse(code);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 2);
  });
});

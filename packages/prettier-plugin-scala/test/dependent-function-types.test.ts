import plugin from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";
import { format } from "prettier";

describe("Dependent function types formatting", () => {
  const formatCode = (code, options = {}) => {
    return format(code, {
      parser: "scala",
      plugins: [plugin],
      ...options,
    });
  };

  it("formats basic dependent function type", async () => {
    const code = "type Fn = (x: Int) => List[x.type]";
    const expected = "type Fn = (x: Int) => List[x.type]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats dependent function type with single parameter", async () => {
    const code = "type Identity = (x: String) => x.type";
    const expected = "type Identity = (x: String) => x.type\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats dependent function type with multiple parameters", async () => {
    const code = "type Binary = (x: Int, y: String) => Map[x.type, y.type]";
    const expected =
      "type Binary = (x: Int, y: String) => Map[x.type, y.type]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats dependent function type with complex types", async () => {
    const code = "type Complex = (list: List[String]) => Vector[list.type]";
    const expected =
      "type Complex = (list: List[String]) => Vector[list.type]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats dependent function type with generic parameter types", async () => {
    const code = "type Generic = (x: Option[Int]) => Container[x.type]";
    const expected = "type Generic = (x: Option[Int]) => Container[x.type]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats dependent function type with union types", async () => {
    const code = "type UnionDep = (x: String | Int) => List[x.type]";
    const expected = "type UnionDep = (x: String | Int) => List[x.type]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats dependent function type with intersection types", async () => {
    const code =
      "type IntersectionDep = (x: Named & Aged) => Container[x.type]";
    const expected =
      "type IntersectionDep = (x: Named & Aged) => Container[x.type]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats nested dependent function types", async () => {
    const code = "type Nested = (x: Int) => (y: String) => Map[x.type, y.type]";
    const expected =
      "type Nested = (x: Int) => (y: String) => Map[x.type, y.type]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats dependent function type returning simple type", async () => {
    const code = "type Simple = (x: Int) => String";
    const expected = "type Simple = (x: Int) => String\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats dependent function type with no parameters", async () => {
    const code = "type NoParams = () => String";
    const expected = "type NoParams = () => String\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats multiple dependent function type definitions", async () => {
    const code = `type Identity = (x: String) => x.type
type Transform = (x: Int, y: String) => Map[x.type, y.type]`;
    const expected =
      "type Identity = (x: String) => x.type\ntype Transform = (x: Int, y: String) => Map[x.type, y.type]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });

  it("formats dependent function type with tuple parameter", async () => {
    const code = "type TupleParam = (pair: (Int, String)) => List[pair.type]";
    const expected =
      "type TupleParam = (pair: (Int, String)) => List[pair.type]\n";
    const result = await formatCode(code);
    assert.strictEqual(result, expected);
  });
});

import { parse } from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Context functions parsing", () => {
  it("parses basic context function type", () => {
    const result = parse("type Executable[T] = ExecutionContext ?=> T");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 1);
  });

  it("parses context function with parameters", () => {
    const result = parse("def run[T](body: ExecutionContext ?=> T): T = ???");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses multiple context parameters", () => {
    const result = parse("type Multi = (String, Int) ?=> Boolean");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses context function lambda", () => {
    const result = parse("val f: String ?=> Int = str => str.length");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses nested context functions", () => {
    const result = parse("type Nested = String ?=> Int ?=> Boolean");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses context function with generic types", () => {
    const result = parse(
      "def async[T](body: ExecutionContext ?=> Future[T]): Future[T] = ???",
    );
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses context function with union types", () => {
    const result = parse("type Handler = (String | Int) ?=> Unit");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses context function with intersection types", () => {
    const result = parse("type Complex = (Readable & Writable) ?=> Unit");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses context function with using parameters", () => {
    const result = parse(
      "def execute(using ctx: ExecutionContext): String ?=> Int = ???",
    );
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses multiple context function definitions", () => {
    const result = parse(`
      type Ctx1 = String ?=> Int
      type Ctx2 = Int ?=> Boolean
    `);
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 2);
  });
});

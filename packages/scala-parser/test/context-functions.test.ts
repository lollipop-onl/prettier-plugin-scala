import { parse } from "../lib/index.js";
import { describe, it, expect } from "vitest";

describe("Context functions parsing", () => {
  it("parses basic context function type", () => {
    const result = parse("type Executable[T] = ExecutionContext ?=> T");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
    expect(result.cst.children.topLevelDefinition.length).toBe(1);
  });

  it("parses context function with parameters", () => {
    const result = parse("def run[T](body: ExecutionContext ?=> T): T = ???");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses multiple context parameters", () => {
    const result = parse("type Multi = (String, Int) ?=> Boolean");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses context function lambda", () => {
    const result = parse("val f: String ?=> Int = str => str.length");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses nested context functions", () => {
    const result = parse("type Nested = String ?=> Int ?=> Boolean");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses context function with generic types", () => {
    const result = parse(
      "def async[T](body: ExecutionContext ?=> Future[T]): Future[T] = ???",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses context function with union types", () => {
    const result = parse("type Handler = (String | Int) ?=> Unit");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses context function with intersection types", () => {
    const result = parse("type Complex = (Readable & Writable) ?=> Unit");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses context function with using parameters", () => {
    const result = parse(
      "def execute(using ctx: ExecutionContext): String ?=> Int = ???",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses multiple context function definitions", () => {
    const result = parse(`
      type Ctx1 = String ?=> Int
      type Ctx2 = Int ?=> Boolean
    `);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
    expect(result.cst.children.topLevelDefinition.length).toBe(2);
  });
});

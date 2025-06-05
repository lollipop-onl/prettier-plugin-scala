import plugin from "../dist/index.js";
import { format } from "prettier";
import { describe, it, expect } from "vitest";

describe("Union and Intersection types formatting", () => {
  const formatCode = (code, options = {}) => {
    return format(code, {
      parser: "scala",
      plugins: [plugin],
      ...options,
    });
  };

  it("formats basic union types", async () => {
    const code = "type StringOrInt = String | Int";
    const expected = "type StringOrInt = String | Int\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats multiple union types", async () => {
    const code = "type ThreeTypes = String | Int | Boolean";
    const expected = "type ThreeTypes = String | Int | Boolean\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats basic intersection types", async () => {
    const code = "type Combined = Named & Aged";
    const expected = "type Combined = Named & Aged\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats parenthesized union types", async () => {
    const code = "type ParenUnion = (String | Int)";
    const expected = "type ParenUnion = (String | Int)\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats parenthesized intersection types", async () => {
    const code = "type ParenInter = (Named & Aged)";
    const expected = "type ParenInter = (Named & Aged)\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats complex union and intersection combinations", async () => {
    const code = "type Complex = (String | Int) & (Named | Aged)";
    const expected = "type Complex = (String | Int) & (Named | Aged)\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats union types with generics", async () => {
    const code = "type ListUnion = List[String | Int]";
    const expected = "type ListUnion = List[String | Int]\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats generic type definitions with union types", async () => {
    const code = "type Result[T] = T | String";
    const expected = "type Result[T] = T | String\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats multiple type parameters with union types", async () => {
    const code = "type Container[A, B] = A | B";
    const expected = "type Container[A, B] = A | B\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats complex nested union types", async () => {
    const code = "type Nested = List[String | Int] | Map[String, Boolean]";
    const expected =
      "type Nested = List[String | Int] | Map[String, Boolean]\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats mixed union and intersection with complex nesting", async () => {
    const code = "type Mixed = (List[String] | Set[Int]) & (Named | Aged)";
    const expected =
      "type Mixed = (List[String] | Set[Int]) & (Named | Aged)\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats multiple type definitions", async () => {
    const code = `type StringOrInt = String | Int
type Combined = Named & Aged
type Complex = (String | Int) & Named`;
    const expected =
      "type StringOrInt = String | Int\ntype Combined = Named & Aged\ntype Complex = (String | Int) & Named\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });
});

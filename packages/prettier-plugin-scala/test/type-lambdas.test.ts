import plugin from "../lib/index.js";
import { format } from "prettier";
import { describe, it, expect } from "vitest";

describe("Type lambdas formatting", () => {
  const formatCode = (code, options = {}) => {
    return format(code, {
      parser: "scala",
      plugins: [plugin],
      ...options,
    });
  };

  it("formats basic type lambda", async () => {
    const code = "type Identity = [X] =>> X";
    const expected = "type Identity = [X] =>> X\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats type lambda with single parameter", async () => {
    const code = "type Identity = [X] =>> X";
    const expected = "type Identity = [X] =>> X\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats type lambda with multiple parameters", async () => {
    const code = "type BinaryTypeFunction = [X, Y] =>> Map[X, Y]";
    const expected = "type BinaryTypeFunction = [X, Y] =>> Map[X, Y]\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats type lambda with variance annotations", async () => {
    const code = "type CovariantFunction = [+X] =>> List[X]";
    const expected = "type CovariantFunction = [+X] =>> List[X]\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats type lambda with contravariant annotation", async () => {
    const code = "type ContravariantFunction = [-X] =>> Function[X, String]";
    const expected =
      "type ContravariantFunction = [-X] =>> Function[X, String]\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats type lambda with type bounds", async () => {
    const code = "type BoundedFunction = [X <: AnyRef] =>> Option[X]";
    const expected = "type BoundedFunction = [X <: AnyRef] =>> Option[X]\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats type lambda with lower type bounds", async () => {
    const code = "type LowerBoundedFunction = [X >: Nothing] =>> List[X]";
    const expected = "type LowerBoundedFunction = [X >: Nothing] =>> List[X]\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats complex type lambda with multiple constraints", async () => {
    const code =
      "type ComplexFunction = [+X <: AnyRef, -Y >: Nothing] =>> Map[X, Y]";
    const expected =
      "type ComplexFunction = [+X <: AnyRef, -Y >: Nothing] =>> Map[X, Y]\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats nested type lambda", async () => {
    const code = "type NestedFunction = [F] =>> [X] =>> F";
    const expected = "type NestedFunction = [F] =>> [X] =>> F\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats type lambda with union result type", async () => {
    const code = "type UnionFunction = [X] =>> X | String";
    const expected = "type UnionFunction = [X] =>> X | String\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats type lambda with intersection result type", async () => {
    const code = "type IntersectionFunction = [X] =>> X & Serializable";
    const expected = "type IntersectionFunction = [X] =>> X & Serializable\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats multiple type lambda definitions", async () => {
    const code = `type Identity = [X] =>> X
type ConstFunction = [X, Y] =>> X`;
    const expected =
      "type Identity = [X] =>> X\ntype ConstFunction = [X, Y] =>> X\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });
});

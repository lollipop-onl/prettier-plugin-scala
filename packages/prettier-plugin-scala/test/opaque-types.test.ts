import plugin from "../dist/index.js";
import { format } from "prettier";
import { describe, it, expect } from "vitest";

describe("Opaque types formatting", () => {
  const formatCode = (code, options = {}) => {
    return format(code, {
      parser: "scala",
      plugins: [plugin],
      ...options,
    });
  };

  it("formats basic opaque type definitions", async () => {
    const code = "opaque type UserId = String";
    const expected = "opaque type UserId = String\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats opaque type with type parameters", async () => {
    const code = "opaque type Id[T] = T";
    const expected = "opaque type Id[T] = T\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats opaque type with complex type definition", async () => {
    const code = "opaque type Email = String";
    const expected = "opaque type Email = String\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats opaque type with generic bounds", async () => {
    const code = "opaque type Handle[T <: AnyRef] = T";
    const expected = "opaque type Handle[T <: AnyRef] = T\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats opaque type with union types", async () => {
    const code = "opaque type StringOrInt = String | Int";
    const expected = "opaque type StringOrInt = String | Int\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats opaque type with intersection types", async () => {
    const code = "opaque type Combined = Named & Aged";
    const expected = "opaque type Combined = Named & Aged\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats opaque type with complex nested types", async () => {
    const code = "opaque type Config = Map[String, List[String]]";
    const expected = "opaque type Config = Map[String, List[String]]\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats multiple opaque type definitions", async () => {
    const code = `opaque type UserId = String
opaque type Email = String
opaque type Config[T] = Map[String, T]`;
    const expected =
      "opaque type UserId = String\nopaque type Email = String\nopaque type Config[T] = Map[String, T]\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats opaque types mixed with regular type definitions", async () => {
    const code = `type RegularType = String | Int
opaque type OpaqueType = String
class TestClass`;
    const expected =
      "type RegularType = String | Int\nopaque type OpaqueType = String\nclass TestClass\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats opaque type with variance annotations", async () => {
    const code = "opaque type Container[+T] = List[T]";
    const expected = "opaque type Container[+T] = List[T]\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats opaque type with multiple type parameters", async () => {
    const code = "opaque type Pair[A, B] = (A, B)";
    const expected = "opaque type Pair[A, B] = (A, B)\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats opaque type with complex generic type", async () => {
    const code = "opaque type EventId[T <: Event] = UUID";
    const expected = "opaque type EventId[T <: Event] = UUID\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });
});

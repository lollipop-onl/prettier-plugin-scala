import plugin from "../lib/index.js";
import { format } from "prettier";
import { describe, it, expect } from "vitest";

describe("Match types formatting", () => {
  const formatCode = (code, options = {}) => {
    return format(code, {
      parser: "scala",
      plugins: [plugin],
      ...options,
    });
  };

  it("formats basic match type", async () => {
    const code = "type Elem[X] = X match { case String => Char }";
    const expected = "type Elem[X] = X match {\n  case String => Char\n}\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats multiple match type cases", async () => {
    const code = `type Elem[X] = X match {
      case String => Char
      case Array[t] => t
    }`;
    const expected =
      "type Elem[X] = X match {\n  case String => Char\n  case Array[t] => t\n}\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats complex match type with generic patterns", async () => {
    const code = `type Head[X] = X match {
      case List[h] => h
      case EmptyTuple => Nothing
    }`;
    const expected =
      "type Head[X] = X match {\n  case List[h] => h\n  case EmptyTuple => Nothing\n}\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats nested match types", async () => {
    const code = `type Flatten[X] = X match {
      case Array[Array[t]] => Array[t]
      case Array[t] => Array[t]
      case t => t
    }`;
    const expected =
      "type Flatten[X] = X match {\n  case Array[Array[t]] => Array[t]\n  case Array[t] => Array[t]\n  case t => t\n}\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats match type with union result", async () => {
    const code = `type StringOrChar[X] = X match {
      case String => Char
      case Int => String | Char
    }`;
    const expected =
      "type StringOrChar[X] = X match {\n  case String => Char\n  case Int => String | Char\n}\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats match type with intersection result", async () => {
    const code = `type Combined[X] = X match {
      case String => Named & Aged
      case Int => String
    }`;
    const expected =
      "type Combined[X] = X match {\n  case String => Named & Aged\n  case Int => String\n}\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats single case match type", async () => {
    const code = "type Single[X] = X match { case Any => String }";
    const expected = "type Single[X] = X match {\n  case Any => String\n}\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats match type with type parameters", async () => {
    const code = `type Map[K, V] = (K, V) match {
      case (String, Int) => StringIntMap
      case (String, String) => StringStringMap
    }`;
    const expected =
      "type Map[K, V] = (K, V) match {\n  case (String, Int) => StringIntMap\n  case (String, String) => StringStringMap\n}\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats match type with complex input type", async () => {
    const code = `type Result[X] = List[X] | Option[X] match {
      case List[String] => Char
      case Option[Int] => Boolean
    }`;
    const expected =
      "type Result[X] = List[X] | Option[X] match {\n  case List[String] => Char\n  case Option[Int] => Boolean\n}\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats multiple match type definitions", async () => {
    const code = `type Elem[X] = X match { case String => Char }
type Size[X] = X match { case Array[t] => Int }
type Head[X] = X match { case List[h] => h }`;
    const expected =
      "type Elem[X] = X match {\n  case String => Char\n}\ntype Size[X] = X match {\n  case Array[t] => Int\n}\ntype Head[X] = X match {\n  case List[h] => h\n}\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });
});

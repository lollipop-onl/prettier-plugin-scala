import plugin from "../dist/index.js";
import { format } from "prettier";
import { describe, it, expect } from "vitest";

describe("Prettier Plugin Scala", () => {
  const formatCode = (code, options = {}) => {
    return format(code, {
      parser: "scala",
      plugins: [plugin],
      ...options,
    });
  };

  it("should format a simple class definition", async () => {
    const input = "class Person";
    const expected = "class Person\n";
    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format a class with parameters", async () => {
    const input = "class Person(name:String,age:Int)";
    const expected = "class Person(\n  name: String,\n  age: Int\n)\n";
    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format a class with body", async () => {
    const input = `class Person(name: String) {
def getName(): String = name
val age: Int = 25
}`;
    const expected = `class Person(name: String) {
  def getName(): String = name
  val age: Int = 25
}
`;
    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format an object definition", async () => {
    const input = `object Main {
def main(args: Array[String]): Unit = {
println("Hello, World!")
}
}`;
    const expected = `object Main {
  def main(args: Array[String]): Unit = {
  println("Hello, World!")
}
}
`;
    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format val and var definitions", async () => {
    const input = `val x=42
var y:String="hello"`;
    const expected = `val x = 42
var y: String = "hello"
`;
    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format package and import statements", async () => {
    const input = `package com.example
import scala.collection.mutable
class MyClass`;
    const expected = `package com.example

import scala.collection.mutable

class MyClass
`;
    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format modifiers", async () => {
    const input = `private final class SecretClass
protected def protectedMethod(): Unit = {}`;
    const expected = `private final class SecretClass
protected def protectedMethod(): Unit = {}
`;
    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it.skip("should preserve comments", async () => {
    const input = `// This is a comment
class Person /* inline comment */ (name: String)`;
    const expected = `// This is a comment
class Person /* inline comment */ (name: String)
`;
    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  describe("Negation operator formatting", () => {
    it("should format simple negation", async () => {
      const input = "val x=!true";
      const expected = "val x = !true\n";
      const result = await formatCode(input);
      expect(result).toBe(expected);
    });

    it("should format negation with spacing", async () => {
      const input = "val isEmpty  =  ! hasElements";
      const expected = "val isEmpty = !hasElements\n";
      const result = await formatCode(input);
      expect(result).toBe(expected);
    });

    it("should format negation of method call", async () => {
      const input = "val notEmpty=!list.isEmpty";
      const expected = "val notEmpty = !list.isEmpty\n";
      const result = await formatCode(input);
      expect(result).toBe(expected);
    });

    it("should format negation with parentheses", async () => {
      const input = "val complex = ! ( a>5 && b<10 )";
      const expected = "val complex = !(a > 5 && b < 10)\n";
      const result = await formatCode(input);
      expect(result).toBe(expected);
    });

    it("should format negation in complex expressions", async () => {
      const input = "val result=!a&&b||!c";
      const expected = "val result = !a && b || !c\n";
      const result = await formatCode(input);
      expect(result).toBe(expected);
    });

    it("should preserve negation in multiline expressions", async () => {
      const input = `val condition = {
  !isEmpty &&
  !isInvalid
}`;
      const expected = `val condition = {
  !isEmpty && !isInvalid
}
`;
      const result = await formatCode(input);
      expect(result).toBe(expected);
    });
  });
});

import plugin from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";
import { format } from "prettier";

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
    assert.strictEqual(result, expected);
  });

  it("should format a class with parameters", async () => {
    const input = "class Person(name:String,age:Int)";
    const expected = "class Person(\n  name: String,\n  age: Int\n)\n";
    const result = await formatCode(input);
    assert.strictEqual(result, expected);
  });

  it("should format a class with body", async () => {
    const input = `class Person(name: String) {
def getName(): String = name
val age: Int = 25
}`;
    const expected = `class Person(
  name: String
) {
  def getName(): String = name
  val age: Int = 25
}
`;
    const result = await formatCode(input);
    assert.strictEqual(result, expected);
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
    assert.strictEqual(result, expected);
  });

  it("should format val and var definitions", async () => {
    const input = `val x=42
var y:String="hello"`;
    const expected = `val x = 42
var y: String = "hello"
`;
    const result = await formatCode(input);
    assert.strictEqual(result, expected);
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
    assert.strictEqual(result, expected);
  });

  it("should format modifiers", async () => {
    const input = `private final class SecretClass
protected def protectedMethod(): Unit = {}`;
    const expected = `private final class SecretClass
protected def protectedMethod(): Unit = {}
`;
    const result = await formatCode(input);
    assert.strictEqual(result, expected);
  });

  it.skip("should preserve comments", async () => {
    const input = `// This is a comment
class Person /* inline comment */ (name: String)`;
    const expected = `// This is a comment
class Person /* inline comment */ (
  name: String
)
`;
    const result = await formatCode(input);
    assert.strictEqual(result, expected);
  });
});

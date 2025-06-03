import { parse } from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("ScalaParser", () => {
  it("should parse a simple class definition", () => {
    const input = "class Person";
    const result = parse(input);

    assert.strictEqual(result.errors.length, 0);
    assert.ok(result.cst);
  });

  it("should parse a class with parameters", () => {
    const input = "class Person(name: String, age: Int)";
    const result = parse(input);

    assert.strictEqual(result.errors.length, 0);
    assert.ok(result.cst);
  });

  it("should parse a class with extends", () => {
    const input = "class Employee extends Person";
    const result = parse(input);

    assert.strictEqual(result.errors.length, 0);
    assert.ok(result.cst);
  });

  it("should parse a class with body", () => {
    const input = `class Person(name: String) {
      def getName(): String = name
      val age: Int = 25
    }`;
    const result = parse(input);

    assert.strictEqual(result.errors.length, 0);
    assert.ok(result.cst);
  });

  it("should parse an object definition", () => {
    const input = `object Main {
      def main(args: Array[String]): Unit = {
        println("Hello, World!")
      }
    }`;
    const result = parse(input);

    assert.strictEqual(result.errors.length, 0);
    assert.ok(result.cst);
  });

  it("should parse val definitions", () => {
    const input = "val x = 42";
    const result = parse(input);

    assert.strictEqual(result.errors.length, 0);
    assert.ok(result.cst);
  });

  it("should parse var definitions", () => {
    const input = 'var y: String = "hello"';
    const result = parse(input);

    assert.strictEqual(result.errors.length, 0);
    assert.ok(result.cst);
  });

  it("should parse method definitions", () => {
    const input = "def add(x: Int, y: Int): Int = x + y";
    const result = parse(input);

    assert.strictEqual(result.errors.length, 0);
    assert.ok(result.cst);
  });

  it("should parse package and import statements", () => {
    const input = `package com.example
    
    import scala.collection.mutable
    
    class MyClass`;
    const result = parse(input);

    assert.strictEqual(result.errors.length, 0);
    assert.ok(result.cst);
  });

  it("should parse modifiers", () => {
    const input = `private final class SecretClass
    protected def protectedMethod(): Unit = {}
    override lazy val lazyValue = 42`;
    const result = parse(input);

    assert.strictEqual(result.errors.length, 0);
    assert.ok(result.cst);
  });

  it("should handle comments", () => {
    const input = `// This is a comment
    class Person /* inline comment */ (name: String)`;
    const result = parse(input);

    assert.strictEqual(result.errors.length, 0);
    assert.ok(result.cst);
    assert.strictEqual(result.comments.length, 2);
  });

  describe("Negation operator", () => {
    it("should parse simple negation", () => {
      const input = "val x = !true";
      const result = parse(input);

      assert.strictEqual(result.errors.length, 0);
      assert.ok(result.cst);
    });

    it("should parse negation of identifier", () => {
      const input = "val isEmpty = !hasElements";
      const result = parse(input);

      assert.strictEqual(result.errors.length, 0);
      assert.ok(result.cst);
    });

    it("should parse negation of method call", () => {
      const input = "val notEmpty = !list.isEmpty";
      const result = parse(input);

      assert.strictEqual(result.errors.length, 0);
      assert.ok(result.cst);
    });

    it("should parse negation with parentheses", () => {
      const input = "val complex = !(a > 5 && b < 10)";
      const result = parse(input);

      assert.strictEqual(result.errors.length, 0);
      assert.ok(result.cst);
    });

    it("should parse double negation", () => {
      const input = "val doubleNeg = !!flag";
      const result = parse(input);

      assert.strictEqual(result.errors.length, 0);
      assert.ok(result.cst);
    });

    it("should parse negation in complex expressions", () => {
      const input = "val result = !a && b || !c";
      const result = parse(input);

      assert.strictEqual(result.errors.length, 0);
      assert.ok(result.cst);
    });
  });
});

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import path from "path";
import * as prettier from "prettier";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginPath = path.join(__dirname, "..", "lib", "index.js");

async function format(code) {
  const result = await prettier.format(code, {
    parser: "scala",
    plugins: [pluginPath],
    printWidth: 80,
  });
  return result.trim();
}

describe("Phase 2 Features", () => {
  describe("Generics / Type Parameters", () => {
    test("basic type parameters", async () => {
      const input = `class Box[T](value: T)`;
      const output = await format(input);
      assert.match(output, /class Box\[T\]/);
    });

    test("multiple type parameters", async () => {
      const input = `class Map[K, V]`;
      const output = await format(input);
      assert.equal(output, "class Map[K, V]");
    });

    test("type parameter with upper bound", async () => {
      const input = `class Container[T <: AnyRef](value: T)`;
      const output = await format(input);
      assert.match(output, /\[T <: AnyRef\]/);
    });

    test("type parameter with lower bound", async () => {
      const input = `class Container[T >: Nothing](value: T)`;
      const output = await format(input);
      assert.match(output, /\[T >: Nothing\]/);
    });

    test("generic method", async () => {
      const input = `def identity[T](x: T): T = x`;
      const output = await format(input);
      assert.equal(output, "def identity[T](x: T): T = x");
    });

    test("type parameters in trait", async () => {
      const input = `trait Collection[T] { def add(item: T): Unit }`;
      const output = await format(input);
      assert.match(output, /trait Collection\[T\]/);
    });
  });

  describe("Case Classes", () => {
    test("simple case class", async () => {
      const input = `case class Person(name: String, age: Int)`;
      const output = await format(input);
      assert.match(output, /case class Person/);
    });

    test("case class with type parameters", async () => {
      const input = `case class Option[T](value: T)`;
      const output = await format(input);
      assert.match(output, /case class Option\[T\]/);
    });
  });

  describe("Constructor calls (new)", () => {
    test("simple constructor call", async () => {
      const input = `val person = new Person("Alice", 30)`;
      const output = await format(input);
      assert.equal(output, 'val person = new Person("Alice", 30)');
    });

    test("constructor with type parameters", async () => {
      const input = `val list = new List[Int]()`;
      const output = await format(input);
      assert.equal(output, "val list = new List[Int]()");
    });

    test("constructor without arguments", async () => {
      const input = `val obj = new Object`;
      const output = await format(input);
      assert.equal(output, "val obj = new Object");
    });
  });

  describe("Pattern Matching", () => {
    test("simple match expression", async () => {
      const input = `x match { case 1 => "one" case 2 => "two" case _ => "other" }`;
      const output = await format(input);
      assert.match(output, /match \{/);
      assert.match(output, /case 1 => "one"/);
      assert.match(output, /case _ => "other"/);
    });

    test("match with guard", async () => {
      const input = `x match { case n if n > 0 => "positive" case _ => "non-positive" }`;
      const output = await format(input);
      assert.match(output, /case n if n > 0 =>/);
    });
  });

  describe("For Comprehensions", () => {
    test("simple for loop", async () => {
      const input = `for (i <- 1 to 10) println(i)`;
      const output = await format(input);
      assert.match(output, /for \(i <- 1 to 10\)/);
    });

    test("for yield", async () => {
      const input = `for (i <- 1 to 10) yield i * 2`;
      const output = await format(input);
      assert.match(output, /for \(i <- 1 to 10\) yield/);
    });

    test("for with guard", async () => {
      const input = `for (i <- 1 to 10 if i % 2 == 0) yield i`;
      const output = await format(input);
      assert.match(output, /if i % 2 == 0/);
    });
  });

  describe("Method calls", () => {
    test("method call with arguments", async () => {
      const input = `list.map(x => x * 2)`;
      const output = await format(input);
      assert.match(output, /\.map\(/);
    });
  });

  describe("Enum Definitions (Scala 3)", () => {
    test("simple enum", async () => {
      const input = `enum Color { case Red case Green case Blue }`;
      const output = await format(input);
      assert.match(output, /enum Color \{/);
      assert.match(output, /case Red/);
      assert.match(output, /case Green/);
      assert.match(output, /case Blue/);
    });

    test("enum with parameters", async () => {
      const input = `enum Planet { case Earth }`;
      const output = await format(input);
      assert.match(output, /enum Planet/);
      assert.match(output, /case Earth/);
    });

    test("generic enum", async () => {
      const input = `enum Option[+T] { case Some(value: T) case None }`;
      const output = await format(input);
      assert.match(output, /enum Option\[\+T\]/);
      assert.match(output, /case Some\(/);
      assert.match(output, /case None/);
    });
  });

  describe("Extension Methods (Scala 3)", () => {
    test("simple extension method", async () => {
      const input = `extension (s: String) { def double: String = s + s }`;
      const output = await format(input);
      assert.match(output, /extension \(s: String\) \{/);
      assert.match(output, /def double: String = s \+ s/);
    });

    test("extension with type parameters", async () => {
      const input = `extension [T](list: List[T]) { def head: T = list(0) }`;
      const output = await format(input);
      assert.match(output, /extension\[T\] \(list: List\[T\]\) \{/);
      assert.match(output, /def head: T = list\(0\)/);
    });
  });
});

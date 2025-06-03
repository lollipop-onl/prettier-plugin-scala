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

describe("Phase 3 Features", () => {
  describe("Logical Operators", () => {
    test("logical AND operator", async () => {
      const input = `val result = a && b`;
      const output = await format(input);
      assert.equal(output, "val result = a && b");
    });

    test("logical OR operator", async () => {
      const input = `val result = a || b`;
      const output = await format(input);
      assert.equal(output, "val result = a || b");
    });

    test("complex logical expressions", async () => {
      const input = `val complex = (a && b) || (c && d)`;
      const output = await format(input);
      assert.equal(output, "val complex = (a && b) || (c && d)");
    });

    test("logical operators with comparisons", async () => {
      const input = `val isValid = x > 0 && x < 100`;
      const output = await format(input);
      assert.equal(output, "val isValid = x > 0 && x < 100");
    });
  });

  describe("String Interpolation", () => {
    test("s-string interpolation", async () => {
      const input = `val message = s"Hello, $name"`;
      const output = await format(input);
      assert.equal(output, `val message = s"Hello, $name"`);
    });

    test("f-string interpolation", async () => {
      const input = `val formatted = f"Value: $value%.2f"`;
      const output = await format(input);
      assert.equal(output, `val formatted = f"Value: $value%.2f"`);
    });

    test("string interpolation with expressions", async () => {
      const input = `val msg = s"Sum: \${a + b}"`;
      const output = await format(input);
      assert.equal(output, `val msg = s"Sum: \${a + b}"`);
    });

    test("raw string interpolation", async () => {
      const input = `val path = raw"C:\\\\Users\\\\$username"`;
      const output = await format(input);
      assert.equal(output, `val path = raw"C:\\\\Users\\\\$username"`);
    });
  });

  describe("Lambda Expressions", () => {
    test("simple lambda", async () => {
      const input = `val double = x => x * 2`;
      const output = await format(input);
      assert.equal(output, "val double = x => x * 2");
    });

    test.skip("lambda with type annotation", async () => {
      const input = `val add = (x: Int, y: Int) => x + y`;
      const output = await format(input);
      assert.equal(output, "val add = (x: Int, y: Int) => x + y");
    });

    test("lambda in method call", async () => {
      const input = `list.map(x => x * 2)`;
      const output = await format(input);
      assert.equal(output, "list.map(x => x * 2)");
    });

    test.skip("multiline lambda", async () => {
      const input = `list.map { x =>
  val doubled = x * 2
  doubled + 1
}`;
      const output = await format(input);
      assert.match(output, /list\.map/);
    });
  });

  describe("Infix Notation", () => {
    test("to operator", async () => {
      const input = `val range = 1 to 10`;
      const output = await format(input);
      assert.equal(output, "val range = 1 to 10");
    });

    test("cons operator", async () => {
      const input = `val list = 1 :: 2 :: Nil`;
      const output = await format(input);
      assert.equal(output, "val list = 1 :: 2 :: Nil");
    });

    test("append operator", async () => {
      const input = `val newList = list :+ element`;
      const output = await format(input);
      assert.equal(output, "val newList = list :+ element");
    });

    test("concat operator", async () => {
      const input = `val combined = list1 ++ list2`;
      const output = await format(input);
      assert.equal(output, "val combined = list1 ++ list2");
    });
  });

  describe("Apply Expressions", () => {
    test("class member initialization with apply", async () => {
      const input = `private val cache = Map[String, Int]()`;
      const output = await format(input);
      assert.equal(output, "private val cache = Map[String, Int]()");
    });

    test.skip("apply with arguments", async () => {
      const input = `val map = Map("a" -> 1, "b" -> 2)`;
      const output = await format(input);
      assert.equal(output, `val map = Map("a" -> 1, "b" -> 2)`);
    });

    test.skip("nested apply expressions", async () => {
      const input = `val nested = List(Map("key" -> "value"))`;
      const output = await format(input);
      assert.equal(output, `val nested = List(Map("key" -> "value"))`);
    });
  });

  describe("Given Definitions", () => {
    test("simple given definition", async () => {
      const input = `given intOrdering: Ordering[Int] = Ordering.Int`;
      const output = await format(input);
      assert.equal(output, "given intOrdering: Ordering[Int] = Ordering.Int");
    });

    test.skip("given without name", async () => {
      const input = `given Ordering[String] = Ordering.String`;
      const output = await format(input);
      assert.equal(output, "given Ordering[String] = Ordering.String");
    });

    test.skip("given with parameters", async () => {
      const input = `given listOrdering[T](using ord: Ordering[T]): Ordering[List[T]]`;
      const output = await format(input);
      assert.match(output, /given listOrdering/);
    });
  });

  describe("Auxiliary Constructors", () => {
    test.skip("auxiliary constructor with this", async () => {
      const input = `class Rectangle(width: Double, height: Double) {
  def this(size: Double) = this(size, size)
}`;
      const output = await format(input);
      assert.match(output, /def this/);
      assert.match(output, /= this\(size, size\)/);
    });

    test.skip("multiple auxiliary constructors", async () => {
      const input = `class Person(name: String, age: Int) {
  def this(name: String) = this(name, 0)
  def this() = this("Unknown", 0)
}`;
      const output = await format(input);
      assert.match(output, /def this\(name: String\)/);
      assert.match(output, /def this\(\)/);
    });
  });
});

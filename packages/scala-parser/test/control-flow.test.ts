import { parse } from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Control Flow Statements", () => {
  describe("If-Else Expressions", () => {
    it("should parse simple if-else", () => {
      const input = 'val result = if (x > 0) "positive" else "non-positive"';
      const result = parse(input);
      assert.strictEqual(result.errors.length, 0);
      assert(result.cst);
    });

    it("should parse if without else", () => {
      const input = "if (condition) doSomething()";
      const result = parse(input);
      assert.strictEqual(result.errors.length, 0);
      assert(result.cst);
    });

    it("should parse if-else with blocks", () => {
      const input = `val message = if (status == "success") {
        println("Operation completed")
        "Success!"
      } else {
        println("Operation failed")  
        "Error!"
      }`;
      const result = parse(input);
      assert.strictEqual(result.errors.length, 0);
      assert(result.cst);
    });
  });

  describe("While Loops", () => {
    it("should parse simple while loop", () => {
      const input = `while (i < 10) {
        println(i)
      }`;
      const result = parse(input);
      assert.strictEqual(result.errors.length, 0);
      assert(result.cst);
    });

    it("should parse while with single statement", () => {
      const input = "while (running) doWork()";
      const result = parse(input);
      assert.strictEqual(result.errors.length, 0);
      assert(result.cst);
    });
  });

  describe("Try-Catch-Finally", () => {
    it("should parse try-catch-finally", () => {
      const input = `val result = try {
        riskyOperation()
      } catch {
        case _ => "Error"
      } finally {
        cleanup()
      }`;
      const result = parse(input);
      assert.strictEqual(result.errors.length, 0);
      assert(result.cst);
    });

    it("should parse try-finally without catch", () => {
      const input = `try {
        doSomething()
      } finally {
        closeResources()
      }`;
      const result = parse(input);
      assert.strictEqual(result.errors.length, 0);
      assert(result.cst);
    });

    it("should parse try-catch without finally", () => {
      const input = `val value = try {
        Integer.parseInt(str)
      } catch {
        case _ => 0
      }`;
      const result = parse(input);
      assert.strictEqual(result.errors.length, 0);
      assert(result.cst);
    });
  });
});

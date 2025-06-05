import { parse } from "../dist/index.js";
import { describe, it, expect } from "vitest";

describe("Control Flow Statements", () => {
  describe("If-Else Expressions", () => {
    it("should parse simple if-else", () => {
      const input = 'val result = if (x > 0) "positive" else "non-positive"';
      const result = parse(input);
      expect(result.errors.length).toBe(0);
      expect(result.cst).toBeDefined();
    });

    it("should parse if without else", () => {
      const input = "if (condition) doSomething()";
      const result = parse(input);
      expect(result.errors.length).toBe(0);
      expect(result.cst).toBeDefined();
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
      expect(result.errors.length).toBe(0);
      expect(result.cst).toBeDefined();
    });
  });

  describe("While Loops", () => {
    it("should parse simple while loop", () => {
      const input = `while (i < 10) {
        println(i)
      }`;
      const result = parse(input);
      expect(result.errors.length).toBe(0);
      expect(result.cst).toBeDefined();
    });

    it("should parse while with single statement", () => {
      const input = "while (running) doWork()";
      const result = parse(input);
      expect(result.errors.length).toBe(0);
      expect(result.cst).toBeDefined();
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
      expect(result.errors.length).toBe(0);
      expect(result.cst).toBeDefined();
    });

    it("should parse try-finally without catch", () => {
      const input = `try {
        doSomething()
      } finally {
        closeResources()
      }`;
      const result = parse(input);
      expect(result.errors.length).toBe(0);
      expect(result.cst).toBeDefined();
    });

    it("should parse try-catch without finally", () => {
      const input = `val value = try {
        Integer.parseInt(str)
      } catch {
        case _ => 0
      }`;
      const result = parse(input);
      expect(result.errors.length).toBe(0);
      expect(result.cst).toBeDefined();
    });
  });
});

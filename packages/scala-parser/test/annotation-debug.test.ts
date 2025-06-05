import { parse } from "../src/index.js";
import { describe, it, expect } from "vitest";

describe("Annotation debug", () => {
  it("parses simple annotation", () => {
    const result = parse("@Test class MyTest");
    if (result.errors.length > 0) {
      console.log(
        "Simple annotation errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });

  it("parses annotation with arguments", () => {
    const result = parse('@Entity(name = "user") class User');
    if (result.errors.length > 0) {
      console.log(
        "Annotation with args errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });

  it("parses multiple parameter lists annotation", () => {
    const result = parse("@Inject() class MyService");
    if (result.errors.length > 0) {
      console.log(
        "Multiple param lists errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });

  it("parses complex annotation with constructor params", () => {
    const result = parse(
      "class MyController @Inject()(val components: ControllerComponents)",
    );
    if (result.errors.length > 0) {
      console.log(
        "Complex annotation errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });

  it("parses annotation chain", () => {
    const result = parse("@Inject() @Singleton class MyService");
    if (result.errors.length > 0) {
      console.log(
        "Annotation chain errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });

  it("parses method annotation in class", () => {
    const result = parse(`
      class MyController {
        @RequestMapping("/api/test")
        def testMethod(): String = "test"
      }
    `);
    if (result.errors.length > 0) {
      console.log(
        "Method annotation errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });
});

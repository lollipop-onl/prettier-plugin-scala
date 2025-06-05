import { parse } from "../src/index.js";
import { describe, it, expect } from "vitest";

describe("Constructor annotation debug", () => {
  it("parses simple class with basic constructor", () => {
    const result = parse("class MyController(val component: String)");
    if (result.errors.length > 0) {
      console.log(
        "Simple constructor errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });

  it("parses class with annotation before constructor", () => {
    const result = parse("@Entity class MyController(val component: String)");
    if (result.errors.length > 0) {
      console.log(
        "Annotation before constructor errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });

  it("parses class with multiple annotations", () => {
    const result = parse(
      "@Entity @Injectable class MyController(val component: String)",
    );
    if (result.errors.length > 0) {
      console.log(
        "Multiple annotations errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });

  it("parses step by step - annotation with empty parens", () => {
    const result = parse("@Inject() class MyController");
    if (result.errors.length > 0) {
      console.log(
        "Empty parens errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });

  it("parses DI pattern step 1 - annotation plus constructor", () => {
    const result = parse("class MyController @Inject()(val component: String)");
    if (result.errors.length > 0) {
      console.log(
        "DI pattern step 1 errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });
});

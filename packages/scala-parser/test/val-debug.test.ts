import { parse } from "../src/index.js";
import { describe, it, expect } from "vitest";

describe("Val definition debug", () => {
  it("parses val without type annotation", () => {
    const result = parse("val x = 5");
    expect(result.errors.length).toBe(0);
  });

  it("parses val with type annotation", () => {
    const result = parse("val x: Int = 5");
    if (result.errors.length > 0) {
      console.log("Parse errors:", result.errors);
    }
    expect(result.errors.length).toBe(0);
  });

  it("parses val with complex type", () => {
    const result = parse("val list: List[Int] = List(1, 2, 3)");
    if (result.errors.length > 0) {
      console.log("Parse errors:", result.errors);
    }
    expect(result.errors.length).toBe(0);
  });

  it("parses val with tuple pattern", () => {
    const result = parse("val (x, y) = (1, 2)");
    if (result.errors.length > 0) {
      console.log("Parse errors:", result.errors);
    }
    expect(result.errors.length).toBe(0);
  });
});

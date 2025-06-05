import { parse } from "../src/index.js";
import { describe, it, expect } from "vitest";

describe("Debug type parsing", () => {
  it("parses simple type annotation", () => {
    const result = parse("val x: Int = 5");
    console.log("Errors:", result.errors);
    expect(result.errors.length).toBe(0);
  });

  it("parses qualified type annotation", () => {
    const result = parse('val x: String = "hello"');
    console.log("Errors:", result.errors);
    expect(result.errors.length).toBe(0);
  });

  it("parses context function type", () => {
    const result = parse("val f: String ?=> Int = str => str.length");
    console.log("Errors:", result.errors);
    expect(result.errors.length).toBe(0);
  });

  it("parses method with context function parameter", () => {
    const result = parse("def run(body: ExecutionContext ?=> T): T = ???");
    console.log("Errors:", result.errors);
    expect(result.errors.length).toBe(0);
  });
});

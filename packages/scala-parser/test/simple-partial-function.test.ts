import { parse } from "../src/index.js";
import { describe, it, expect } from "vitest";

describe("Simple PartialFunction test", () => {
  it("should parse simplest PartialFunction literal", () => {
    const code = `val pf = {
  case x => x
}`;

    try {
      const result = parse(code);
      expect(result).toBeDefined();
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should debug token recognition", () => {
    const code = `{
  case x => x
}`;

    try {
      const result = parse(code);
      expect(result).toBeDefined();
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });
});

import { lexerInstance } from "../src/lexer.js";
import { describe, it, expect } from "vitest";

describe("Minimal val test", () => {
  it("tokenizes val x: Int = 5", () => {
    const code = "val x: Int = 5";
    const result = lexerInstance.tokenize(code);

    console.log("Tokens:");
    result.tokens.forEach((token, i) => {
      console.log(`  ${i}: ${token.tokenType.name} = "${token.image}"`);
    });

    expect(result.errors.length).toBe(0);
    expect(result.tokens.length).toBeGreaterThan(0);
  });
});

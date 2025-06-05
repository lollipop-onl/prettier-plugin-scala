import { ScalaLexer } from "../src/lexer.js";
import { describe, it, expect } from "vitest";

describe("Simple brace tokenization", () => {
  it("tokenizes just braces", () => {
    const code = "{}";
    const result = ScalaLexer.tokenize(code);

    console.log("Tokens for '{}':");
    result.tokens.forEach((token, i) => {
      console.log(`  ${i}: ${token.tokenType.name} = "${token.image}"`);
    });

    expect(result.errors.length).toBe(0);
  });

  it("tokenizes letter and brace", () => {
    const code = "A}";
    const result = ScalaLexer.tokenize(code);

    console.log("Tokens for 'A}':");
    result.tokens.forEach((token, i) => {
      console.log(`  ${i}: ${token.tokenType.name} = "${token.image}"`);
    });

    expect(result.errors.length).toBe(0);
  });

  it("tokenizes space separated", () => {
    const code = "A }";
    const result = ScalaLexer.tokenize(code);

    console.log("Tokens for 'A }':");
    result.tokens.forEach((token, i) => {
      console.log(`  ${i}: ${token.tokenType.name} = "${token.image}"`);
    });

    expect(result.errors.length).toBe(0);
  });
});

import { ScalaLexer } from "../src/lexer.js";
import { describe, it, expect } from "vitest";

describe("Export tokenization debug", () => {
  it("tokenizes export mypackage.{A}", () => {
    const code = "export mypackage.{A}";
    const result = ScalaLexer.tokenize(code);

    console.log("Tokens for 'export mypackage.{A}':");
    result.tokens.forEach((token, i) => {
      console.log(`  ${i}: ${token.tokenType.name} = "${token.image}"`);
    });

    expect(result.errors.length).toBe(0);
    expect(result.tokens.length).toBeGreaterThan(0);
  });

  it("tokenizes export mypackage.{A, B}", () => {
    const code = "export mypackage.{A, B}";
    const result = ScalaLexer.tokenize(code);

    console.log("Tokens for 'export mypackage.{A, B}':");
    result.tokens.forEach((token, i) => {
      console.log(`  ${i}: ${token.tokenType.name} = "${token.image}"`);
    });

    expect(result.errors.length).toBe(0);
    expect(result.tokens.length).toBeGreaterThan(0);
  });

  it("tokenizes export mypackage.{A => RenamedA}", () => {
    const code = "export mypackage.{A => RenamedA}";
    const result = ScalaLexer.tokenize(code);

    console.log("Tokens for 'export mypackage.{A => RenamedA}':");
    result.tokens.forEach((token, i) => {
      console.log(`  ${i}: ${token.tokenType.name} = "${token.image}"`);
    });

    expect(result.errors.length).toBe(0);
    expect(result.tokens.length).toBeGreaterThan(0);
  });
});

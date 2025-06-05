import { ScalaLexer } from "../src/lexer.js";
import { describe, it, expect } from "vitest";

describe("DI pattern tokenization debug", () => {
  it("tokenizes class MyController @Inject()(val component: String)", () => {
    const code = "class MyController @Inject()(val component: String)";
    const result = ScalaLexer.tokenize(code);

    console.log("Tokens for DI pattern:");
    result.tokens.forEach((token, i) => {
      console.log(`  ${i}: ${token.tokenType.name} = "${token.image}"`);
    });

    expect(result.errors.length).toBe(0);
    expect(result.tokens.length).toBeGreaterThan(0);
  });

  it("tokenizes @Inject() separately", () => {
    const code = "@Inject()";
    const result = ScalaLexer.tokenize(code);

    console.log("Tokens for '@Inject()':");
    result.tokens.forEach((token, i) => {
      console.log(`  ${i}: ${token.tokenType.name} = "${token.image}"`);
    });

    expect(result.errors.length).toBe(0);
  });

  it("tokenizes (val component: String) separately", () => {
    const code = "(val component: String)";
    const result = ScalaLexer.tokenize(code);

    console.log("Tokens for constructor params:");
    result.tokens.forEach((token, i) => {
      console.log(`  ${i}: ${token.tokenType.name} = "${token.image}"`);
    });

    expect(result.errors.length).toBe(0);
  });
});

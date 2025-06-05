import { lexerInstance } from "../src/lexer.js";
import { parserInstance } from "../src/parser.js";
import { describe, it, expect } from "vitest";

describe("Simple debug", () => {
  it("lexes val definition", () => {
    const code = "val x: Int = 5";
    const lexResult = lexerInstance.tokenize(code);
    console.log(
      "Tokens:",
      lexResult.tokens.map((t) => `${t.tokenType.name}(${t.image})`),
    );
    expect(lexResult.errors.length).toBe(0);
  });

  it("parses val definition step by step", () => {
    const code = "val x: Int = 5";
    const lexResult = lexerInstance.tokenize(code);
    console.log(
      "Tokens:",
      lexResult.tokens.map((t) => `${t.tokenType.name}(${t.image})`),
    );

    parserInstance.input = lexResult.tokens;
    try {
      const cst = parserInstance.compilationUnit();
      console.log("Parse successful");
    } catch (e) {
      console.log("Parse error:", e);
      console.log("Parser errors:", parserInstance.errors);
    }
  });
});

import { ScalaLexer } from "../dist/index.js";
import { describe, it, expect } from "vitest";

describe("ScalaLexer", () => {
  it("should tokenize keywords", () => {
    const input = "class object def val var";
    const result = ScalaLexer.tokenize(input);

    expect(result.errors.length).toBe(0);
    expect(result.tokens.length).toBe(5);
    expect(result.tokens[0].tokenType.name).toBe("Class");
    expect(result.tokens[1].tokenType.name).toBe("Object");
    expect(result.tokens[2].tokenType.name).toBe("Def");
    expect(result.tokens[3].tokenType.name).toBe("Val");
    expect(result.tokens[4].tokenType.name).toBe("Var");
  });

  it("should tokenize identifiers", () => {
    const input = "myVariable underscore camelCase";
    const result = ScalaLexer.tokenize(input);

    expect(result.errors.length).toBe(0);
    expect(result.tokens.length).toBe(3);
    result.tokens.forEach((token) => {
      expect(token.tokenType.name).toBe("Identifier");
    });
  });

  it("should tokenize literals", () => {
    const input = "42 3.14 \"hello\" 'c'";
    const result = ScalaLexer.tokenize(input);

    expect(result.errors.length).toBe(0);
    expect(result.tokens.length).toBe(4);
    expect(result.tokens[0].tokenType.name).toBe("IntegerLiteral");
    expect(result.tokens[1].tokenType.name).toBe("FloatingPointLiteral");
    expect(result.tokens[2].tokenType.name).toBe("StringLiteral");
    expect(result.tokens[3].tokenType.name).toBe("CharLiteral");
  });

  it("should tokenize operators", () => {
    const input = "= + - * / < > <= >= == != => <-";
    const result = ScalaLexer.tokenize(input);

    expect(result.errors.length).toBe(0);
    expect(result.tokens.length).toBe(13);
  });

  it("should tokenize delimiters", () => {
    const input = "() [] {}";
    const result = ScalaLexer.tokenize(input);

    expect(result.errors.length).toBe(0);
    expect(result.tokens.length).toBe(6);
    expect(result.tokens[0].tokenType.name).toBe("LeftParen");
    expect(result.tokens[1].tokenType.name).toBe("RightParen");
    expect(result.tokens[2].tokenType.name).toBe("LeftBracket");
    expect(result.tokens[3].tokenType.name).toBe("RightBracket");
    expect(result.tokens[4].tokenType.name).toBe("LeftBrace");
    expect(result.tokens[5].tokenType.name).toBe("RightBrace");
  });

  it("should handle comments", () => {
    const input = `// line comment
    val x = 42 /* block comment */ + 1`;
    const result = ScalaLexer.tokenize(input);

    expect(result.errors.length).toBe(0);
    // Comments are in a separate group
    expect(result.groups.comments.length).toBe(2);
  });

  it("should tokenize negation operator", () => {
    const input = "!true !isEmpty !(a && b)";
    const result = ScalaLexer.tokenize(input);

    expect(result.errors.length).toBe(0);
    const exclamationTokens = result.tokens.filter(
      (t) => t.tokenType.name === "Exclamation",
    );
    expect(exclamationTokens.length).toBe(3);
  });

  it("should tokenize logical operators", () => {
    const input = "&& || !";
    const result = ScalaLexer.tokenize(input);

    expect(result.errors.length).toBe(0);
    expect(result.tokens[0].tokenType.name).toBe("LogicalAnd");
    expect(result.tokens[1].tokenType.name).toBe("LogicalOr");
    expect(result.tokens[2].tokenType.name).toBe("Exclamation");
  });

  it("should tokenize string interpolation", () => {
    const input = 's"Hello $name" f"Value: $x%.2f" raw"Path: $path"';
    const result = ScalaLexer.tokenize(input);

    expect(result.errors.length).toBe(0);

    // Check for specific interpolation types
    const sStrings = result.tokens.filter(
      (t) => t.tokenType.name === "InterpolatedString",
    );
    const fStrings = result.tokens.filter(
      (t) => t.tokenType.name === "FormattedString",
    );
    const rawStrings = result.tokens.filter(
      (t) => t.tokenType.name === "RawString",
    );

    expect(sStrings.length).toBe(1);
    expect(fStrings.length).toBe(1);
    expect(rawStrings.length).toBe(1);

    // Total interpolated strings should be 3
    expect(sStrings.length + fStrings.length + rawStrings.length).toBe(3);
  });

  it("should tokenize a simple class definition", () => {
    const input = "class Person(name: String) { def getName(): String = name }";
    const result = ScalaLexer.tokenize(input);

    expect(result.errors.length).toBe(0);
    expect(result.tokens[0].tokenType.name).toBe("Class");
    expect(result.tokens[1].tokenType.name).toBe("Identifier");
    expect(result.tokens[1].image).toBe("Person");
  });
});

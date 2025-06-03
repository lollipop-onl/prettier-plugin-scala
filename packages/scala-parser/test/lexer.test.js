import { ScalaLexer } from "../lib/lexer.js";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("ScalaLexer", () => {
  it("should tokenize keywords", () => {
    const input = "class object def val var";
    const result = ScalaLexer.tokenize(input);

    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.tokens.length, 5);
    assert.strictEqual(result.tokens[0].tokenType.name, "Class");
    assert.strictEqual(result.tokens[1].tokenType.name, "Object");
    assert.strictEqual(result.tokens[2].tokenType.name, "Def");
    assert.strictEqual(result.tokens[3].tokenType.name, "Val");
    assert.strictEqual(result.tokens[4].tokenType.name, "Var");
  });

  it("should tokenize identifiers", () => {
    const input = "myVariable underscore camelCase";
    const result = ScalaLexer.tokenize(input);

    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.tokens.length, 3);
    result.tokens.forEach((token) => {
      assert.strictEqual(token.tokenType.name, "Identifier");
    });
  });

  it("should tokenize literals", () => {
    const input = "42 3.14 \"hello\" 'c'";
    const result = ScalaLexer.tokenize(input);

    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.tokens.length, 4);
    assert.strictEqual(result.tokens[0].tokenType.name, "IntegerLiteral");
    assert.strictEqual(result.tokens[1].tokenType.name, "FloatingPointLiteral");
    assert.strictEqual(result.tokens[2].tokenType.name, "StringLiteral");
    assert.strictEqual(result.tokens[3].tokenType.name, "CharLiteral");
  });

  it("should tokenize operators", () => {
    const input = "= + - * / < > <= >= == != => <-";
    const result = ScalaLexer.tokenize(input);

    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.tokens.length, 13);
  });

  it("should tokenize delimiters", () => {
    const input = "() [] {}";
    const result = ScalaLexer.tokenize(input);

    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.tokens.length, 6);
    assert.strictEqual(result.tokens[0].tokenType.name, "LeftParen");
    assert.strictEqual(result.tokens[1].tokenType.name, "RightParen");
    assert.strictEqual(result.tokens[2].tokenType.name, "LeftBracket");
    assert.strictEqual(result.tokens[3].tokenType.name, "RightBracket");
    assert.strictEqual(result.tokens[4].tokenType.name, "LeftBrace");
    assert.strictEqual(result.tokens[5].tokenType.name, "RightBrace");
  });

  it("should handle comments", () => {
    const input = `// line comment
    val x = 42 /* block comment */ + 1`;
    const result = ScalaLexer.tokenize(input);

    assert.strictEqual(result.errors.length, 0);
    // Comments are in a separate group
    assert.strictEqual(result.groups.comments.length, 2);
  });

  it("should tokenize negation operator", () => {
    const input = "!true !isEmpty !(a && b)";
    const result = ScalaLexer.tokenize(input);

    assert.strictEqual(result.errors.length, 0);
    const exclamationTokens = result.tokens.filter(
      (t) => t.tokenType.name === "Exclamation",
    );
    assert.strictEqual(exclamationTokens.length, 3);
  });

  it("should tokenize logical operators", () => {
    const input = "&& || !";
    const result = ScalaLexer.tokenize(input);

    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.tokens[0].tokenType.name, "LogicalAnd");
    assert.strictEqual(result.tokens[1].tokenType.name, "LogicalOr");
    assert.strictEqual(result.tokens[2].tokenType.name, "Exclamation");
  });

  it("should tokenize string interpolation", () => {
    const input = 's"Hello $name" f"Value: $x%.2f" raw"Path: $path"';
    const result = ScalaLexer.tokenize(input);

    assert.strictEqual(result.errors.length, 0);
    const interpolatedStrings = result.tokens.filter(
      (t) => t.tokenType.name === "InterpolatedStringLiteral",
    );
    assert.strictEqual(interpolatedStrings.length, 3);
  });

  it("should tokenize a simple class definition", () => {
    const input = "class Person(name: String) { def getName(): String = name }";
    const result = ScalaLexer.tokenize(input);

    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.tokens[0].tokenType.name, "Class");
    assert.strictEqual(result.tokens[1].tokenType.name, "Identifier");
    assert.strictEqual(result.tokens[1].image, "Person");
  });
});

import { parse } from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Quotes and Splices parsing", () => {
  it("parses basic quote expression", () => {
    const result = parse("val quoted = '{ 1 + 2 }");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 1);
  });

  it("parses basic splice expression", () => {
    const result = parse("val spliced = ${ x + y }");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses quote with identifier", () => {
    const result = parse('val expr = \'{ println("hello") }');
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses splice with variable", () => {
    const result = parse("val result = ${ myVariable }");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses quote with method call", () => {
    const result = parse("val methodQuote = '{ list.map(toString) }");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses splice in method parameter", () => {
    const result = parse("def test(x: Int) = println(${ x })");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses nested quotes and splices", () => {
    const result = parse("val nested = '{ ${ x } + 1 }");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses quote with complex expression", () => {
    const result = parse("val complex = '{ x + 1 }");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses splice with function call", () => {
    const result = parse("val funcSplice = ${ calculate(a, b) }");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses quote in return statement", () => {
    const result = parse("def getQuote = '{ 42 }");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses multiple quotes and splices", () => {
    const code = `
val quote1 = '{ x + 1 }
val splice1 = \${ y * 2 }
val quote2 = '{ println("test") }
`;
    const result = parse(code);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 3);
  });

  it("parses quote with arithmetic operations", () => {
    const result = parse("val arithmetic = '{ a * b + c / d }");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });
});

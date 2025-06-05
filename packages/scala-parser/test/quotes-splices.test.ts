import { parse } from "../dist/index.js";
import { describe, it, expect } from "vitest";

describe("Quotes and Splices parsing", () => {
  it("parses basic quote expression", () => {
    const result = parse("val quoted = '{ 1 + 2 }");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
    expect(result.cst.children.topLevelDefinition.length).toBe(1);
  });

  it("parses basic splice expression", () => {
    const result = parse("val spliced = ${ x + y }");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses quote with identifier", () => {
    const result = parse('val expr = \'{ println("hello") }');
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses splice with variable", () => {
    const result = parse("val result = ${ myVariable }");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses quote with method call", () => {
    const result = parse("val methodQuote = '{ list.map(toString) }");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses splice in method parameter", () => {
    const result = parse("def test(x: Int) = println(${ x })");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses nested quotes and splices", () => {
    const result = parse("val nested = '{ ${ x } + 1 }");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses quote with complex expression", () => {
    const result = parse("val complex = '{ x + 1 }");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses splice with function call", () => {
    const result = parse("val funcSplice = ${ calculate(a, b) }");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses quote in return statement", () => {
    const result = parse("def getQuote = '{ 42 }");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses multiple quotes and splices", () => {
    const code = `
val quote1 = '{ x + 1 }
val splice1 = \${ y * 2 }
val quote2 = '{ println("test") }
`;
    const result = parse(code);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition.length).toBe(3);
  });

  it("parses quote with arithmetic operations", () => {
    const result = parse("val arithmetic = '{ a * b + c / d }");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });
});

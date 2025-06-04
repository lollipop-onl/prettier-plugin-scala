import { parse } from "../lib/index.js";
import { describe, it, expect } from "vitest";

describe("Match types parsing", () => {
  it("parses basic match type", () => {
    const result = parse("type Elem[X] = X match { case String => Char }");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
    expect(result.cst.children.topLevelDefinition.length).toBe(1);
  });

  it("parses multiple match type cases", () => {
    const result = parse(`type Elem[X] = X match {
      case String => Char
      case Array[t] => t
    }`);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses complex match type with generic patterns", () => {
    const result = parse(`type Head[X] = X match {
      case List[h] => h
      case EmptyTuple => Nothing
    }`);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses nested match types", () => {
    const result = parse(`type Flatten[X] = X match {
      case Array[Array[t]] => Array[t]
      case Array[t] => Array[t]
      case t => t
    }`);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses match type with union result", () => {
    const result = parse(`type StringOrChar[X] = X match {
      case String => Char
      case Int => String | Char
    }`);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses match type with intersection result", () => {
    const result = parse(`type Combined[X] = X match {
      case String => Named & Aged
      case Int => String
    }`);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses single case match type", () => {
    const result = parse("type Single[X] = X match { case Any => String }");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses match type with type parameters", () => {
    const result = parse(`type Map[K, V] = (K, V) match {
      case (String, Int) => StringIntMap
      case (String, String) => StringStringMap
    }`);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses match type with complex input type", () => {
    const result = parse(`type Result[X] = List[X] | Option[X] match {
      case List[String] => Char
      case Option[Int] => Boolean
    }`);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses multiple match type definitions", () => {
    const code = `
type Elem[X] = X match { case String => Char }
type Size[X] = X match { case Array[t] => Int }
type Head[X] = X match { case List[h] => h }
`;
    const result = parse(code);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition.length).toBe(3);
  });
});

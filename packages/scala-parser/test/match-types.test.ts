import { parse } from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Match types parsing", () => {
  it("parses basic match type", () => {
    const result = parse("type Elem[X] = X match { case String => Char }");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 1);
  });

  it("parses multiple match type cases", () => {
    const result = parse(`type Elem[X] = X match {
      case String => Char
      case Array[t] => t
    }`);
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses complex match type with generic patterns", () => {
    const result = parse(`type Head[X] = X match {
      case List[h] => h
      case EmptyTuple => Nothing
    }`);
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses nested match types", () => {
    const result = parse(`type Flatten[X] = X match {
      case Array[Array[t]] => Array[t]
      case Array[t] => Array[t]
      case t => t
    }`);
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses match type with union result", () => {
    const result = parse(`type StringOrChar[X] = X match {
      case String => Char
      case Int => String | Char
    }`);
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses match type with intersection result", () => {
    const result = parse(`type Combined[X] = X match {
      case String => Named & Aged
      case Int => String
    }`);
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses single case match type", () => {
    const result = parse("type Single[X] = X match { case Any => String }");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses match type with type parameters", () => {
    const result = parse(`type Map[K, V] = (K, V) match {
      case (String, Int) => StringIntMap
      case (String, String) => StringStringMap
    }`);
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses match type with complex input type", () => {
    const result = parse(`type Result[X] = List[X] | Option[X] match {
      case List[String] => Char
      case Option[Int] => Boolean
    }`);
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.topLevelDefinition);
  });

  it("parses multiple match type definitions", () => {
    const code = `
type Elem[X] = X match { case String => Char }
type Size[X] = X match { case Array[t] => Int }
type Head[X] = X match { case List[h] => h }
`;
    const result = parse(code);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.cst.children.topLevelDefinition.length, 3);
  });
});

import { parse } from "../lib/index.js";
import { describe, it, expect } from "vitest";

describe("Kind Projector parsing", () => {
  it("parses basic Kind Projector notation", () => {
    const result = parse("type StringMap[V] = Map[String, *]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
    expect(result.cst.children.topLevelDefinition.length).toBe(1);
  });

  it("parses Kind Projector with single placeholder", () => {
    const result = parse("type ListFunctor = List[*]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses Kind Projector with multiple placeholders", () => {
    const result = parse("type Function2Partial[R] = Function2[*, *, R]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses Kind Projector at beginning of type params", () => {
    const result = parse("type EitherLeft[R] = Either[*, R]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses Kind Projector in nested types", () => {
    const result = parse("type NestedMap = Map[String, List[*]]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses Kind Projector with concrete types", () => {
    const result = parse("type MixedTypes = Map[String, Either[Int, *]]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses Kind Projector in complex type definition", () => {
    const result = parse(
      "type ComplexType[A] = List[Map[String, Either[A, *]]]",
    );
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses multiple Kind Projector type definitions", () => {
    const code = `
type StringMap = Map[String, *]
type IntList = List[*]
type EitherString = Either[String, *]
`;
    const result = parse(code);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition.length).toBe(3);
  });

  it("parses Kind Projector with type bounds", () => {
    const result = parse("type BoundedMap[T <: AnyRef] = Map[T, *]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses Kind Projector with variance annotations", () => {
    const result = parse("type CovariantMap[+V] = Map[String, *]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses Kind Projector with union types", () => {
    const result = parse("type UnionMap = Map[String | Int, *]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });

  it("parses Kind Projector with intersection types", () => {
    const result = parse("type IntersectionMap = Map[Named & Aged, *]");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.topLevelDefinition).toBeDefined();
  });
});

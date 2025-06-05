// import { parse } from "../dist/index.js";
// import { describe, it, expect } from "vitest";

// describe("Type lambdas parsing", () => {
//   it("parses basic type lambda", () => {
//     const result = parse("type Identity = [X] =>> X");
//     expect(result.errors.length).toBe(0);
//     expect(result.cst.children.topLevelDefinition).toBeDefined();
//     expect(result.cst.children.topLevelDefinition.length).toBe(1);
//   });

//   it("parses type lambda with single parameter", () => {
//     const result = parse("type Identity = [X] =>> X");
//     expect(result.errors.length).toBe(0);
//     expect(result.cst.children.topLevelDefinition).toBeDefined();
//   });

//   it("parses type lambda with multiple parameters", () => {
//     const result = parse("type BinaryTypeFunction = [X, Y] =>> Map[X, Y]");
//     expect(result.errors.length).toBe(0);
//     expect(result.cst.children.topLevelDefinition).toBeDefined();
//   });

//   it("parses type lambda with variance annotations", () => {
//     const result = parse("type CovariantFunction = [+X] =>> List[X]");
//     expect(result.errors.length).toBe(0);
//     expect(result.cst.children.topLevelDefinition).toBeDefined();
//   });

//   it("parses type lambda with contravariant annotation", () => {
//     const result = parse(
//       "type ContravariantFunction = [-X] =>> Function[X, String]",
//     );
//     expect(result.errors.length).toBe(0);
//     expect(result.cst.children.topLevelDefinition).toBeDefined();
//   });

//   it("parses type lambda with type bounds", () => {
//     const result = parse("type BoundedFunction = [X <: AnyRef] =>> Option[X]");
//     expect(result.errors.length).toBe(0);
//     expect(result.cst.children.topLevelDefinition).toBeDefined();
//   });

//   it("parses type lambda with lower type bounds", () => {
//     const result = parse(
//       "type LowerBoundedFunction = [X >: Nothing] =>> List[X]",
//     );
//     expect(result.errors.length).toBe(0);
//     expect(result.cst.children.topLevelDefinition).toBeDefined();
//   });

//   it("parses complex type lambda with multiple constraints", () => {
//     const result = parse(
//       "type ComplexFunction = [+X <: AnyRef, -Y >: Nothing] =>> Map[X, Y]",
//     );
//     expect(result.errors.length).toBe(0);
//     expect(result.cst.children.topLevelDefinition).toBeDefined();
//   });

//   it("parses nested type lambda", () => {
//     const result = parse("type NestedFunction = [F] =>> [X] =>> F");
//     expect(result.errors.length).toBe(0);
//     expect(result.cst.children.topLevelDefinition).toBeDefined();
//   });

//   it("parses type lambda with union result type", () => {
//     const result = parse("type UnionFunction = [X] =>> X | String");
//     expect(result.errors.length).toBe(0);
//     expect(result.cst.children.topLevelDefinition).toBeDefined();
//   });

//   it("parses type lambda with intersection result type", () => {
//     const result = parse(
//       "type IntersectionFunction = [X] =>> X & Serializable",
//     );
//     expect(result.errors.length).toBe(0);
//     expect(result.cst.children.topLevelDefinition).toBeDefined();
//   });

//   it("parses multiple type lambda definitions", () => {
//     const code = `
// type Identity = [X] =>> X
// type ConstFunction = [X, Y] =>> X
// `;
//     const result = parse(code);
//     expect(result.errors.length).toBe(0);
//     expect(result.cst.children.topLevelDefinition.length).toBe(2);
//   });
// });

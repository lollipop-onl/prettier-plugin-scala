import { parse } from "../dist/index.js";
import { describe, it, expect } from "vitest";

describe("Export statements parsing", () => {
  it("parses basic wildcard export", () => {
    const result = parse("export mypackage._");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.exportClause).toBeDefined();
    expect(result.cst.children.exportClause.length).toBe(1);
  });

  it("parses export with selectors", () => {
    const result = parse("export mypackage.{A, B, C}");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.exportClause).toBeDefined();
    expect(result.cst.children.exportClause.length).toBe(1);
  });

  it("parses export with renaming", () => {
    const result = parse("export mypackage.{A => RenamedA}");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.exportClause).toBeDefined();
  });

  it("parses export with exclusion", () => {
    const result = parse("export mypackage.{A => _}");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.exportClause).toBeDefined();
  });

  it("parses export given instances", () => {
    const result = parse("export mypackage.{given, _}");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.exportClause).toBeDefined();
  });

  it("parses export only given", () => {
    const result = parse("export mypackage.given");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.exportClause).toBeDefined();
  });

  it("parses multiple nested export", () => {
    const result = parse("export scala.collection.{List, Map => ScalaMap}");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.exportClause).toBeDefined();
  });

  it("parses complex export with package path", () => {
    const result = parse("export cats.effect.{IO, Resource => CatsResource}");
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.exportClause).toBeDefined();
  });

  it("parses multiple export statements", () => {
    const code = `
export mypackage._
export scala.collection.List
export cats.effect.{IO, Resource}
    `;
    const result = parse(code);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.exportClause.length).toBe(3);
  });

  it("export statements should not cause parsing errors", () => {
    const code = `
package mypackage

import scala.collection.List
export scala.util._

class TestClass
    `;
    const result = parse(code);
    expect(result.errors.length).toBe(0);
    expect(result.cst.children.exportClause.length).toBe(1);
  });
});

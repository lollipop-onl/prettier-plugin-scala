import { parse } from "../lib/index.js";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Export statements parsing", () => {
  it("parses basic wildcard export", () => {
    const result = parse("export mypackage._");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.exportClause);
    assert.strictEqual(result.cst.children.exportClause.length, 1);
  });

  it("parses export with selectors", () => {
    const result = parse("export mypackage.{A, B, C}");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.exportClause);
    assert.strictEqual(result.cst.children.exportClause.length, 1);
  });

  it("parses export with renaming", () => {
    const result = parse("export mypackage.{A => RenamedA}");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.exportClause);
  });

  it("parses export with exclusion", () => {
    const result = parse("export mypackage.{A => _}");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.exportClause);
  });

  it("parses export given instances", () => {
    const result = parse("export mypackage.{given, _}");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.exportClause);
  });

  it("parses export only given", () => {
    const result = parse("export mypackage.given");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.exportClause);
  });

  it("parses multiple nested export", () => {
    const result = parse("export scala.collection.{List, Map => ScalaMap}");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.exportClause);
  });

  it("parses complex export with package path", () => {
    const result = parse("export cats.effect.{IO, Resource => CatsResource}");
    assert.strictEqual(result.errors.length, 0);
    assert(result.cst.children.exportClause);
  });

  it("parses multiple export statements", () => {
    const code = `
export mypackage._
export scala.collection.List
export cats.effect.{IO, Resource}
    `;
    const result = parse(code);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.cst.children.exportClause.length, 3);
  });

  it("export statements should not cause parsing errors", () => {
    const code = `
package mypackage

import scala.collection.List
export scala.util._

class TestClass
    `;
    const result = parse(code);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.cst.children.exportClause.length, 1);
  });
});

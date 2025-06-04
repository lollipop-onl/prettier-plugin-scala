import plugin from "../lib/index.js";
import { format } from "prettier";
import { describe, it, expect } from "vitest";

describe("Export statements formatting", () => {
  const formatCode = (code, options = {}) => {
    return format(code, {
      parser: "scala",
      plugins: [plugin],
      ...options,
    });
  };

  it("formats basic wildcard export", async () => {
    const code = "export mypackage._";
    const expected = "export mypackage._\n\n\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats export with selectors", async () => {
    const code = "export mypackage.{A, B, C}";
    const expected = "export mypackage.{A, B, C}\n\n\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats export with renaming", async () => {
    const code = "export mypackage.{A => RenamedA, B}";
    const expected = "export mypackage.{A => RenamedA, B}\n\n\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats export with exclusion", async () => {
    const code = "export mypackage.{A => _, B}";
    const expected = "export mypackage.{A => _, B}\n\n\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats export given instances", async () => {
    const code = "export mypackage.{given, _}";
    const expected = "export mypackage.{given, _}\n\n\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats export only given", async () => {
    const code = "export mypackage.given";
    const expected = "export mypackage.given\n\n\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats multiple nested export", async () => {
    const code = "export scala.collection.{List, Map => ScalaMap}";
    const expected = "export scala.collection.{List, Map => ScalaMap}\n\n\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats complex export with package path", async () => {
    const code = "export cats.effect.{IO, Resource => CatsResource}";
    const expected = "export cats.effect.{IO, Resource => CatsResource}\n\n\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });

  it("formats multiple export statements", async () => {
    const code = `export mypackage._
export scala.collection.List
export cats.effect.{IO, Resource}`;
    const expected =
      "export mypackage._\nexport scala.collection.List\nexport cats.effect.{IO, Resource}\n\n\n";
    const result = await formatCode(code);
    expect(result).toBe(expected);
  });
});

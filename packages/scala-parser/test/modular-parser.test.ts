import { parseModular } from "../src/index.js";
import { describe, it, expect } from "vitest";

describe.skip("Modular parser (TODO: resolve rule conflicts)", () => {
  it("parses simple val definition", () => {
    const code = "val x = 5";
    const result = parseModular(code);

    expect(result.errors).toHaveLength(0);
    expect(result.cst.name).toBe("compilationUnit");
    expect(result.cst.children.valDefinition).toBeDefined();
  });

  it("parses class definition", () => {
    const code = "class MyClass(val x: Int) extends Base";
    const result = parseModular(code);

    expect(result.errors).toHaveLength(0);
    expect(result.cst.name).toBe("compilationUnit");
    expect(result.cst.children.classDefinition).toBeDefined();
  });

  it("parses Scala 3 enum", () => {
    const code = `
      enum Color {
        case Red
        case Green
        case Blue
      }
    `;
    const result = parseModular(code);

    expect(result.errors).toHaveLength(0);
    expect(result.cst.name).toBe("compilationUnit");
    expect(result.cst.children.enumDefinition).toBeDefined();
  });

  it("parses union types", () => {
    const code = "type StringOrInt = String | Int";
    const result = parseModular(code);

    expect(result.errors).toHaveLength(0);
    expect(result.cst.name).toBe("compilationUnit");
    expect(result.cst.children.typeDefinition).toBeDefined();
  });

  it("parses pattern matching", () => {
    const code = `
      x match {
        case 1 => "one"
        case 2 => "two"
        case _ => "other"
      }
    `;
    const result = parseModular(code);

    expect(result.errors).toHaveLength(0);
    expect(result.cst.name).toBe("compilationUnit");
    expect(result.cst.children.expression).toBeDefined();
  });
});

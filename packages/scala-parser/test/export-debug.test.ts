import { parse } from "../src/index.js";
import { describe, it, expect } from "vitest";

describe("Export debug", () => {
  it("parses basic wildcard export", () => {
    const result = parse("export mypackage._");
    expect(result.errors.length).toBe(0);
  });

  it("parses given export", () => {
    const result = parse("export mypackage.given");
    expect(result.errors.length).toBe(0);
  });

  it("parses single selector", () => {
    const result = parse("export mypackage.{A}");
    if (result.errors.length > 0) {
      console.log(
        "Single selector errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });

  it("parses multiple selectors", () => {
    const result = parse("export mypackage.{A, B, C}");
    if (result.errors.length > 0) {
      console.log(
        "Multiple selector errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });

  it("parses selector with renaming", () => {
    const result = parse("export mypackage.{A => RenamedA}");
    if (result.errors.length > 0) {
      console.log(
        "Renaming errors:",
        result.errors.map((e) => e.message),
      );
    }
    expect(result.errors.length).toBe(0);
  });
});

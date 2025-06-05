import { parse } from "../src/index.js";
import { describe, it, expect } from "vitest";

describe("Basic sbt DSL operators", () => {
  it("should parse name setting", () => {
    const code = `name := "my-project"`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse version setting", () => {
    const code = `version := "1.0.0"`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse scalaVersion setting", () => {
    const code = `scalaVersion := "3.3.0"`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse multiple settings", () => {
    const code = `
name := "my-project"
version := "1.0.0"
scalaVersion := "3.3.0"`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse boolean assignment", () => {
    const code = `fork := true`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("should parse sequence assignment", () => {
    const code = `scalacOptions := Seq("-deprecation")`;
    const result = parse(code);
    expect(result).toBeDefined();
  });
});

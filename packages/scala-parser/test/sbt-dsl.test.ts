import { parse } from "../src/index.js";
import { describe, it, expect } from "vitest";

describe("sbt DSL operators parsing", () => {
  it("should parse basic sbt DSL assignment", () => {
    const code = `name := "my-project"`;

    try {
      const result = parse(code);
      expect(result).toBeDefined();
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse version assignment", () => {
    const code = `version := "1.0.0"`;

    try {
      const result = parse(code);
      expect(result).toBeDefined();
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse scalaVersion assignment", () => {
    const code = `scalaVersion := "3.3.0"`;

    try {
      const result = parse(code);
      expect(result).toBeDefined();
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse libraryDependencies assignment", () => {
    const code = `libraryDependencies += "org.typelevel" %% "cats-core" % "2.9.0"`;

    try {
      const result = parse(code);
      expect(result).toBeDefined();
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse complex sbt settings", () => {
    const code = `
name := "my-project"

version := "1.0.0"

scalaVersion := "3.3.0"

libraryDependencies ++= Seq(
  "org.typelevel" %% "cats-core" % "2.9.0",
  "org.typelevel" %% "cats-effect" % "3.5.0"
)`;

    try {
      const result = parse(code);
      expect(result).toBeDefined();
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse sbt settings with expressions", () => {
    const code = `
scalacOptions := Seq(
  "-deprecation",
  "-feature",
  "-Xfatal-warnings"
)

fork := true

test / javaOptions += "-Xmx2G"`;

    try {
      const result = parse(code);
      expect(result).toBeDefined();
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse sbt plugin configuration", () => {
    const code = `
addSbtPlugin("org.scalameta" % "sbt-scalafmt" % "2.5.0")

ThisBuild / scalaVersion := "3.3.0"

ThisBuild / version := "0.1.0-SNAPSHOT"`;

    try {
      const result = parse(code);
      expect(result).toBeDefined();
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse scope-specific sbt settings", () => {
    const code = `
Test / parallelExecution := false

Compile / compile / wartremoverWarnings ++= Warts.unsafe

Global / cancelable := true`;

    try {
      const result = parse(code);
      expect(result).toBeDefined();
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });
});

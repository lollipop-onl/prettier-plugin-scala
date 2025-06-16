import { parse } from "../src/index.js";
import { describe, it, expect } from "vitest";

describe("Greek letters and mathematical symbols parsing", () => {
  it("should parse lambda (λ) identifier", () => {
    const code = `val λ = 42`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse alpha (α) and beta (β) identifiers", () => {
    const code = `val α = 1.0
val β = 2.0`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse gamma (γ) and delta (δ) in simple definitions", () => {
    const code = `object MathUtils {
  val γ = 1.618
}`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse theta (θ) and phi (φ) as identifiers", () => {
    const code = `val θ = 0.5
val φ = 1.2`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse sigma (Σ) as identifier", () => {
    const code = `val Σ = 100`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse pi (π) in simple expressions", () => {
    const code = `object Constants {
  val π = 3.14159265359
}`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse omega (ω, Ω) as identifiers", () => {
    const code = `object Constants {
  val ω = 42
  val Ω = 24
}`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse epsilon (ε) and mu (μ) as identifiers", () => {
    const code = `val ε = 0.001
val μ = 10.5`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse mixed Greek and Latin identifiers", () => {
    const code = `object Statistics {
  val μ = 50.0
  val σSquared = 25.0
}`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });

  it("should parse Greek letters in method names", () => {
    const code = `object MathFunctions {
  def α(): Double = 1.0
  def β(): Double = 2.0
}`;

    try {
      const result = parse(code);
      expect(result.errors).toHaveLength(0);
    } catch (error) {
      console.error("Parsing error:", error);
      throw error;
    }
  });
});

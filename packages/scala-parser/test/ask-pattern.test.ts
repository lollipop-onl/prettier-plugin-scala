import { parse } from "../dist/index.js";
import { describe, it, expect } from "vitest";

describe("Ask pattern operator parsing", () => {
  it("parses basic ask pattern", () => {
    const code = `val result = actor ? message`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("parses ask pattern with parentheses", () => {
    const code = `val result = (actor ? message)`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("parses ask pattern in complex expression", () => {
    const code = `val future = (greeter ? Greet("Akka")).mapTo[String]`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("parses ask pattern with method chaining", () => {
    const code = `val result = (actor ? message).toString`;
    const result = parse(code);
    expect(result).toBeDefined();
  });

  it("parses multiple ask operations", () => {
    const code = `
      val result1 = actor1 ? message1
      val result2 = actor2 ? message2
    `;
    const result = parse(code);
    expect(result).toBeDefined();
  });
});

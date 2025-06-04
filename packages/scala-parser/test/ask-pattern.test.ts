import { parse } from "../lib/index.js";
import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

describe("Ask pattern operator parsing", () => {
  it("parses basic ask pattern", () => {
    const code = `val result = actor ? message`;
    const result = parse(code);
    assert.ok(result);
  });

  it("parses ask pattern with parentheses", () => {
    const code = `val result = (actor ? message)`;
    const result = parse(code);
    assert.ok(result);
  });

  it("parses ask pattern in complex expression", () => {
    const code = `val future = (greeter ? Greet("Akka")).mapTo[String]`;
    const result = parse(code);
    assert.ok(result);
  });

  it("parses ask pattern with method chaining", () => {
    const code = `
      val result = actor ? message match {
        case Success(value) => value
        case _ => "failed"
      }
    `;
    const result = parse(code);
    assert.ok(result);
  });

  it("parses multiple ask operations", () => {
    const code = `
      val result1 = actor1 ? message1
      val result2 = actor2 ? message2
    `;
    const result = parse(code);
    assert.ok(result);
  });
});

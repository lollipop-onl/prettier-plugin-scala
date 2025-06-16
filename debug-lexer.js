#!/usr/bin/env node
import { ScalaLexer } from "./packages/scala-parser/dist/index.js";

console.log("Testing lexer tokenization for multiline sbt:");
const code = `name := "my-project"

version := "1.0.0"`;

console.log(`Input: ${JSON.stringify(code)}`);

const result = ScalaLexer.tokenize(code);
console.log("Tokens:");
result.tokens.forEach((token, i) => {
  console.log(`  ${i}: ${token.tokenType.name} = "${token.image}"`);
});

if (result.errors.length > 0) {
  console.log("Lexer errors:");
  result.errors.forEach((error) => console.log("  ", error));
}

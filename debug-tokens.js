import { ScalaLexer } from "./packages/scala-parser/dist/index.js";

function lex(code) {
  const result = ScalaLexer.tokenize(code);
  return result.tokens;
}

console.log("=== Tokenizing single line ===");
const singleTokens = lex('name := "test"');
console.log(
  "Tokens:",
  singleTokens.map((t) => `${t.tokenType.name}(${t.image})`),
);

console.log("\n=== Tokenizing two lines ===");
const multiTokens = lex('name := "test"\nversion := "1.0"');
console.log(
  "Tokens:",
  multiTokens.map((t) => `${t.tokenType.name}(${t.image})`),
);

console.log("\n=== Tokenizing with semicolon ===");
const semiTokens = lex('name := "test"; version := "1.0"');
console.log(
  "Tokens:",
  semiTokens.map((t) => `${t.tokenType.name}(${t.image})`),
);

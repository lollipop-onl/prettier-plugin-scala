import { ScalaLexer } from "./packages/scala-parser/dist/index.js";

const code = `name := "my-project"
version := "1.0.0"`;

console.log("Lexing:", JSON.stringify(code));
const lexResult = ScalaLexer.tokenize(code);

if (lexResult.errors.length > 0) {
  console.error("Lexer errors:", lexResult.errors);
} else {
  console.log("Tokens:");
  lexResult.tokens.forEach((token, i) => {
    console.log(`${i}: ${token.tokenType.name} = "${token.image}"`);
  });
}

#!/usr/bin/env node
import { ScalaLexer } from "./packages/scala-parser/dist/index.js";

console.log("Analyzing parsing context:");
const code = `name := "my-project"

version := "1.0.0"`;

console.log(`Input: ${JSON.stringify(code)}`);

const result = ScalaLexer.tokenize(code);
console.log("All tokens:");
result.tokens.forEach((token, i) => {
  console.log(
    `  ${i}: ${token.tokenType.name}(${token.image}) at line ${token.startLine}, col ${token.startColumn}`,
  );
});

console.log("\nSimulating parser state:");
console.log('First statement: name := "my-project"');
console.log("  - LA(1): Identifier(name)");
console.log("  - LA(2): SbtAssign(:=)");
console.log('  - LA(3): StringLiteral("my-project")');
console.log("  → Should match assignmentStatement GATE ✓");

console.log("\nAfter first statement parsed, next tokens:");
console.log("  - LA(1): Identifier(version)");
console.log("  - LA(2): SbtAssign(:=)");
console.log('  - LA(3): StringLiteral("1.0.0")');
console.log("  → Should match assignmentStatement GATE ✓");

console.log("\nBut parser seems to be trying expression instead...");

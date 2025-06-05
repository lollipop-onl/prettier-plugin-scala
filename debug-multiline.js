import { parse } from "./packages/scala-parser/dist/index.js";

console.log("Testing multiline sbt assignments...");

// First test: simple case that works
try {
  const code1 = `name := "my-project"`;
  console.log("✓ Single assignment works");
} catch (e) {
  console.error("✗ Single assignment failed:", e.message);
}

// Second test: what happens with newline+identifier
try {
  const code2 = `name := "my-project"
version`;
  parse(code2);
  console.log("✓ Assignment + identifier works");
} catch (e) {
  console.error(
    "✗ Assignment + identifier failed:",
    e.message.substring(0, 100),
  );
}

// Third test: full multiline
try {
  const code3 = `name := "my-project"
version := "1.0.0"`;

  console.log("Parsing:", JSON.stringify(code3));
  const result = parse(code3);
  console.log("✓ Success");
} catch (e) {
  console.error("✗ Error:");
  console.error(e.message.substring(0, 200));
}

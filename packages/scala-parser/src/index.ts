import { ScalaLexer } from "./lexer.js";
import { parserInstance } from "./parser.js";

export { ScalaLexer, allTokens } from "./lexer.js";
export { ScalaParser, parserInstance } from "./parser.js";

export interface ParseResult {
  cst: any;
  errors: any[];
  comments: any[];
}

export function parse(text: string): ParseResult {
  // Tokenize
  const lexResult = ScalaLexer.tokenize(text);

  if (lexResult.errors.length > 0) {
    throw new Error(
      `Lexing errors: ${lexResult.errors.map((e) => e.message).join(", ")}`,
    );
  }

  // Parse
  parserInstance.input = lexResult.tokens;
  const cst = parserInstance.compilationUnit();

  if (parserInstance.errors.length > 0) {
    throw new Error(
      `Parsing errors: ${parserInstance.errors.map((e) => e.message).join(", ")}`,
    );
  }

  return {
    cst,
    errors: [],
    comments: lexResult.groups.comments || [],
  };
}

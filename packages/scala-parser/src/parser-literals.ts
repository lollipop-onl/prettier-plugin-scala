/**
 * Literal parsing utilities for Scala parser
 */
import * as tokens from "./lexer.js";
import { CstParser } from "chevrotain";

/**
 * Creates a literal parsing rule for the given parser instance.
 * This function must be called within a CstParser subclass to access protected methods.
 *
 * @param parser - The CstParser instance (typed as any to access protected methods)
 * @returns The literal parsing rule function
 */
export function createLiteralRule(parser: CstParser & any): any {
  return parser.RULE("literal", () => {
    parser.OR([
      { ALT: () => parser.CONSUME(tokens.ScientificNotationLiteral) },
      { ALT: () => parser.CONSUME(tokens.FloatingPointLiteral) },
      { ALT: () => parser.CONSUME(tokens.IntegerLiteral) },
      { ALT: () => parser.CONSUME(tokens.InterpolatedStringLiteral) },
      { ALT: () => parser.CONSUME(tokens.StringLiteral) },
      { ALT: () => parser.CONSUME(tokens.CharLiteral) },
      { ALT: () => parser.CONSUME(tokens.True) },
      { ALT: () => parser.CONSUME(tokens.False) },
      { ALT: () => parser.CONSUME(tokens.Null) },
      { ALT: () => parser.CONSUME(tokens.NotImplemented) },
    ]);
  });
}

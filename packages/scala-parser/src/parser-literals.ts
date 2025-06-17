/**
 * Literal parsing utilities for Scala parser
 */
import * as tokens from "./lexer.js";
import { CstParser } from "chevrotain";

export class LiteralParser {
  public literal: any;

  constructor(private parser: CstParser) {
    // Initialize the literal rule after the parser is available
    this.literal = this.parser.RULE("literal", () => {
      this.parser.OR([
        { ALT: () => this.parser.CONSUME(tokens.ScientificNotationLiteral) },
        { ALT: () => this.parser.CONSUME(tokens.FloatingPointLiteral) },
        { ALT: () => this.parser.CONSUME(tokens.IntegerLiteral) },
        { ALT: () => this.parser.CONSUME(tokens.InterpolatedStringLiteral) },
        { ALT: () => this.parser.CONSUME(tokens.StringLiteral) },
        { ALT: () => this.parser.CONSUME(tokens.CharLiteral) },
        { ALT: () => this.parser.CONSUME(tokens.True) },
        { ALT: () => this.parser.CONSUME(tokens.False) },
        { ALT: () => this.parser.CONSUME(tokens.Null) },
        { ALT: () => this.parser.CONSUME(tokens.NotImplemented) },
      ]);
    });
  }
}

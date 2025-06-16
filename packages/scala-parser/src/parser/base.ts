/**
 * Base parser module with shared utilities and interfaces
 */
import * as tokens from "../lexer.js";
import { CstParser, Rule } from "chevrotain";

export interface ParserRuleMixin {
  // Utility methods for parser rules
  RULE: CstParser["RULE"];
  SUBRULE: CstParser["SUBRULE"];
  CONSUME: CstParser["CONSUME"];
  MANY: CstParser["MANY"];
  MANY_SEP: CstParser["MANY_SEP"];
  OPTION: CstParser["OPTION"];
  OR: CstParser["OR"];
  AT_LEAST_ONE: CstParser["AT_LEAST_ONE"];
  AT_LEAST_ONE_SEP: CstParser["AT_LEAST_ONE_SEP"];
  LA: CstParser["LA"];
}

export abstract class BaseParserModule {
  protected parser: ParserRuleMixin;

  constructor(parser: ParserRuleMixin) {
    this.parser = parser;
  }

  // Helper methods for common patterns
  protected consumeTokenType(tokenType: any) {
    return this.parser.CONSUME(tokenType);
  }

  protected optionalConsume(tokenType: any) {
    return this.parser.OPTION(() => this.parser.CONSUME(tokenType));
  }

  protected manyOf(rule: () => void) {
    return this.parser.MANY(rule);
  }

  protected oneOf(
    alternatives: Array<{ ALT: () => void; GATE?: () => boolean }>,
  ) {
    return this.parser.OR(alternatives);
  }

  protected subrule(rule: Rule) {
    return this.parser.SUBRULE(rule);
  }

  protected lookahead(offset: number) {
    return this.parser.LA(offset);
  }
}

export { tokens };

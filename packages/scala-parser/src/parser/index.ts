/**
 * Modular parser entry point - combines all parser modules
 */
import * as tokens from "../lexer.js";
import { DefinitionParserMixin } from "./definitions.js";
import { StatementParserMixin } from "./statements.js";
import { CstParser } from "chevrotain";

// This is a proof-of-concept for the modular parser structure
// For now, we'll create a basic structure and gradually migrate rules

export class ModularScalaParser extends CstParser {
  // Parser modules
  private statements: StatementParserMixin;
  private definitions: DefinitionParserMixin;

  constructor() {
    super(tokens.allTokens);

    // Initialize parser mixins
    this.statements = new StatementParserMixin(this);
    this.definitions = new DefinitionParserMixin(this);

    this.performSelfAnalysis();
  }

  // Temporary method to expose rules for compatibility
  getStatement(ruleName: string) {
    switch (ruleName) {
      case "packageClause":
        return this.statements.packageClause;
      case "importClause":
        return this.statements.importClause;
      case "exportClause":
        return this.statements.exportClause;
      default:
        throw new Error(`Unknown statement rule: ${ruleName}`);
    }
  }

  getDefinition(ruleName: string) {
    switch (ruleName) {
      case "classDefinition":
        return this.definitions.classDefinition;
      case "objectDefinition":
        return this.definitions.objectDefinition;
      case "traitDefinition":
        return this.definitions.traitDefinition;
      default:
        throw new Error(`Unknown definition rule: ${ruleName}`);
    }
  }

  // Basic compilation unit for testing
  public compilationUnit = this.RULE("compilationUnit", () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statements.packageClause) },
        { ALT: () => this.SUBRULE(this.statements.importClause) },
        { ALT: () => this.SUBRULE(this.statements.exportClause) },
      ]);
    });
  });

  // Placeholder for missing rules (to be implemented)
  private qualifiedIdentifier = this.RULE("qualifiedIdentifier", () => {
    this.CONSUME(tokens.Identifier);
    this.MANY(() => {
      this.CONSUME(tokens.Dot);
      this.CONSUME(tokens.Identifier, { LABEL: "Identifier2" });
    });
  });
}

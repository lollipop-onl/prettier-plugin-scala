/**
 * Definition parsing module for class, object, trait, method, and variable definitions
 */
import { BaseParserModule, tokens } from "./base.js";
import type { Rule } from "chevrotain";

export class DefinitionParserMixin extends BaseParserModule {
  // Dependencies from other modules
  annotation!: Rule;
  modifier!: Rule;
  typeParameters!: Rule;
  classParameters!: Rule;
  extendsClause!: Rule;
  classBody!: Rule;
  type!: Rule;
  expression!: Rule;
  pattern!: Rule;
  parameterLists!: Rule;
  extensionMember!: Rule;
  enumCase!: Rule;

  // Class definition
  classDefinition = this.parser.RULE("classDefinition", () => {
    this.consumeTokenType(tokens.Class);
    this.consumeTokenType(tokens.Identifier);
    this.parser.OPTION(() => this.subrule(this.typeParameters));
    // Constructor annotations (for DI patterns like @Inject())
    this.manyOf(() => this.subrule(this.annotation));
    // Constructor parameters (multiple parameter lists supported)
    this.parser.MANY(() => this.subrule(this.classParameters), {
      LABEL: "classParametersMany",
    });
    this.parser.OPTION(() => this.subrule(this.extendsClause), {
      LABEL: "extendsClauseOption2",
    });
    this.parser.OPTION(() => this.subrule(this.classBody), {
      LABEL: "classBodyOption3",
    });
  });

  // Object definition
  objectDefinition = this.parser.RULE("objectDefinition", () => {
    this.consumeTokenType(tokens.ObjectKeyword);
    this.consumeTokenType(tokens.Identifier);
    this.parser.OPTION(() => this.subrule(this.extendsClause));
    this.parser.OPTION(() => this.subrule(this.classBody), {
      LABEL: "classBodyOption2",
    });
  });

  // Trait definition
  traitDefinition = this.parser.RULE("traitDefinition", () => {
    this.consumeTokenType(tokens.Trait);
    this.consumeTokenType(tokens.Identifier);
    this.parser.OPTION(() => this.subrule(this.typeParameters));
    this.parser.OPTION(() => this.subrule(this.extendsClause), {
      LABEL: "extendsClauseOption2",
    });
    this.parser.OPTION(() => this.subrule(this.classBody), {
      LABEL: "classBodyOption3",
    });
  });

  // Enum definition (Scala 3)
  enumDefinition = this.parser.RULE("enumDefinition", () => {
    this.consumeTokenType(tokens.Enum);
    this.consumeTokenType(tokens.Identifier);
    this.parser.OPTION(() => this.subrule(this.typeParameters));
    this.parser.OPTION(() => this.subrule(this.classParameters), {
      LABEL: "classParametersOption2",
    });
    this.parser.OPTION(() => this.subrule(this.extendsClause), {
      LABEL: "extendsClauseOption3",
    });
    this.consumeTokenType(tokens.LeftBrace);
    this.manyOf(() => this.subrule(this.enumCase));
    this.consumeTokenType(tokens.RightBrace);
  });

  enumCase = this.parser.RULE("enumCase", () => {
    this.consumeTokenType(tokens.Case);
    this.consumeTokenType(tokens.Identifier);
    this.parser.OPTION(() => this.subrule(this.classParameters));
    this.parser.OPTION(() => this.subrule(this.extendsClause), {
      LABEL: "extendsClauseOption2",
    });
    this.parser.OPTION(() => this.consumeTokenType(tokens.Semicolon), {
      LABEL: "semicolonOption3",
    });
  });

  // Extension definition (Scala 3)
  extensionDefinition = this.parser.RULE("extensionDefinition", () => {
    this.consumeTokenType(tokens.Extension);
    this.parser.OPTION(() => this.subrule(this.typeParameters));
    this.consumeTokenType(tokens.LeftParen);
    this.consumeTokenType(tokens.Identifier);
    this.consumeTokenType(tokens.Colon);
    this.subrule(this.type);
    this.consumeTokenType(tokens.RightParen);
    this.consumeTokenType(tokens.LeftBrace);
    this.manyOf(() => this.subrule(this.extensionMember));
    this.consumeTokenType(tokens.RightBrace);
  });

  extensionMember = this.parser.RULE("extensionMember", () => {
    this.manyOf(() => this.subrule(this.modifier));
    this.subrule(this.defDefinition);
  });

  // Val definition
  valDefinition = this.parser.RULE("valDefinition", () => {
    this.consumeTokenType(tokens.Val);
    this.oneOf([
      {
        // Simple variable with optional type: val x: Type = expr or val x: Type (abstract)
        ALT: () => {
          this.consumeTokenType(tokens.Identifier);
          this.parser.OPTION(() => {
            this.consumeTokenType(tokens.Colon);
            this.subrule(this.type);
          });
          this.parser.OPTION(
            () => {
              this.consumeTokenType(tokens.Equals);
              this.subrule(this.expression);
            },
            { LABEL: "expressionOption3" },
          );
        },
        GATE: () => {
          // This alternative is for simple identifier patterns only
          // Must handle: val x = ..., val x: Type = ..., val x: Type (abstract)
          // Must NOT handle: val (x, y) = ..., val SomeClass(...) = ...
          const first = this.lookahead(1);
          const second = this.lookahead(2);

          // If first token is not identifier, this is not a simple val
          if (!first || first.tokenType !== tokens.Identifier) return false;

          // If second token is left paren, this is a constructor pattern
          if (second && second.tokenType === tokens.LeftParen) return false;

          // Otherwise, this is a simple identifier (with or without type, with or without assignment)
          return true;
        },
      },
      {
        // Pattern matching: val (x, y) = expr or val SomeClass(...) = expr
        ALT: () => {
          this.subrule(this.pattern);
          this.parser.CONSUME(tokens.Equals, { LABEL: "Equals2" });
          this.parser.SUBRULE(this.expression, { LABEL: "expression2" });
        },
      },
    ]);
    this.parser.OPTION(() => this.consumeTokenType(tokens.Semicolon), {
      LABEL: "semicolonOption4",
    });
  });

  // Var definition
  varDefinition = this.parser.RULE("varDefinition", () => {
    this.consumeTokenType(tokens.Var);
    this.consumeTokenType(tokens.Identifier);
    this.parser.OPTION(() => {
      this.consumeTokenType(tokens.Colon);
      this.subrule(this.type);
    });
    this.consumeTokenType(tokens.Equals);
    this.subrule(this.expression);
    this.parser.OPTION(() => this.consumeTokenType(tokens.Semicolon), {
      LABEL: "semicolonOption2",
    });
  });

  // Method definition
  defDefinition = this.parser.RULE("defDefinition", () => {
    this.consumeTokenType(tokens.Def);
    this.oneOf([
      // Regular method name
      { ALT: () => this.consumeTokenType(tokens.Identifier) },
      // Constructor (this keyword)
      { ALT: () => this.consumeTokenType(tokens.This) },
    ]);
    this.parser.OPTION(() => this.subrule(this.typeParameters));
    this.parser.OPTION(() => this.subrule(this.parameterLists), {
      LABEL: "parameterListsOption2",
    });
    this.parser.OPTION(
      () => {
        this.consumeTokenType(tokens.Colon);
        this.subrule(this.type);
      },
      { LABEL: "typeOption3" },
    );
    this.parser.OPTION(
      () => {
        this.consumeTokenType(tokens.Equals);
        this.subrule(this.expression);
      },
      { LABEL: "expressionOption4" },
    );
    this.parser.OPTION(() => this.consumeTokenType(tokens.Semicolon), {
      LABEL: "semicolonOption5",
    });
  });
}

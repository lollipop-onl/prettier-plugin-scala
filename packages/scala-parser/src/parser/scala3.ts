/**
 * Scala 3 specific features parsing module
 */
import { BaseParserModule, tokens } from "./base.js";
import type { Rule, ParserMethod, CstNode } from "chevrotain";

export class Scala3ParserMixin extends BaseParserModule {
  // Dependencies from other modules
  annotation!: ParserMethod<any[], CstNode>;
  modifier!: ParserMethod<any[], CstNode>;
  typeParameters!: ParserMethod<any[], CstNode>;
  type!: ParserMethod<any[], CstNode>;
  expression!: ParserMethod<any[], CstNode>;
  pattern!: ParserMethod<any[], CstNode>;
  parameterLists!: ParserMethod<any[], CstNode>;
  classBody!: ParserMethod<any[], CstNode>;
  extendsClause!: ParserMethod<any[], CstNode>;
  qualifiedIdentifier!: ParserMethod<any[], CstNode>;
  valDefinition!: ParserMethod<any[], CstNode>;
  defDefinition!: ParserMethod<any[], CstNode>;
  typeDefinition!: ParserMethod<any[], CstNode>;

  // Enum definition (Scala 3)
  enumDefinition = this.parser.RULE("enumDefinition", () => {
    this.consumeTokenType(tokens.Enum);
    this.consumeTokenType(tokens.Identifier);
    this.parser.OPTION(() => this.subrule(this.typeParameters));
    this.parser.OPTION2(() => this.subrule(this.extendsClause));
    this.consumeTokenType(tokens.LeftBrace);
    this.parser.MANY(() => {
      this.parser.OR([
        { ALT: () => this.subrule(this.enumCase) },
        { ALT: () => this.subrule(this.classMember) },
      ]);
      this.parser.OPTION3(() => this.consumeTokenType(tokens.Semicolon));
    });
    this.consumeTokenType(tokens.RightBrace);
  });

  // Enum case
  enumCase = this.parser.RULE("enumCase", () => {
    this.consumeTokenType(tokens.Case);
    this.consumeTokenType(tokens.Identifier);
    this.parser.OPTION(() => {
      this.consumeTokenType(tokens.LeftParen);
      this.parser.MANY_SEP({
        SEP: tokens.Comma,
        DEF: () => {
          this.consumeTokenType(tokens.Identifier, { LABEL: "Identifier2" });
          this.consumeTokenType(tokens.Colon);
          this.subrule(this.type);
        },
      });
      this.consumeTokenType(tokens.RightParen);
    });
    this.parser.OPTION2(() => {
      this.consumeTokenType(tokens.Extends);
      this.subrule(this.type, { LABEL: "type2" });
    });
  });

  // Extension definition (Scala 3)
  extensionDefinition = this.parser.RULE("extensionDefinition", () => {
    this.consumeTokenType(tokens.Extension);

    // Optional type parameters before the extended type
    this.parser.OPTION(() => this.subrule(this.typeParameters));

    // Extended type with parameters
    this.consumeTokenType(tokens.LeftParen);
    this.consumeTokenType(tokens.Identifier, { LABEL: "Identifier3" });
    this.consumeTokenType(tokens.Colon);
    this.subrule(this.type, { LABEL: "type3" });
    this.consumeTokenType(tokens.RightParen);

    // Optional using/given clauses
    this.parser.MANY(() => this.subrule(this.parameterLists));

    // Extension body
    this.parser.OR([
      // Single method
      { ALT: () => this.subrule(this.extensionMember) },
      // Multiple methods in braces
      {
        ALT: () => {
          this.consumeTokenType(tokens.LeftBrace);
          this.parser.MANY(() => {
            this.subrule(this.extensionMember, { LABEL: "extensionMember2" });
            this.parser.OPTION2(() => this.consumeTokenType(tokens.Semicolon));
          });
          this.consumeTokenType(tokens.RightBrace);
        },
      },
    ]);
  });

  // Extension member
  extensionMember = this.parser.RULE("extensionMember", () => {
    this.parser.MANY(() => this.subrule(this.annotation));
    this.parser.MANY2(() => this.subrule(this.modifier));
    this.parser.OR([
      { ALT: () => this.subrule(this.defDefinition) },
      { ALT: () => this.subrule(this.valDefinition) },
      { ALT: () => this.subrule(this.typeDefinition) },
    ]);
  });

  // Given definition (Scala 3)
  givenDefinition = this.parser.RULE("givenDefinition", () => {
    this.consumeTokenType(tokens.Given);

    // Optional given name
    this.parser.OPTION(() => {
      this.consumeTokenType(tokens.Identifier, { LABEL: "Identifier4" });
    });

    // Optional type parameters
    this.parser.OPTION2(() =>
      this.subrule(this.typeParameters, { LABEL: "typeParameters2" }),
    );

    // Optional parameter lists (for given with parameters)
    this.parser.MANY(() =>
      this.subrule(this.parameterLists, { LABEL: "parameterLists2" }),
    );

    this.consumeTokenType(tokens.Colon);
    this.subrule(this.type, { LABEL: "type4" });

    // Implementation
    this.parser.OR([
      // With implementation
      {
        ALT: () => {
          this.consumeTokenType(tokens.With);
          this.parser.OR2([
            // Block implementation
            { ALT: () => this.subrule(this.classBody) },
            // Expression implementation
            {
              ALT: () => {
                this.consumeTokenType(tokens.Equals);
                this.subrule(this.expression);
              },
            },
          ]);
        },
      },
      // Direct implementation with =
      {
        ALT: () => {
          this.consumeTokenType(tokens.Equals);
          this.subrule(this.expression, { LABEL: "expression2" });
        },
      },
    ]);
  });

  // Opaque type definition (Scala 3)
  opaqueTypeDefinition = this.parser.RULE("opaqueTypeDefinition", () => {
    this.consumeTokenType(tokens.Opaque);
    this.consumeTokenType(tokens.Type);
    this.consumeTokenType(tokens.Identifier);
    this.parser.OPTION(() =>
      this.subrule(this.typeParameters, { LABEL: "typeParameters3" }),
    );

    // Optional type bounds
    this.parser.OPTION2(() => {
      this.parser.OR([
        {
          ALT: () => {
            this.consumeTokenType(tokens.ColonLess);
            this.subrule(this.type, { LABEL: "type5" });
          },
        },
        {
          ALT: () => {
            this.consumeTokenType(tokens.GreaterColon);
            this.subrule(this.type, { LABEL: "type6" });
          },
        },
      ]);
    });

    this.consumeTokenType(tokens.Equals);
    this.subrule(this.type, { LABEL: "type7" });
  });

  // Inline modifier handling (Scala 3)
  inlineDefinition = this.parser.RULE("inlineDefinition", () => {
    this.consumeTokenType(tokens.Inline);
    this.parser.OR([
      {
        ALT: () =>
          this.subrule(this.defDefinition, { LABEL: "defDefinition2" }),
      },
      {
        ALT: () =>
          this.subrule(this.valDefinition, { LABEL: "valDefinition2" }),
      },
    ]);
  });

  // Transparent modifier handling (Scala 3)
  transparentDefinition = this.parser.RULE("transparentDefinition", () => {
    this.consumeTokenType(tokens.Transparent);
    this.consumeTokenType(tokens.Inline);
    this.subrule(this.defDefinition, { LABEL: "defDefinition3" });
  });

  // Export clause (already implemented in statements, but Scala 3 specific)
  // Moved from statements module for better organization
  exportClause = this.parser.RULE("exportClause", () => {
    this.consumeTokenType(tokens.Export);
    this.subrule(this.exportExpression);
    this.parser.OPTION(() => this.consumeTokenType(tokens.Semicolon));
  });

  exportExpression = this.parser.RULE("exportExpression", () => {
    this.subrule(this.qualifiedIdentifier);
    this.consumeTokenType(tokens.Dot);
    this.parser.MANY(() => {
      this.consumeTokenType(tokens.Dot, { LABEL: "Dot2" });
      this.parser.OR([
        {
          ALT: () =>
            this.consumeTokenType(tokens.Identifier, { LABEL: "Identifier5" }),
        },
        { ALT: () => this.consumeTokenType(tokens.Underscore) },
        { ALT: () => this.consumeTokenType(tokens.Given) },
        {
          ALT: () => {
            this.consumeTokenType(tokens.LeftBrace);
            this.parser.MANY_SEP({
              SEP: tokens.Comma,
              DEF: () => this.subrule(this.exportSelector),
            });
            this.consumeTokenType(tokens.RightBrace);
          },
        },
      ]);
    });
  });

  exportSelector = this.parser.RULE("exportSelector", () => {
    this.parser.OR([
      // given selector
      { ALT: () => this.consumeTokenType(tokens.Given, { LABEL: "Given2" }) },
      // Regular selector with optional rename
      {
        ALT: () => {
          this.consumeTokenType(tokens.Identifier, { LABEL: "Identifier6" });
          this.parser.OPTION(() => {
            this.parser.OR2([
              // Rename: x => y
              {
                ALT: () => {
                  this.consumeTokenType(tokens.Arrow);
                  this.consumeTokenType(tokens.Identifier, {
                    LABEL: "Identifier7",
                  });
                },
              },
              // Hide: x => _
              {
                ALT: () => {
                  this.consumeTokenType(tokens.Arrow, { LABEL: "Arrow2" });
                  this.consumeTokenType(tokens.Underscore, {
                    LABEL: "Underscore2",
                  });
                },
              },
            ]);
          });
        },
      },
    ]);
  });

  // Using clause (Scala 3 - for context parameters)
  usingClause = this.parser.RULE("usingClause", () => {
    this.consumeTokenType(tokens.Using);
    this.consumeTokenType(tokens.LeftParen);
    this.parser.MANY_SEP({
      SEP: tokens.Comma,
      DEF: () => {
        this.consumeTokenType(tokens.Identifier, { LABEL: "Identifier8" });
        this.consumeTokenType(tokens.Colon);
        this.subrule(this.type, { LABEL: "type8" });
      },
    });
    this.consumeTokenType(tokens.RightParen);
  });

  // Helper rule placeholder
  classMember = this.parser.RULE("classMember", () => {
    // Placeholder - should be in definitions.ts
    this.parser.OR([
      {
        ALT: () =>
          this.subrule(this.valDefinition, { LABEL: "valDefinition3" }),
      },
      {
        ALT: () =>
          this.subrule(this.defDefinition, { LABEL: "defDefinition4" }),
      },
      {
        ALT: () =>
          this.subrule(this.typeDefinition, { LABEL: "typeDefinition2" }),
      },
    ]);
  });
}

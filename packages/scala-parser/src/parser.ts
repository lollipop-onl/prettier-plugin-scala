import * as tokens from "./lexer.js";
import { CstParser } from "chevrotain";

export class ScalaParser extends CstParser {
  constructor() {
    super(tokens.allTokens);
    this.performSelfAnalysis();
  }

  // Entry point
  public compilationUnit = this.RULE("compilationUnit", () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.packageClause) },
        { ALT: () => this.SUBRULE(this.importClause) },
        { ALT: () => this.SUBRULE(this.topLevelDefinition) },
      ]);
    });
  });

  // Package declaration
  private packageClause = this.RULE("packageClause", () => {
    this.CONSUME(tokens.Package);
    this.SUBRULE(this.qualifiedIdentifier);
    this.OPTION(() => this.CONSUME(tokens.Semicolon));
  });

  // Import declaration
  private importClause = this.RULE("importClause", () => {
    this.CONSUME(tokens.Import);
    this.SUBRULE(this.importExpression);
    this.OPTION(() => this.CONSUME(tokens.Semicolon));
  });

  private importExpression = this.RULE("importExpression", () => {
    this.SUBRULE(this.qualifiedIdentifier);
    this.OPTION(() => {
      this.CONSUME(tokens.Dot);
      this.OR([
        { ALT: () => this.CONSUME(tokens.Underscore) },
        { ALT: () => this.CONSUME(tokens.LeftBrace) },
      ]);
    });
  });

  // Top-level definitions
  private topLevelDefinition = this.RULE("topLevelDefinition", () => {
    this.MANY(() => this.SUBRULE(this.modifier));
    this.OR([
      { ALT: () => this.SUBRULE(this.classDefinition) },
      { ALT: () => this.SUBRULE(this.objectDefinition) },
      { ALT: () => this.SUBRULE(this.traitDefinition) },
      { ALT: () => this.SUBRULE(this.valDefinition) },
      { ALT: () => this.SUBRULE(this.varDefinition) },
      { ALT: () => this.SUBRULE(this.defDefinition) },
    ]);
  });

  // Modifiers
  private modifier = this.RULE("modifier", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.Private) },
      { ALT: () => this.CONSUME(tokens.Protected) },
      { ALT: () => this.CONSUME(tokens.Public) },
      { ALT: () => this.CONSUME(tokens.Abstract) },
      { ALT: () => this.CONSUME(tokens.Final) },
      { ALT: () => this.CONSUME(tokens.Sealed) },
      { ALT: () => this.CONSUME(tokens.Implicit) },
      { ALT: () => this.CONSUME(tokens.Lazy) },
      { ALT: () => this.CONSUME(tokens.Override) },
      { ALT: () => this.CONSUME(tokens.Case) },
    ]);
  });

  // Class definition
  private classDefinition = this.RULE("classDefinition", () => {
    this.CONSUME(tokens.Class);
    this.CONSUME(tokens.Identifier);
    this.OPTION(() => this.SUBRULE(this.typeParameters));
    this.OPTION2(() => this.SUBRULE(this.classParameters));
    this.OPTION3(() => this.SUBRULE(this.extendsClause));
    this.OPTION4(() => this.SUBRULE(this.classBody));
  });

  // Object definition
  private objectDefinition = this.RULE("objectDefinition", () => {
    this.CONSUME(tokens.Object);
    this.CONSUME(tokens.Identifier);
    this.OPTION(() => this.SUBRULE(this.extendsClause));
    this.OPTION2(() => this.SUBRULE(this.classBody));
  });

  // Trait definition
  private traitDefinition = this.RULE("traitDefinition", () => {
    this.CONSUME(tokens.Trait);
    this.CONSUME(tokens.Identifier);
    this.OPTION(() => this.SUBRULE(this.typeParameters));
    this.OPTION2(() => this.SUBRULE(this.extendsClause));
    this.OPTION3(() => this.SUBRULE(this.classBody));
  });

  // Val definition
  private valDefinition = this.RULE("valDefinition", () => {
    this.CONSUME(tokens.Val);
    this.SUBRULE(this.pattern);
    this.OPTION(() => {
      this.CONSUME(tokens.Colon);
      this.SUBRULE(this.type);
    });
    this.CONSUME(tokens.Equals);
    this.SUBRULE(this.expression);
    this.OPTION2(() => this.CONSUME(tokens.Semicolon));
  });

  // Var definition
  private varDefinition = this.RULE("varDefinition", () => {
    this.CONSUME(tokens.Var);
    this.CONSUME(tokens.Identifier);
    this.OPTION(() => {
      this.CONSUME(tokens.Colon);
      this.SUBRULE(this.type);
    });
    this.CONSUME(tokens.Equals);
    this.SUBRULE(this.expression);
    this.OPTION2(() => this.CONSUME(tokens.Semicolon));
  });

  // Method definition
  private defDefinition = this.RULE("defDefinition", () => {
    this.CONSUME(tokens.Def);
    this.CONSUME(tokens.Identifier);
    this.OPTION(() => this.SUBRULE(this.typeParameters));
    this.OPTION2(() => this.SUBRULE(this.parameterLists));
    this.OPTION3(() => {
      this.CONSUME(tokens.Colon);
      this.SUBRULE(this.type);
    });
    this.OPTION4(() => {
      this.CONSUME(tokens.Equals);
      this.SUBRULE(this.expression);
    });
    this.OPTION5(() => this.CONSUME(tokens.Semicolon));
  });

  // Class parameters
  private classParameters = this.RULE("classParameters", () => {
    this.CONSUME(tokens.LeftParen);
    this.MANY_SEP({
      SEP: tokens.Comma,
      DEF: () => this.SUBRULE(this.classParameter),
    });
    this.CONSUME(tokens.RightParen);
  });

  private classParameter = this.RULE("classParameter", () => {
    this.MANY(() => this.SUBRULE(this.modifier));
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(tokens.Val) },
        { ALT: () => this.CONSUME(tokens.Var) },
      ]);
    });
    this.CONSUME(tokens.Identifier);
    this.CONSUME(tokens.Colon);
    this.SUBRULE(this.type);
    this.OPTION2(() => {
      this.CONSUME(tokens.Equals);
      this.SUBRULE(this.expression);
    });
  });

  // Parameter lists
  private parameterLists = this.RULE("parameterLists", () => {
    this.AT_LEAST_ONE(() => this.SUBRULE(this.parameterList));
  });

  private parameterList = this.RULE("parameterList", () => {
    this.CONSUME(tokens.LeftParen);
    this.MANY_SEP({
      SEP: tokens.Comma,
      DEF: () => this.SUBRULE(this.parameter),
    });
    this.CONSUME(tokens.RightParen);
  });

  private parameter = this.RULE("parameter", () => {
    this.CONSUME(tokens.Identifier);
    this.CONSUME(tokens.Colon);
    this.SUBRULE(this.type);
    this.OPTION(() => {
      this.CONSUME(tokens.Equals);
      this.SUBRULE(this.expression);
    });
  });

  // Type parameters
  private typeParameters = this.RULE("typeParameters", () => {
    this.CONSUME(tokens.LeftBracket);
    this.MANY_SEP({
      SEP: tokens.Comma,
      DEF: () => this.SUBRULE(this.typeParameter),
    });
    this.CONSUME(tokens.RightBracket);
  });

  private typeParameter = this.RULE("typeParameter", () => {
    this.CONSUME(tokens.Identifier);
  });

  // Extends clause
  private extendsClause = this.RULE("extendsClause", () => {
    this.CONSUME(tokens.Extends);
    this.SUBRULE(this.type);
    this.MANY(() => {
      this.CONSUME(tokens.With);
      this.SUBRULE2(this.type);
    });
  });

  // Class body
  private classBody = this.RULE("classBody", () => {
    this.CONSUME(tokens.LeftBrace);
    this.MANY(() => this.SUBRULE(this.classMember));
    this.CONSUME(tokens.RightBrace);
  });

  private classMember = this.RULE("classMember", () => {
    this.MANY(() => this.SUBRULE(this.modifier));
    this.OR([
      { ALT: () => this.SUBRULE(this.valDefinition) },
      { ALT: () => this.SUBRULE(this.varDefinition) },
      { ALT: () => this.SUBRULE(this.defDefinition) },
      { ALT: () => this.SUBRULE(this.classDefinition) },
      { ALT: () => this.SUBRULE(this.objectDefinition) },
      { ALT: () => this.SUBRULE(this.traitDefinition) },
    ]);
  });

  // Types
  private type = this.RULE("type", () => {
    this.SUBRULE(this.simpleType);
    this.MANY(() => {
      this.CONSUME(tokens.LeftBracket);
      this.SUBRULE2(this.type);
      this.CONSUME(tokens.RightBracket);
    });
  });

  private simpleType = this.RULE("simpleType", () => {
    this.SUBRULE(this.qualifiedIdentifier);
    this.OPTION(() => {
      this.CONSUME(tokens.LeftBracket);
      this.MANY_SEP({
        SEP: tokens.Comma,
        DEF: () => this.SUBRULE(this.type),
      });
      this.CONSUME(tokens.RightBracket);
    });
  });

  // Patterns
  private pattern = this.RULE("pattern", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.Identifier) },
      { ALT: () => this.CONSUME(tokens.Underscore) },
      { ALT: () => this.SUBRULE(this.literal) },
    ]);
  });

  // Expressions (simplified for MVP)
  private expression = this.RULE("expression", () => {
    this.SUBRULE(this.primaryExpression);
    this.MANY(() => {
      this.SUBRULE(this.infixOperator);
      this.SUBRULE2(this.primaryExpression);
    });
  });

  private primaryExpression = this.RULE("primaryExpression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.literal) },
      { ALT: () => this.CONSUME(tokens.Identifier) },
      { ALT: () => this.CONSUME(tokens.This) },
      {
        ALT: () => {
          this.CONSUME(tokens.LeftParen);
          this.SUBRULE(this.expression);
          this.CONSUME(tokens.RightParen);
        },
      },
      { ALT: () => this.SUBRULE(this.blockExpression) },
    ]);
  });

  private blockExpression = this.RULE("blockExpression", () => {
    this.CONSUME(tokens.LeftBrace);
    this.MANY(() => this.SUBRULE(this.blockStatement));
    this.OPTION(() => this.SUBRULE(this.expression));
    this.CONSUME(tokens.RightBrace);
  });

  private blockStatement = this.RULE("blockStatement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.valDefinition) },
      { ALT: () => this.SUBRULE(this.varDefinition) },
      { ALT: () => this.SUBRULE(this.defDefinition) },
      {
        ALT: () => {
          this.SUBRULE(this.expression);
          this.OPTION(() => this.CONSUME(tokens.Semicolon));
        },
      },
    ]);
  });

  private infixOperator = this.RULE("infixOperator", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.Plus) },
      { ALT: () => this.CONSUME(tokens.Minus) },
      { ALT: () => this.CONSUME(tokens.Star) },
      { ALT: () => this.CONSUME(tokens.Slash) },
      { ALT: () => this.CONSUME(tokens.Percent) },
      { ALT: () => this.CONSUME(tokens.LessThan) },
      { ALT: () => this.CONSUME(tokens.GreaterThan) },
      { ALT: () => this.CONSUME(tokens.LessThanEquals) },
      { ALT: () => this.CONSUME(tokens.GreaterThanEquals) },
      { ALT: () => this.CONSUME(tokens.EqualsEquals) },
      { ALT: () => this.CONSUME(tokens.NotEquals) },
      { ALT: () => this.CONSUME(tokens.Dot) },
    ]);
  });

  // Literals
  private literal = this.RULE("literal", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.IntegerLiteral) },
      { ALT: () => this.CONSUME(tokens.FloatingPointLiteral) },
      { ALT: () => this.CONSUME(tokens.StringLiteral) },
      { ALT: () => this.CONSUME(tokens.CharLiteral) },
      { ALT: () => this.CONSUME(tokens.True) },
      { ALT: () => this.CONSUME(tokens.False) },
      { ALT: () => this.CONSUME(tokens.Null) },
    ]);
  });

  // Qualified identifier
  private qualifiedIdentifier = this.RULE("qualifiedIdentifier", () => {
    this.CONSUME(tokens.Identifier);
    this.MANY(() => {
      this.CONSUME(tokens.Dot);
      this.CONSUME2(tokens.Identifier);
    });
  });
}

// Export singleton parser instance
export const parserInstance = new ScalaParser();

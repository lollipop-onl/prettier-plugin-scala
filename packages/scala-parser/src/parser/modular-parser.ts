/**
 * Modular Scala parser that combines all parser modules
 */
import * as tokens from "../lexer.js";
import { DefinitionParserMixin } from "./definitions.js";
import { ExpressionParserMixin } from "./expressions.js";
import { LiteralParserMixin } from "./literals.js";
import { PatternParserMixin } from "./patterns.js";
import { Scala3ParserMixin } from "./scala3.js";
import { StatementParserMixin } from "./statements.js";
import { TypeParserMixin } from "./types.js";
import { CstParser } from "chevrotain";

export class ModularScalaParser extends CstParser {
  // Parser modules
  private statements: StatementParserMixin;
  private definitions: DefinitionParserMixin;
  private expressions: ExpressionParserMixin;
  private types: TypeParserMixin;
  private patterns: PatternParserMixin;
  private literals: LiteralParserMixin;
  private scala3: Scala3ParserMixin;

  constructor() {
    super(tokens.allTokens);

    // Initialize parser mixins
    this.statements = new StatementParserMixin(this as any);
    this.definitions = new DefinitionParserMixin(this as any);
    this.expressions = new ExpressionParserMixin(this as any);
    this.types = new TypeParserMixin(this as any);
    this.patterns = new PatternParserMixin(this as any);
    this.literals = new LiteralParserMixin(this as any);
    this.scala3 = new Scala3ParserMixin(this as any);

    // Wire up cross-module dependencies
    this.setupDependencies();

    this.performSelfAnalysis();
  }

  // Wire up dependencies between modules
  private setupDependencies() {
    // Statement dependencies
    this.statements.qualifiedIdentifier = this.qualifiedIdentifier;
    this.statements.importSelector = this.importSelector;
    this.statements.exportSelector = this.statements.exportSelector;
    this.statements.expression = this.expressions.expression;

    // Definition dependencies
    this.definitions.annotation = this.annotation;
    this.definitions.modifier = this.modifier;
    this.definitions.typeParameters = this.types.typeParameters;
    this.definitions.classParameters = this.classParameters;
    this.definitions.extendsClause = this.extendsClause;
    this.definitions.classBody = this.classBody;
    this.definitions.type = this.types.type;
    this.definitions.expression = this.expressions.expression;
    this.definitions.pattern = this.patterns.pattern;
    this.definitions.parameterLists = this.parameterLists;

    // Expression dependencies
    this.expressions.annotation = this.annotation;
    this.expressions.modifier = this.modifier;
    this.expressions.type = this.types.type;
    this.expressions.literal = this.literals.literal;
    this.expressions.qualifiedIdentifier = this.qualifiedIdentifier;
    this.expressions.pattern = this.patterns.pattern;
    this.expressions.blockExpression = this.blockExpression;
    this.expressions.parameterLists = this.parameterLists;
    this.expressions.typeArgument = this.types.typeArgument;
    this.expressions.caseClause = this.patterns.caseClause;
    this.expressions.generator = this.patterns.generator;
    this.expressions.polymorphicTypeParameter = this.types.typeLambdaParameter;
    this.expressions.blockStatement = this.blockStatement;

    // Type dependencies
    this.types.qualifiedIdentifier = this.qualifiedIdentifier;
    this.types.expression = this.expressions.expression;
    this.types.literal = this.literals.literal;

    // Pattern dependencies
    this.patterns.literal = this.literals.literal;
    this.patterns.qualifiedIdentifier = this.qualifiedIdentifier;
    this.patterns.type = this.types.type;
    this.patterns.expression = this.expressions.expression;

    // Scala3 dependencies
    this.scala3.annotation = this.annotation;
    this.scala3.modifier = this.modifier;
    this.scala3.typeParameters = this.types.typeParameters;
    this.scala3.type = this.types.type;
    this.scala3.expression = this.expressions.expression;
    this.scala3.pattern = this.patterns.pattern;
    this.scala3.parameterLists = this.parameterLists;
    this.scala3.classBody = this.classBody;
    this.scala3.extendsClause = this.extendsClause;
    this.scala3.qualifiedIdentifier = this.qualifiedIdentifier;
    this.scala3.valDefinition = this.definitions.valDefinition;
    this.scala3.defDefinition = this.definitions.defDefinition;
    this.scala3.typeDefinition = this.definitions.typeDefinition;
    this.scala3.classMember = this.classMember;
  }

  // Entry point
  public compilationUnit = this.RULE("compilationUnit", () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statements.packageClause) },
        { ALT: () => this.SUBRULE(this.statements.importClause) },
        { ALT: () => this.SUBRULE(this.scala3.exportClause) },
        {
          ALT: () => {
            this.SUBRULE(this.statements.assignmentStatement);
            this.OPTION(() => this.CONSUME(tokens.Semicolon));
          },
          GATE: () => {
            const la1 = this.LA(1);
            const la2 = this.LA(2);

            if (!la1 || la1.tokenType !== tokens.Identifier) {
              return false;
            }

            if (!la2) {
              return false;
            }

            return (
              la2.tokenType === tokens.SbtAssign ||
              la2.tokenType === tokens.PlusEquals ||
              la2.tokenType === tokens.MinusEquals ||
              la2.tokenType === tokens.StarEquals ||
              la2.tokenType === tokens.SlashEquals ||
              la2.tokenType === tokens.PercentEquals ||
              la2.tokenType === tokens.AppendEquals
            );
          },
        },
        { ALT: () => this.SUBRULE(this.topLevelDefinition) },
        {
          ALT: () => {
            this.SUBRULE(this.expressions.expression);
            this.OPTION2(() =>
              this.CONSUME(tokens.Semicolon, { LABEL: "Semicolon2" }),
            );
          },
        },
      ]);
    });
  });

  // Top-level definition with modifiers and annotations
  private topLevelDefinition = this.RULE("topLevelDefinition", () => {
    this.MANY(() => this.SUBRULE(this.annotation));
    this.MANY2(() => this.SUBRULE(this.modifier));
    this.OR([
      { ALT: () => this.SUBRULE(this.definitions.classDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.objectDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.traitDefinition) },
      { ALT: () => this.SUBRULE(this.scala3.enumDefinition) },
      { ALT: () => this.SUBRULE(this.scala3.extensionDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.valDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.varDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.defDefinition) },
      { ALT: () => this.SUBRULE(this.scala3.givenDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.typeDefinition) },
    ]);
  });

  // Common rules that don't fit into specific modules
  private annotation = this.RULE("annotation", () => {
    this.CONSUME(tokens.At);
    this.SUBRULE(this.qualifiedIdentifier);
    this.OPTION(() => {
      this.CONSUME(tokens.LeftParen);
      this.MANY_SEP({
        SEP: tokens.Comma,
        DEF: () => this.SUBRULE(this.annotationArgument),
      });
      this.CONSUME(tokens.RightParen);
    });
  });

  private annotationArgument = this.RULE("annotationArgument", () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(tokens.Identifier);
          this.CONSUME(tokens.Equals);
          this.SUBRULE(this.expressions.expression);
        },
        GATE: () => {
          const la1 = this.LA(1);
          const la2 = this.LA(2);
          return (
            la1?.tokenType === tokens.Identifier &&
            la2?.tokenType === tokens.Equals
          );
        },
      },
      {
        ALT: () =>
          this.SUBRULE(this.expressions.expression, { LABEL: "expression2" }),
      },
    ]);
  });

  private modifier = this.RULE("modifier", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.Abstract) },
      { ALT: () => this.CONSUME(tokens.Final) },
      { ALT: () => this.CONSUME(tokens.Sealed) },
      { ALT: () => this.CONSUME(tokens.Implicit) },
      { ALT: () => this.CONSUME(tokens.Lazy) },
      { ALT: () => this.CONSUME(tokens.Override) },
      { ALT: () => this.CONSUME(tokens.Private) },
      { ALT: () => this.CONSUME(tokens.Protected) },
      { ALT: () => this.CONSUME(tokens.Inline) },
      { ALT: () => this.CONSUME(tokens.Transparent) },
      { ALT: () => this.CONSUME(tokens.Opaque) },
    ]);
  });

  private qualifiedIdentifier = this.RULE("qualifiedIdentifier", () => {
    this.CONSUME(tokens.Identifier);
    this.MANY(() => {
      this.CONSUME(tokens.Dot);
      this.CONSUME(tokens.Identifier, { LABEL: "Identifier2" });
    });
  });

  // Placeholder rules (to be fully implemented)
  private importSelector = this.RULE("importSelector", () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(tokens.Identifier);
          this.OPTION(() => {
            this.OR2([
              {
                ALT: () => {
                  this.CONSUME(tokens.Arrow);
                  this.CONSUME(tokens.Identifier, { LABEL: "Identifier2" });
                },
              },
              {
                ALT: () => {
                  this.CONSUME(tokens.Arrow, { LABEL: "Arrow2" });
                  this.CONSUME(tokens.Underscore);
                },
              },
            ]);
          });
        },
      },
    ]);
  });

  private classParameters = this.RULE("classParameters", () => {
    this.CONSUME(tokens.LeftParen);
    this.MANY_SEP({
      SEP: tokens.Comma,
      DEF: () => this.SUBRULE(this.classParameter),
    });
    this.CONSUME(tokens.RightParen);
  });

  private classParameter = this.RULE("classParameter", () => {
    this.MANY(() => this.SUBRULE(this.annotation));
    this.MANY2(() => this.SUBRULE(this.modifier));
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(tokens.Val) },
        { ALT: () => this.CONSUME(tokens.Var) },
      ]);
    });
    this.CONSUME(tokens.Identifier);
    this.CONSUME(tokens.Colon);
    this.SUBRULE(this.types.type);
    this.OPTION2(() => {
      this.CONSUME(tokens.Equals);
      this.SUBRULE(this.expressions.expression);
    });
  });

  private extendsClause = this.RULE("extendsClause", () => {
    this.CONSUME(tokens.Extends);
    this.SUBRULE(this.types.type);
    this.MANY(() => {
      this.CONSUME(tokens.With);
      this.SUBRULE(this.types.type, { LABEL: "type2" });
    });
  });

  private classBody = this.RULE("classBody", () => {
    this.CONSUME(tokens.LeftBrace);
    this.MANY(() => {
      this.SUBRULE(this.classMember);
      this.OPTION(() => this.CONSUME(tokens.Semicolon));
    });
    this.CONSUME(tokens.RightBrace);
  });

  private classMember = this.RULE("classMember", () => {
    this.MANY(() => this.SUBRULE(this.annotation));
    this.MANY2(() => this.SUBRULE(this.modifier));
    this.OR([
      { ALT: () => this.SUBRULE(this.definitions.valDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.varDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.defDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.typeDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.classDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.objectDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.traitDefinition) },
    ]);
  });

  private parameterLists = this.RULE("parameterLists", () => {
    this.MANY(() => this.SUBRULE(this.parameterList));
  });

  private parameterList = this.RULE("parameterList", () => {
    this.CONSUME(tokens.LeftParen);
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(tokens.Implicit) },
        { ALT: () => this.CONSUME(tokens.Using) },
      ]);
    });
    this.MANY_SEP({
      SEP: tokens.Comma,
      DEF: () => this.SUBRULE(this.parameter),
    });
    this.CONSUME(tokens.RightParen);
  });

  private parameter = this.RULE("parameter", () => {
    this.MANY(() => this.SUBRULE(this.annotation));
    this.CONSUME(tokens.Identifier);
    this.CONSUME(tokens.Colon);
    this.SUBRULE(this.types.type);
    this.OPTION(() => {
      this.CONSUME(tokens.Equals);
      this.SUBRULE(this.expressions.expression);
    });
  });

  private blockExpression = this.RULE("blockExpression", () => {
    this.CONSUME(tokens.LeftBrace);
    this.MANY(() => {
      this.SUBRULE(this.blockStatement);
      this.OPTION(() => this.CONSUME(tokens.Semicolon));
    });
    this.CONSUME(tokens.RightBrace);
  });

  private blockStatement = this.RULE("blockStatement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.statements.importClause) },
      { ALT: () => this.SUBRULE(this.definitions.valDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.varDefinition) },
      { ALT: () => this.SUBRULE(this.definitions.defDefinition) },
      { ALT: () => this.SUBRULE(this.expressions.expression) },
    ]);
  });
}

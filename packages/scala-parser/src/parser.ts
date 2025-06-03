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
        {
          ALT: () => {
            this.SUBRULE(this.expression);
            this.OPTION(() => this.CONSUME(tokens.Semicolon));
          },
        },
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
      { ALT: () => this.SUBRULE(this.givenDefinition) },
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
    this.OR([
      { ALT: () => this.CONSUME(tokens.Identifier) },
      { ALT: () => this.CONSUME(tokens.This) }, // For auxiliary constructors
    ]);
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

  // Given definition (Scala 3)
  private givenDefinition = this.RULE("givenDefinition", () => {
    this.CONSUME(tokens.Given);
    this.OPTION(() => this.CONSUME(tokens.Identifier));
    this.OPTION2(() => {
      this.CONSUME(tokens.Colon);
      this.SUBRULE(this.type);
    });
    this.CONSUME(tokens.Equals);
    this.SUBRULE(this.expression);
    this.OPTION3(() => this.CONSUME(tokens.Semicolon));
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
    this.OPTION(() => this.CONSUME(tokens.Using));
    this.CONSUME(tokens.Identifier);
    this.CONSUME(tokens.Colon);
    this.SUBRULE(this.type);
    this.OPTION2(() => {
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
    this.OPTION(() => {
      this.OR([
        {
          ALT: () => {
            this.CONSUME(tokens.SubtypeOf);
            this.SUBRULE(this.type);
          },
        },
        {
          ALT: () => {
            this.CONSUME(tokens.SupertypeOf);
            this.SUBRULE2(this.type);
          },
        },
      ]);
    });
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
      { ALT: () => this.SUBRULE(this.givenDefinition) },
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
    // Try lambda expression with backtracking
    this.OR([
      {
        ALT: () => {
          // Lambda with parameter list: (x: Int, y: Int) => x + y
          this.SUBRULE(this.parameterList);
          this.CONSUME(tokens.Arrow);
          this.SUBRULE(this.expression);
        },
        GATE: () => {
          // Only try if we see ( followed by parameter pattern
          const la2 = this.LA(2);
          const la3 = this.LA(3);
          return (
            la2 &&
            la2.tokenType === tokens.Identifier &&
            la3 &&
            la3.tokenType === tokens.Colon
          );
        },
      },
      {
        ALT: () => {
          // Simple lambda: x => x * 2
          this.CONSUME(tokens.Identifier);
          this.CONSUME2(tokens.Arrow);
          this.SUBRULE2(this.expression);
        },
        GATE: () => {
          // Only try lambda if we see Identifier followed by Arrow
          const nextTokens = this.LA(2);
          return nextTokens && nextTokens.tokenType === tokens.Arrow;
        },
      },
      {
        ALT: () => this.SUBRULE(this.assignmentOrInfixExpression),
      },
    ]);
  });

  private assignmentOrInfixExpression = this.RULE(
    "assignmentOrInfixExpression",
    () => {
      this.SUBRULE(this.postfixExpression);
      // First check for compound assignment
      this.OPTION(() => {
        this.OR([
          { ALT: () => this.CONSUME(tokens.PlusEquals) },
          { ALT: () => this.CONSUME(tokens.MinusEquals) },
          { ALT: () => this.CONSUME(tokens.StarEquals) },
          { ALT: () => this.CONSUME(tokens.SlashEquals) },
          { ALT: () => this.CONSUME(tokens.PercentEquals) },
        ]);
        this.SUBRULE3(this.expression);
      });
      // Then handle infix operators
      this.MANY(() => {
        this.SUBRULE(this.infixOperator);
        this.SUBRULE2(this.postfixExpression);
      });
    },
  );

  private postfixExpression = this.RULE("postfixExpression", () => {
    this.SUBRULE(this.primaryExpression);
    this.MANY(() => {
      this.OR([
        {
          ALT: () => {
            this.CONSUME(tokens.Dot);
            this.CONSUME(tokens.Identifier);
            this.OPTION(() => {
              this.CONSUME(tokens.LeftParen);
              this.OPTION2(() => {
                this.MANY_SEP({
                  SEP: tokens.Comma,
                  DEF: () => this.SUBRULE4(this.expression),
                });
              });
              this.CONSUME(tokens.RightParen);
            });
          },
        },
        {
          ALT: () => {
            this.CONSUME2(tokens.LeftParen);
            this.MANY_SEP2({
              SEP: tokens.Comma,
              DEF: () => this.SUBRULE2(this.expression),
            });
            this.CONSUME2(tokens.RightParen);
          },
        },
        {
          ALT: () => {
            this.CONSUME(tokens.Match);
            this.CONSUME(tokens.LeftBrace);
            this.MANY2(() => this.SUBRULE(this.caseClause));
            this.CONSUME(tokens.RightBrace);
          },
        },
        {
          ALT: () => {
            // Type parameters only: List[Int], Map[String, Int]
            this.CONSUME(tokens.LeftBracket);
            this.MANY_SEP3({
              SEP: tokens.Comma,
              DEF: () => this.SUBRULE5(this.type),
            });
            this.CONSUME(tokens.RightBracket);
            // Arguments are optional after type parameters
            this.OPTION3(() => {
              this.CONSUME3(tokens.LeftParen);
              this.MANY_SEP4({
                SEP: tokens.Comma,
                DEF: () => this.SUBRULE6(this.expression),
              });
              this.CONSUME3(tokens.RightParen);
            });
          },
        },
      ]);
    });
  });

  private primaryExpression = this.RULE("primaryExpression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.literal) },
      { ALT: () => this.CONSUME(tokens.Identifier) },
      { ALT: () => this.CONSUME(tokens.This) },
      { ALT: () => this.SUBRULE(this.newExpression) },
      { ALT: () => this.SUBRULE(this.forExpression) },
      {
        ALT: () => {
          // Unary negation: !expression
          this.CONSUME(tokens.Exclamation);
          this.SUBRULE(this.postfixExpression);
        },
      },
      {
        ALT: () => {
          // Bitwise complement: ~expression
          this.CONSUME(tokens.BitwiseTilde);
          this.SUBRULE2(this.postfixExpression);
        },
      },
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

  private newExpression = this.RULE("newExpression", () => {
    this.CONSUME(tokens.New);
    this.SUBRULE(this.type);
    this.OPTION(() => {
      this.CONSUME(tokens.LeftParen);
      this.MANY_SEP({
        SEP: tokens.Comma,
        DEF: () => this.SUBRULE(this.expression),
      });
      this.CONSUME(tokens.RightParen);
    });
  });

  private caseClause = this.RULE("caseClause", () => {
    this.CONSUME(tokens.Case);
    this.SUBRULE(this.pattern);
    this.OPTION(() => {
      this.CONSUME(tokens.If);
      this.SUBRULE(this.expression);
    });
    this.CONSUME(tokens.Arrow);
    this.SUBRULE2(this.expression);
  });

  private forExpression = this.RULE("forExpression", () => {
    this.CONSUME(tokens.For);
    this.OR([
      {
        ALT: () => {
          this.CONSUME(tokens.LeftParen);
          this.MANY_SEP({
            SEP: tokens.Semicolon,
            DEF: () => this.SUBRULE(this.generator),
          });
          this.CONSUME(tokens.RightParen);
        },
      },
      {
        ALT: () => {
          this.CONSUME(tokens.LeftBrace);
          this.MANY(() => this.SUBRULE2(this.generator));
          this.CONSUME(tokens.RightBrace);
        },
      },
    ]);
    this.OPTION(() => this.CONSUME(tokens.Yield));
    this.SUBRULE(this.expression);
  });

  private generator = this.RULE("generator", () => {
    this.SUBRULE(this.pattern);
    this.CONSUME(tokens.LeftArrow);
    this.SUBRULE(this.expression);
    this.MANY(() => {
      this.CONSUME(tokens.If);
      this.SUBRULE2(this.expression);
    });
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
          // Try assignment statement first
          this.SUBRULE(this.assignmentStatement);
          this.OPTION(() => this.CONSUME(tokens.Semicolon));
        },
        GATE: () => {
          // Check if this looks like an assignment
          const first = this.LA(1);
          const second = this.LA(2);
          return (
            first.tokenType === tokens.Identifier &&
            (second.tokenType === tokens.PlusEquals ||
              second.tokenType === tokens.MinusEquals ||
              second.tokenType === tokens.StarEquals ||
              second.tokenType === tokens.SlashEquals ||
              second.tokenType === tokens.PercentEquals ||
              second.tokenType === tokens.Equals)
          );
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.expression);
          this.OPTION2(() => this.CONSUME2(tokens.Semicolon));
        },
      },
    ]);
  });

  private assignmentStatement = this.RULE("assignmentStatement", () => {
    this.CONSUME(tokens.Identifier);
    this.OR([
      { ALT: () => this.CONSUME(tokens.Equals) },
      { ALT: () => this.CONSUME(tokens.PlusEquals) },
      { ALT: () => this.CONSUME(tokens.MinusEquals) },
      { ALT: () => this.CONSUME(tokens.StarEquals) },
      { ALT: () => this.CONSUME(tokens.SlashEquals) },
      { ALT: () => this.CONSUME(tokens.PercentEquals) },
    ]);
    this.SUBRULE(this.expression);
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
      { ALT: () => this.CONSUME(tokens.LogicalAnd) },
      { ALT: () => this.CONSUME(tokens.LogicalOr) },
      { ALT: () => this.CONSUME(tokens.BitwiseAnd) },
      { ALT: () => this.CONSUME(tokens.BitwiseOr) },
      { ALT: () => this.CONSUME(tokens.BitwiseXor) },
      { ALT: () => this.CONSUME(tokens.LeftShift) },
      { ALT: () => this.CONSUME(tokens.RightShift) },
      { ALT: () => this.CONSUME(tokens.UnsignedRightShift) },
      { ALT: () => this.CONSUME(tokens.AppendOp) },
      { ALT: () => this.CONSUME(tokens.PrependOp) },
      { ALT: () => this.CONSUME(tokens.ConcatOp) },
      { ALT: () => this.CONSUME(tokens.Dot) },
      { ALT: () => this.CONSUME(tokens.To) },
      { ALT: () => this.CONSUME(tokens.Identifier) }, // For general infix methods
    ]);
  });

  // Literals
  private literal = this.RULE("literal", () => {
    this.OR([
      { ALT: () => this.CONSUME(tokens.IntegerLiteral) },
      { ALT: () => this.CONSUME(tokens.FloatingPointLiteral) },
      { ALT: () => this.CONSUME(tokens.InterpolatedStringLiteral) },
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

/**
 * Expression visitor methods for handling various expression types
 */
import { formatStringLiteral } from "./utils.js";
import type { PrintContext, CSTNode } from "./utils.js";

export interface ExpressionVisitor {
  visit(node: CSTNode, ctx: PrintContext): string;
}

export class ExpressionVisitorMethods {
  private visitor: ExpressionVisitor;

  constructor(visitor: ExpressionVisitor) {
    this.visitor = visitor;
  }

  visitExpression(node: CSTNode, ctx: PrintContext): string {
    // Handle PartialFunction literals: { case ... }
    if (node.children.partialFunctionLiteral) {
      return this.visitor.visit(node.children.partialFunctionLiteral[0], ctx);
    }

    // Handle lambda expressions with parameter list: (x: Int, y: Int) => x + y
    if (node.children.parameterList && node.children.Arrow) {
      return (
        this.visitor.visit(node.children.parameterList[0], ctx) +
        " => " +
        this.visitor.visit(node.children.expression[0], ctx)
      );
    }

    // Handle block lambda expressions: { x => ... }
    if (
      node.children.LeftBrace &&
      node.children.Identifier &&
      node.children.Arrow
    ) {
      let result = "{ " + node.children.Identifier[0].image + " =>";

      const statements = [];

      // Add statements (val/var/def definitions)
      if (node.children.blockStatement) {
        statements.push(
          ...node.children.blockStatement.map((stmt: any) =>
            this.visitor.visit(stmt, ctx),
          ),
        );
      }

      // Add final expression
      if (node.children.expression) {
        statements.push(this.visitor.visit(node.children.expression[0], ctx));
      }

      if (statements.length === 0) {
        result += " }";
      } else if (statements.length === 1) {
        // Single expression - keep on same line if short
        const stmt = statements[0];
        if (stmt.length < 50) {
          result += " " + stmt + " }";
        } else {
          result += "\n  " + stmt + "\n}";
        }
      } else {
        // Multiple statements - use multiple lines
        const indentedStmts = statements.map((stmt) => "  " + stmt);
        result += "\n" + indentedStmts.join("\n") + "\n}";
      }

      return result;
    }

    // Handle polymorphic function literal: [T] => (x: T) => x
    if (node.children.polymorphicFunctionLiteral) {
      return this.visitor.visit(
        node.children.polymorphicFunctionLiteral[0],
        ctx,
      );
    }

    // Handle simple lambda expressions: x => x * 2
    if (node.children.Identifier && node.children.Arrow) {
      return (
        node.children.Identifier[0].image +
        " => " +
        this.visitor.visit(node.children.expression[0], ctx)
      );
    }

    // Handle assignmentOrInfixExpression
    if (node.children.assignmentOrInfixExpression) {
      return this.visitor.visit(
        node.children.assignmentOrInfixExpression[0],
        ctx,
      );
    }

    // Handle regular expressions (fallback for older structure)
    if (node.children.postfixExpression) {
      let result = this.visitor.visit(node.children.postfixExpression[0], ctx);

      if (node.children.infixOperator) {
        for (let i = 0; i < node.children.infixOperator.length; i++) {
          result +=
            " " +
            this.visitor.visit(node.children.infixOperator[i], ctx) +
            " " +
            this.visitor.visit(node.children.postfixExpression[i + 1], ctx);
        }
      }

      return result;
    }

    return "";
  }

  visitPostfixExpression(node: CSTNode, ctx: PrintContext): string {
    let result = this.visitor.visit(node.children.primaryExpression[0], ctx);

    // Handle method calls and member access
    if (node.children.Dot) {
      const identifiers = node.children.Identifier || [];

      for (let i = 0; i < node.children.Dot.length; i++) {
        result += ".";

        // Handle member access or method call
        // Identifiers after the first one correspond to members after dots
        if (identifiers.length > i) {
          result += identifiers[i].image;
        }

        // Add arguments if this is a method call
        if (node.children.LeftParen && node.children.LeftParen[i]) {
          result += "(";

          // Find expressions for this argument list
          const startIdx = i * 10; // Rough heuristic for argument grouping
          const expressions = node.children.expression || [];
          const relevantExpressions = expressions.slice(
            startIdx,
            startIdx + 10,
          );

          if (relevantExpressions.length > 0) {
            const args = relevantExpressions.map((e: any) =>
              this.visitor.visit(e, ctx),
            );
            result += args.join(", ");
          }

          result += ")";
        }
      }
    }

    // Handle type arguments
    if (node.children.LeftBracket) {
      result += "[";
      if (node.children.type) {
        const types = node.children.type.map((t: any) =>
          this.visitor.visit(t, ctx),
        );
        result += types.join(", ");
      }
      result += "]";
    }

    // Handle match expressions
    if (node.children.Match) {
      result += " match {\n";
      if (node.children.caseClause) {
        const cases = node.children.caseClause.map(
          (c: any) => "  " + this.visitor.visit(c, ctx),
        );
        result += cases.join("\n");
        result += "\n";
      }
      result += "}";
    }

    // Handle method application without dot
    if (node.children.LeftParen && !node.children.Dot) {
      result += "(";
      if (node.children.expression) {
        const args = node.children.expression.map((e: any) =>
          this.visitor.visit(e, ctx),
        );
        result += args.join(", ");
      }
      result += ")";
    }

    return result;
  }

  visitPrimaryExpression(node: CSTNode, ctx: PrintContext): string {
    if (node.children.literal) {
      return this.visitor.visit(node.children.literal[0], ctx);
    } else if (node.children.Identifier) {
      return node.children.Identifier[0].image;
    } else if (node.children.This) {
      return "this";
    } else if (node.children.partialFunctionLiteral) {
      return this.visitor.visit(node.children.partialFunctionLiteral[0], ctx);
    } else if (node.children.newExpression) {
      return this.visitor.visit(node.children.newExpression[0], ctx);
    } else if (node.children.forExpression) {
      return this.visitor.visit(node.children.forExpression[0], ctx);
    } else if (node.children.ifExpression) {
      return this.visitor.visit(node.children.ifExpression[0], ctx);
    } else if (node.children.whileExpression) {
      return this.visitor.visit(node.children.whileExpression[0], ctx);
    } else if (node.children.tryExpression) {
      return this.visitor.visit(node.children.tryExpression[0], ctx);
    } else if (node.children.Exclamation) {
      // Handle negation operator
      return "!" + this.visitor.visit(node.children.postfixExpression[0], ctx);
    } else if (node.children.BitwiseTilde) {
      // Handle bitwise complement operator
      return "~" + this.visitor.visit(node.children.postfixExpression[0], ctx);
    } else if (node.children.LeftParen) {
      return "(" + this.visitor.visit(node.children.expression[0], ctx) + ")";
    } else if (node.children.blockExpression) {
      return this.visitor.visit(node.children.blockExpression[0], ctx);
    } else if (node.children.quoteExpression) {
      return this.visitor.visit(node.children.quoteExpression[0], ctx);
    } else if (node.children.spliceExpression) {
      return this.visitor.visit(node.children.spliceExpression[0], ctx);
    }

    return "";
  }

  visitAssignmentOrInfixExpression(node: CSTNode, ctx: PrintContext): string {
    let result = this.visitor.visit(node.children.postfixExpression[0], ctx);

    // Handle assignment operators (including named arguments)
    if (
      node.children.Equals ||
      node.children.PlusEquals ||
      node.children.MinusEquals ||
      node.children.StarEquals ||
      node.children.SlashEquals ||
      node.children.PercentEquals ||
      node.children.SbtAssign
    ) {
      const operator =
        node.children.Equals?.[0] ||
        node.children.PlusEquals?.[0] ||
        node.children.MinusEquals?.[0] ||
        node.children.StarEquals?.[0] ||
        node.children.SlashEquals?.[0] ||
        node.children.PercentEquals?.[0] ||
        node.children.SbtAssign?.[0];
      result += " " + operator.image + " ";
      result += this.visitor.visit(node.children.expression[0], ctx);
    }

    // Handle infix operators
    if (node.children.infixOperator) {
      for (let i = 0; i < node.children.infixOperator.length; i++) {
        result +=
          " " +
          this.visitor.visit(node.children.infixOperator[i], ctx) +
          " " +
          this.visitor.visit(node.children.postfixExpression[i + 1], ctx);
      }
    }

    return result;
  }

  visitInfixOperator(node: CSTNode, _ctx: PrintContext): string {
    const children = node.children as Record<string, any[]>;
    const token = Object.values(children)[0][0];
    return token.image;
  }

  visitLiteral(node: any, ctx: PrintContext): string {
    const children = node.children as Record<string, any[]>;
    const token = Object.values(children)[0][0];
    const tokenImage = token.image;

    // Apply singleQuote formatting to string literals
    if (tokenImage.startsWith('"') || tokenImage.startsWith("'")) {
      return formatStringLiteral(tokenImage, ctx);
    }

    return tokenImage;
  }

  visitQualifiedIdentifier(node: any, _ctx: PrintContext): string {
    let result = node.children.Identifier[0].image;

    if (node.children.Dot) {
      // Handle mixed identifiers and type keywords
      const dots = node.children.Dot.length;
      const identifiers = node.children.Identifier || [];
      const types = node.children.Type || [];

      for (let i = 0; i < dots; i++) {
        result += ".";

        // Determine which token comes next (identifier or type keyword)
        if (i + 1 < identifiers.length) {
          result += identifiers[i + 1].image;
        } else if (types.length > 0) {
          // Use the type keyword (e.g., "type" for .type syntax)
          result += types[0].image;
        }
      }
    }

    return result;
  }

  visitNewExpression(node: any, ctx: PrintContext): string {
    let result = "new " + this.visitor.visit(node.children.type[0], ctx);

    if (node.children.LeftParen) {
      result += "(";
      if (node.children.expression) {
        const args = node.children.expression.map((e: any) =>
          this.visitor.visit(e, ctx),
        );
        result += args.join(", ");
      }
      result += ")";
    }

    return result;
  }

  visitIfExpression(node: any, ctx: PrintContext): string {
    let result = "if (";
    result += this.visitor.visit(node.children.expression[0], ctx);
    result += ") ";
    result += this.visitor.visit(node.children.expression[1], ctx);

    if (node.children.Else) {
      result += " else ";
      result += this.visitor.visit(node.children.expression[2], ctx);
    }

    return result;
  }

  visitWhileExpression(node: any, ctx: PrintContext): string {
    let result = "while (";
    result += this.visitor.visit(node.children.expression[0], ctx);
    result += ") ";
    result += this.visitor.visit(node.children.expression[1], ctx);

    return result;
  }

  visitTryExpression(node: any, ctx: PrintContext): string {
    let result = "try ";
    result += this.visitor.visit(node.children.expression[0], ctx);

    if (node.children.Catch) {
      result += " catch {\n";
      if (node.children.caseClause) {
        const cases = node.children.caseClause.map(
          (c: any) => "  " + this.visitor.visit(c, ctx),
        );
        result += cases.join("\n");
      }
      result += "\n}";
    }

    if (node.children.Finally) {
      result += " finally ";
      // If there's a catch block, expression[1] is the finally expression
      // Otherwise, expression[1] would be the finally expression (no catch)
      const finallyExprIndex = node.children.Catch ? 1 : 1;
      result += this.visitor.visit(
        node.children.expression[finallyExprIndex],
        ctx,
      );
    }

    return result;
  }

  visitForExpression(node: any, ctx: PrintContext): string {
    let result = "for ";

    if (node.children.LeftParen) {
      result += "(";
      if (node.children.generator) {
        const gens = node.children.generator.map((g: any) =>
          this.visitor.visit(g, ctx),
        );
        result += gens.join("; ");
      }
      result += ")";
    } else if (node.children.LeftBrace) {
      result += "{\n";
      if (node.children.generator) {
        const gens = node.children.generator.map(
          (g: any) => "  " + this.visitor.visit(g, ctx),
        );
        result += gens.join("\n");
      }
      result += "\n}";
    }

    if (node.children.Yield) {
      result += " yield ";
    } else {
      result += " ";
    }

    result += this.visitor.visit(node.children.expression[0], ctx);

    return result;
  }

  visitGenerator(node: any, ctx: PrintContext): string {
    let result = this.visitor.visit(node.children.pattern[0], ctx);
    result += " <- " + this.visitor.visit(node.children.expression[0], ctx);

    if (node.children.If) {
      for (let i = 0; i < node.children.If.length; i++) {
        result +=
          " if " + this.visitor.visit(node.children.expression[i + 1], ctx);
      }
    }

    return result;
  }

  visitCaseClause(node: any, ctx: PrintContext): string {
    let result = "case " + this.visitor.visit(node.children.pattern[0], ctx);

    if (node.children.If) {
      result += " if " + this.visitor.visit(node.children.expression[0], ctx);
    }

    result +=
      " => " +
      this.visitor.visit(
        node.children.expression[node.children.If ? 1 : 0],
        ctx,
      );

    return result;
  }

  visitBlockExpression(node: any, ctx: PrintContext): string {
    if (!node.children.blockStatement && !node.children.expression) {
      return "{}";
    }

    let result = "{\n";
    const statements = [];

    if (node.children.blockStatement) {
      statements.push(
        ...node.children.blockStatement.map((stmt: any) =>
          this.visitor.visit(stmt, ctx),
        ),
      );
    }

    if (node.children.expression) {
      statements.push(this.visitor.visit(node.children.expression[0], ctx));
    }

    result += statements.map((stmt) => "  " + stmt).join("\n");
    result += "\n}";
    return result;
  }

  visitPartialFunctionLiteral(node: any, ctx: PrintContext): string {
    let result = "{\n";

    if (node.children.caseClause) {
      const cases = node.children.caseClause.map(
        (c: any) => "  " + this.visitor.visit(c, ctx),
      );
      result += cases.join("\n");
    }

    result += "\n}";
    return result;
  }

  visitAssignmentStatement(node: any, ctx: PrintContext): string {
    let result = node.children.Identifier[0].image;

    const operator =
      node.children.Equals?.[0] ||
      node.children.PlusEquals?.[0] ||
      node.children.MinusEquals?.[0] ||
      node.children.StarEquals?.[0] ||
      node.children.SlashEquals?.[0] ||
      node.children.PercentEquals?.[0] ||
      node.children.SbtAssign?.[0];

    result += " " + operator.image + " ";
    result += this.visitor.visit(node.children.expression[0], ctx);

    return result;
  }
}

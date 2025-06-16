/**
 * Expression visitor methods for handling various expression types
 */
import {
  formatStringLiteral,
  getChildNodes,
  getFirstChild,
  getChildren,
} from "./utils.js";
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
    const partialFunctionLiteral = getFirstChild(
      node,
      "partialFunctionLiteral",
    );
    if (partialFunctionLiteral) {
      return this.visitor.visit(partialFunctionLiteral, ctx);
    }

    // Handle lambda expressions with parameter list: (x: Int, y: Int) => x + y
    const parameterList = getFirstChild(node, "parameterList");
    const arrow = getChildNodes(node, "Arrow");
    if (parameterList && arrow.length > 0) {
      const expression = getFirstChild(node, "expression");
      return (
        this.visitor.visit(parameterList, ctx) +
        " => " +
        (expression ? this.visitor.visit(expression, ctx) : "")
      );
    }

    // Handle block lambda expressions: { x => ... }
    const leftBrace = getChildNodes(node, "LeftBrace");
    const identifier = getChildNodes(node, "Identifier");
    const arrowNodes = getChildNodes(node, "Arrow");

    if (
      leftBrace.length > 0 &&
      identifier.length > 0 &&
      arrowNodes.length > 0
    ) {
      let result = "{ " + identifier[0].image + " =>";

      const statements = [];

      // Add statements (val/var/def definitions)
      const blockStatements = getChildNodes(node, "blockStatement");
      if (blockStatements.length > 0) {
        statements.push(
          ...blockStatements.map((stmt: any) => this.visitor.visit(stmt, ctx)),
        );
      }

      // Add final expression
      const finalExpression = getFirstChild(node, "expression");
      if (finalExpression) {
        statements.push(this.visitor.visit(finalExpression, ctx));
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
    const polymorphicFunctionLiteral = getFirstChild(
      node,
      "polymorphicFunctionLiteral",
    );
    if (polymorphicFunctionLiteral) {
      return this.visitor.visit(polymorphicFunctionLiteral, ctx);
    }

    // Handle simple lambda expressions: x => x * 2
    const simpleIdentifier = getChildNodes(node, "Identifier");
    const simpleArrow = getChildNodes(node, "Arrow");
    if (simpleIdentifier.length > 0 && simpleArrow.length > 0) {
      const expression = getFirstChild(node, "expression");
      return (
        simpleIdentifier[0].image +
        " => " +
        (expression ? this.visitor.visit(expression, ctx) : "")
      );
    }

    // Handle assignmentOrInfixExpression
    const assignmentOrInfixExpression = getFirstChild(
      node,
      "assignmentOrInfixExpression",
    );
    if (assignmentOrInfixExpression) {
      return this.visitor.visit(assignmentOrInfixExpression, ctx);
    }

    // Handle regular expressions (fallback for older structure)
    const postfixExpressions = getChildNodes(node, "postfixExpression");
    if (postfixExpressions.length > 0) {
      let result = this.visitor.visit(postfixExpressions[0], ctx);

      const infixOperators = getChildNodes(node, "infixOperator");
      if (infixOperators.length > 0) {
        for (let i = 0; i < infixOperators.length; i++) {
          result +=
            " " +
            this.visitor.visit(infixOperators[i], ctx) +
            " " +
            (postfixExpressions[i + 1]
              ? this.visitor.visit(postfixExpressions[i + 1], ctx)
              : "");
        }
      }

      return result;
    }

    return "";
  }

  visitPostfixExpression(node: CSTNode, ctx: PrintContext): string {
    const primaryExpression = getFirstChild(node, "primaryExpression");
    let result = primaryExpression
      ? this.visitor.visit(primaryExpression, ctx)
      : "";

    // Handle method calls and member access
    const dots = getChildNodes(node, "Dot");
    if (dots.length > 0) {
      const identifiers = getChildNodes(node, "Identifier");

      for (let i = 0; i < dots.length; i++) {
        result += ".";

        // Handle member access or method call
        // Identifiers after the first one correspond to members after dots
        if (identifiers.length > i) {
          result += identifiers[i].image;
        }

        // Add arguments if this is a method call
        const leftParens = getChildNodes(node, "LeftParen");
        if (leftParens.length > i) {
          result += "(";

          // Find expressions for this argument list
          const startIdx = i * 10; // Rough heuristic for argument grouping
          const expressions = getChildNodes(node, "expression");
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
    const leftBrackets = getChildNodes(node, "LeftBracket");
    if (leftBrackets.length > 0) {
      result += "[";
      const types = getChildNodes(node, "type");
      if (types.length > 0) {
        const typeStrings = types.map((t: any) => this.visitor.visit(t, ctx));
        result += typeStrings.join(", ");
      }
      result += "]";
    }

    // Handle match expressions
    const matchTokens = getChildNodes(node, "Match");
    if (matchTokens.length > 0) {
      result += " match {\n";
      const caseClauses = getChildNodes(node, "caseClause");
      if (caseClauses.length > 0) {
        const cases = caseClauses.map(
          (c: any) => "  " + this.visitor.visit(c, ctx),
        );
        result += cases.join("\n");
        result += "\n";
      }
      result += "}";
    }

    // Handle method application without dot
    const methodLeftParens = getChildNodes(node, "LeftParen");
    const methodDots = getChildNodes(node, "Dot");
    if (methodLeftParens.length > 0 && methodDots.length === 0) {
      result += "(";
      const methodExpressions = getChildNodes(node, "expression");
      if (methodExpressions.length > 0) {
        const args = methodExpressions.map((e: any) =>
          this.visitor.visit(e, ctx),
        );
        result += args.join(", ");
      }
      result += ")";
    }

    return result;
  }

  visitPrimaryExpression(node: CSTNode, ctx: PrintContext): string {
    const literal = getFirstChild(node, "literal");
    if (literal) {
      return this.visitor.visit(literal, ctx);
    }

    const identifier = getFirstChild(node, "Identifier");
    if (identifier) {
      return identifier.image || "";
    }

    const thisToken = getChildNodes(node, "This");
    if (thisToken.length > 0) {
      return "this";
    }

    const partialFunctionLiteral = getFirstChild(
      node,
      "partialFunctionLiteral",
    );
    if (partialFunctionLiteral) {
      return this.visitor.visit(partialFunctionLiteral, ctx);
    }

    const newExpression = getFirstChild(node, "newExpression");
    if (newExpression) {
      return this.visitor.visit(newExpression, ctx);
    }

    const forExpression = getFirstChild(node, "forExpression");
    if (forExpression) {
      return this.visitor.visit(forExpression, ctx);
    }

    const ifExpression = getFirstChild(node, "ifExpression");
    if (ifExpression) {
      return this.visitor.visit(ifExpression, ctx);
    }

    const whileExpression = getFirstChild(node, "whileExpression");
    if (whileExpression) {
      return this.visitor.visit(whileExpression, ctx);
    }

    const tryExpression = getFirstChild(node, "tryExpression");
    if (tryExpression) {
      return this.visitor.visit(tryExpression, ctx);
    }

    const exclamation = getChildNodes(node, "Exclamation");
    if (exclamation.length > 0) {
      // Handle negation operator
      const postfixExpression = getFirstChild(node, "postfixExpression");
      return (
        "!" +
        (postfixExpression ? this.visitor.visit(postfixExpression, ctx) : "")
      );
    }

    const bitwiseTilde = getChildNodes(node, "BitwiseTilde");
    if (bitwiseTilde.length > 0) {
      // Handle bitwise complement operator
      const postfixExpression = getFirstChild(node, "postfixExpression");
      return (
        "~" +
        (postfixExpression ? this.visitor.visit(postfixExpression, ctx) : "")
      );
    }

    const leftParen = getChildNodes(node, "LeftParen");
    if (leftParen.length > 0) {
      const expression = getFirstChild(node, "expression");
      return (
        "(" + (expression ? this.visitor.visit(expression, ctx) : "") + ")"
      );
    }

    const blockExpression = getFirstChild(node, "blockExpression");
    if (blockExpression) {
      return this.visitor.visit(blockExpression, ctx);
    }

    const quoteExpression = getFirstChild(node, "quoteExpression");
    if (quoteExpression) {
      return this.visitor.visit(quoteExpression, ctx);
    }

    const spliceExpression = getFirstChild(node, "spliceExpression");
    if (spliceExpression) {
      return this.visitor.visit(spliceExpression, ctx);
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

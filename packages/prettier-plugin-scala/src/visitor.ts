// Import all visitor modules
import {
  DeclarationVisitorMethods,
  type DeclarationVisitor,
} from "./visitor/declarations";
import {
  ExpressionVisitorMethods,
  type ExpressionVisitor,
} from "./visitor/expressions";
import { Scala3VisitorMethods, type Scala3Visitor } from "./visitor/scala3";
import {
  StatementVisitorMethods,
  type StatementVisitor,
} from "./visitor/statements";
import { TypeVisitorMethods, type TypeVisitor } from "./visitor/types";
import {
  getPrintWidth,
  getTabWidth,
  formatStatement,
  formatStringLiteral,
  createIndent,
  attachOriginalComments,
} from "./visitor/utils";
import type { PrintContext, CSTNode } from "./visitor/utils";
import type { ScalaCstNode } from "@simochee/scala-parser";

// Re-export types from utils for external use
export type { PrintContext, CSTNode, PrettierOptions } from "./visitor/utils";

export class CstNodeVisitor
  implements
    DeclarationVisitor,
    ExpressionVisitor,
    StatementVisitor,
    TypeVisitor,
    Scala3Visitor
{
  // Initialize visitor modules
  private declarations = new DeclarationVisitorMethods(this);
  private expressions = new ExpressionVisitorMethods(this);
  private statements = new StatementVisitorMethods(this);
  private types = new TypeVisitorMethods(this);
  private scala3 = new Scala3VisitorMethods(this);

  visit(node: CSTNode, ctx: PrintContext): string {
    if (!node) return "";

    try {
      // Handle root node with original comments
      if (node.type === "compilationUnit" && node.originalComments) {
        const nodeResult = this.visitCore(node, ctx);
        return attachOriginalComments(
          nodeResult,
          node.originalComments as CSTNode[],
        );
      }

      return this.visitCore(node, ctx);
    } catch (error) {
      console.error(`Error visiting node ${node.name || "unknown"}:`, error);

      // Return a safe fallback for formatting errors
      if (node.image) {
        return node.image;
      }

      return `/* FORMAT ERROR: ${node.name || "unknown"} */`;
    }
  }

  private visitCore(node: CSTNode, ctx: PrintContext): string {
    try {
      // Handle token nodes
      if (node.image !== undefined) {
        return node.image;
      }

      // Handle CST nodes by rule name
      if (node.name) {
        // Capitalize the first letter of the rule name
        const ruleName = node.name.charAt(0).toUpperCase() + node.name.slice(1);
        const methodName = `visit${ruleName}`;
        if (
          typeof (this as Record<string, unknown>)[methodName] === "function"
        ) {
          return (
            (this as Record<string, unknown>)[methodName] as (
              node: ScalaCstNode,
              ctx: VisitorContext,
            ) => string
          )(node, ctx);
        }
      }

      // If no specific visitor method exists, try default handling by type
      if (node.children) {
        return this.visitChildren(node, ctx);
      }

      return "";
    } catch (error) {
      console.error(`Error in visitCore for ${node.name || "unknown"}:`, error);

      // Try to recover by visiting children directly
      if (node.children) {
        try {
          return this.visitChildren(node, ctx);
        } catch (childError) {
          console.error(
            `Error visiting children of ${node.name || "unknown"}:`,
            childError,
          );
          return `/* ERROR: ${node.name || "unknown"} */`;
        }
      }

      return node.image || "";
    }
  }

  visitChildren(node: CSTNode, ctx: PrintContext): string {
    const parts: string[] = [];

    if (!node.children) return "";

    try {
      for (const [key, children] of Object.entries(node.children)) {
        if (Array.isArray(children)) {
          for (const child of children) {
            try {
              const part = this.visit(child, ctx);
              if (part) {
                parts.push(part);
              }
            } catch (childError) {
              console.error(
                `Error visiting child ${child.name || "unknown"} in ${key}:`,
                childError,
              );
              // Continue with next child instead of failing completely
              parts.push(`/* ERROR: ${child.name || "unknown"} */`);
            }
          }
        }
      }
    } catch (error) {
      console.error(
        `Error visiting children of ${node.name || "unknown"}:`,
        error,
      );
      return `/* ERROR: ${node.name || "unknown"} children */`;
    }

    return parts.join(" ");
  }

  // Utility methods for shared functionality
  getIndentation(ctx: PrintContext): string {
    return createIndent(1, ctx);
  }

  getPrintWidth(ctx: PrintContext): number {
    return getPrintWidth(ctx);
  }

  getTabWidth(ctx: PrintContext): number {
    return getTabWidth(ctx);
  }

  formatStatement(statement: string, ctx: PrintContext): string {
    return formatStatement(statement, ctx);
  }

  formatStringLiteral(content: string, ctx: PrintContext): string {
    return formatStringLiteral(content, ctx);
  }

  // ==========================================
  // Delegation methods to modular visitors
  // ==========================================

  // Compilation unit and top-level structure
  visitCompilationUnit(node: CSTNode, ctx: PrintContext): string {
    return this.statements.visitCompilationUnit(node, ctx);
  }

  // Package and imports/exports
  visitPackageClause(node: CSTNode, ctx: PrintContext): string {
    return this.statements.visitPackageClause(node, ctx);
  }

  visitImportClause(node: CSTNode, ctx: PrintContext): string {
    return this.statements.visitImportClause(node, ctx);
  }

  visitImportExpression(node: CSTNode, ctx: PrintContext): string {
    return this.statements.visitImportExpression(node, ctx);
  }

  visitImportSelector(node: CSTNode, ctx: PrintContext): string {
    return this.statements.visitImportSelector(node, ctx);
  }

  visitExportClause(node: CSTNode, ctx: PrintContext): string {
    return this.scala3.visitExportClause(node, ctx);
  }

  visitExportExpression(node: CSTNode, ctx: PrintContext): string {
    return this.scala3.visitExportExpression(node, ctx);
  }

  visitExportSelector(node: CSTNode, ctx: PrintContext): string {
    return this.scala3.visitExportSelector(node, ctx);
  }

  // Definitions and declarations
  visitTopLevelDefinition(node: CSTNode, ctx: PrintContext): string {
    return this.statements.visitTopLevelDefinition(node, ctx);
  }

  visitDefinition(node: CSTNode, ctx: PrintContext): string {
    return this.statements.visitDefinition(node, ctx);
  }

  visitAnnotations(annotations: CSTNode[], ctx: PrintContext): string {
    return this.statements.visitAnnotations(annotations, ctx);
  }

  visitAnnotation(node: CSTNode, ctx: PrintContext): string {
    return this.statements.visitAnnotation(node, ctx);
  }

  visitAnnotationArgument(node: CSTNode, ctx: PrintContext): string {
    return this.statements.visitAnnotationArgument(node, ctx);
  }

  visitModifiers(modifiers: CSTNode[], ctx: PrintContext): string {
    return this.statements.visitModifiers(modifiers, ctx);
  }

  // Class-related declarations
  visitClassDefinition(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitClassDefinition(node, ctx);
  }

  visitObjectDefinition(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitObjectDefinition(node, ctx);
  }

  visitTraitDefinition(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitTraitDefinition(node, ctx);
  }

  visitValDefinition(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitValDefinition(node, ctx);
  }

  visitVarDefinition(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitVarDefinition(node, ctx);
  }

  visitDefDefinition(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitDefDefinition(node, ctx);
  }

  visitTypeDefinition(node: CSTNode, ctx: PrintContext): string {
    return this.scala3.visitTypeDefinition(node, ctx);
  }

  visitAuxiliaryConstructor(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitAuxiliaryConstructor(node, ctx);
  }

  visitClassParameters(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitClassParameters(node, ctx);
  }

  visitClassParameter(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitClassParameter(node, ctx);
  }

  visitParameterLists(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitParameterLists(node, ctx);
  }

  visitParameterList(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitParameterList(node, ctx);
  }

  visitParameter(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitParameter(node, ctx);
  }

  visitTypeParameters(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitTypeParameters(node, ctx);
  }

  visitTypeParameter(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitTypeParameter(node, ctx);
  }

  visitExtendsClause(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitExtendsClause(node, ctx);
  }

  visitClassBody(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitClassBody(node, ctx);
  }

  visitClassMember(node: CSTNode, ctx: PrintContext): string {
    return this.declarations.visitClassMember(node, ctx);
  }

  // Type system
  visitType(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitType(node, ctx);
  }

  visitMatchType(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitMatchType(node, ctx);
  }

  visitMatchTypeCase(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitMatchTypeCase(node, ctx);
  }

  visitUnionType(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitUnionType(node, ctx);
  }

  visitIntersectionType(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitIntersectionType(node, ctx);
  }

  visitBaseType(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitBaseType(node, ctx);
  }

  visitTupleTypeOrParenthesized(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitTupleTypeOrParenthesized(node, ctx);
  }

  visitSimpleType(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitSimpleType(node, ctx);
  }

  visitTypeArgument(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitTypeArgument(node, ctx);
  }

  visitTypeLambda(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitTypeLambda(node, ctx);
  }

  visitTypeLambdaParameter(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitTypeLambdaParameter(node, ctx);
  }

  visitDependentFunctionType(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitDependentFunctionType(node, ctx);
  }

  visitDependentParameter(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitDependentParameter(node, ctx);
  }

  // Expressions
  visitExpression(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitExpression(node, ctx);
  }

  visitPostfixExpression(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitPostfixExpression(node, ctx);
  }

  visitPrimaryExpression(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitPrimaryExpression(node, ctx);
  }

  visitAssignmentStatement(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitAssignmentStatement(node, ctx);
  }

  visitAssignmentOrInfixExpression(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitAssignmentOrInfixExpression(node, ctx);
  }

  visitInfixOperator(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitInfixOperator(node, ctx);
  }

  visitLiteral(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitLiteral(node, ctx);
  }

  visitQualifiedIdentifier(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitQualifiedIdentifier(node, ctx);
  }

  visitNewExpression(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitNewExpression(node, ctx);
  }

  visitIfExpression(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitIfExpression(node, ctx);
  }

  visitWhileExpression(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitWhileExpression(node, ctx);
  }

  visitTryExpression(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitTryExpression(node, ctx);
  }

  visitForExpression(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitForExpression(node, ctx);
  }

  visitGenerator(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitGenerator(node, ctx);
  }

  visitCaseClause(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitCaseClause(node, ctx);
  }

  visitBlockExpression(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitBlockExpression(node, ctx);
  }

  visitPartialFunctionLiteral(node: CSTNode, ctx: PrintContext): string {
    return this.expressions.visitPartialFunctionLiteral(node, ctx);
  }

  // Statements
  visitBlockStatement(node: CSTNode, ctx: PrintContext): string {
    return this.statements.visitBlockStatement(node, ctx);
  }

  visitPattern(node: CSTNode, ctx: PrintContext): string {
    return this.statements.visitPattern(node, ctx);
  }

  // Scala 3 specific features
  visitEnumDefinition(node: CSTNode, ctx: PrintContext): string {
    return this.scala3.visitEnumDefinition(node, ctx);
  }

  visitEnumCase(node: CSTNode, ctx: PrintContext): string {
    return this.scala3.visitEnumCase(node, ctx);
  }

  visitExtensionDefinition(node: CSTNode, ctx: PrintContext): string {
    return this.scala3.visitExtensionDefinition(node, ctx);
  }

  visitExtensionMember(node: CSTNode, ctx: PrintContext): string {
    return this.scala3.visitExtensionMember(node, ctx);
  }

  visitGivenDefinition(node: CSTNode, ctx: PrintContext): string {
    return this.scala3.visitGivenDefinition(node, ctx);
  }

  visitQuoteExpression(node: CSTNode, ctx: PrintContext): string {
    return this.scala3.visitQuoteExpression(node, ctx);
  }

  visitSpliceExpression(node: CSTNode, ctx: PrintContext): string {
    return this.scala3.visitSpliceExpression(node, ctx);
  }

  visitPolymorphicFunctionLiteral(node: CSTNode, ctx: PrintContext): string {
    return this.scala3.visitPolymorphicFunctionLiteral(node, ctx);
  }

  visitPolymorphicFunctionType(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitPolymorphicFunctionType(node, ctx);
  }

  visitPolymorphicTypeParameter(node: CSTNode, ctx: PrintContext): string {
    return this.types.visitPolymorphicTypeParameter(node, ctx);
  }

  visitContextFunctionType(node: CSTNode, ctx: PrintContext): string {
    return this.scala3.visitContextFunctionType(node, ctx);
  }
}

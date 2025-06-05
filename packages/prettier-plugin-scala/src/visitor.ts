// Import all visitor modules
import {
  DeclarationVisitorMethods,
  type DeclarationVisitor,
} from "./visitor/declarations.js";
import {
  ExpressionVisitorMethods,
  type ExpressionVisitor,
} from "./visitor/expressions.js";
import { Scala3VisitorMethods, type Scala3Visitor } from "./visitor/scala3.js";
import {
  StatementVisitorMethods,
  type StatementVisitor,
} from "./visitor/statements.js";
import { TypeVisitorMethods, type TypeVisitor } from "./visitor/types.js";
import {
  getPrintWidth,
  getTabWidth,
  formatStatement,
  formatStringLiteral,
  createIndent,
  formatTrailingComma,
  attachOriginalComments,
} from "./visitor/utils.js";
import type { PrintContext, CSTNode } from "./visitor/utils.js";

// Re-export types from utils for external use
export type {
  PrintContext,
  CSTNode,
  PrettierOptions,
} from "./visitor/utils.js";

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

    // Handle root node with original comments
    if (node.type === "compilationUnit" && node.originalComments) {
      const nodeResult = this.visitCore(node, ctx);
      return attachOriginalComments(
        nodeResult,
        node.originalComments as CSTNode[],
      );
    }

    return this.visitCore(node, ctx);
  }

  private visitCore(node: CSTNode, ctx: PrintContext): string {
    // Handle token nodes
    if (node.image !== undefined) {
      return node.image;
    }

    // Handle CST nodes by rule name
    if (node.name) {
      // Capitalize the first letter of the rule name
      const ruleName = node.name.charAt(0).toUpperCase() + node.name.slice(1);
      const methodName = `visit${ruleName}`;
      if (typeof (this as any)[methodName] === "function") {
        return (this as any)[methodName](node, ctx);
      }
    }

    // If no specific visitor method exists, try default handling by type
    if (node.children) {
      return this.visitChildren(node, ctx);
    }

    return "";
  }

  visitChildren(node: CSTNode, ctx: PrintContext): string {
    const parts: string[] = [];

    if (!node.children) return "";

    for (const [_key, children] of Object.entries(node.children)) {
      if (Array.isArray(children)) {
        for (const child of children) {
          const part = this.visit(child, ctx);
          if (part) {
            parts.push(part);
          }
        }
      }
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

  visitImportExpression(node: any, ctx: PrintContext): string {
    return this.statements.visitImportExpression(node, ctx);
  }

  visitImportSelector(node: any, ctx: PrintContext): string {
    return this.statements.visitImportSelector(node, ctx);
  }

  visitExportClause(node: any, ctx: PrintContext): string {
    return this.scala3.visitExportClause(node, ctx);
  }

  visitExportExpression(node: any, ctx: PrintContext): string {
    return this.scala3.visitExportExpression(node, ctx);
  }

  visitExportSelector(node: any, ctx: PrintContext): string {
    return this.scala3.visitExportSelector(node, ctx);
  }

  // Definitions and declarations
  visitTopLevelDefinition(node: any, ctx: PrintContext): string {
    return this.statements.visitTopLevelDefinition(node, ctx);
  }

  visitDefinition(node: CSTNode, ctx: PrintContext): string {
    return this.statements.visitDefinition(node, ctx);
  }

  visitAnnotations(annotations: CSTNode[], ctx: PrintContext): string {
    return this.statements.visitAnnotations(annotations, ctx);
  }

  visitAnnotation(node: any, ctx: PrintContext): string {
    return this.statements.visitAnnotation(node, ctx);
  }

  visitAnnotationArgument(node: any, ctx: PrintContext): string {
    return this.statements.visitAnnotationArgument(node, ctx);
  }

  visitModifiers(modifiers: any[], ctx: PrintContext): string {
    return this.statements.visitModifiers(modifiers, ctx);
  }

  // Class-related declarations
  visitClassDefinition(node: any, ctx: PrintContext): string {
    return this.declarations.visitClassDefinition(node, ctx);
  }

  visitObjectDefinition(node: any, ctx: PrintContext): string {
    return this.declarations.visitObjectDefinition(node, ctx);
  }

  visitTraitDefinition(node: any, ctx: PrintContext): string {
    return this.declarations.visitTraitDefinition(node, ctx);
  }

  visitValDefinition(node: any, ctx: PrintContext): string {
    return this.declarations.visitValDefinition(node, ctx);
  }

  visitVarDefinition(node: any, ctx: PrintContext): string {
    return this.declarations.visitVarDefinition(node, ctx);
  }

  visitDefDefinition(node: any, ctx: PrintContext): string {
    return this.declarations.visitDefDefinition(node, ctx);
  }

  visitTypeDefinition(node: any, ctx: PrintContext): string {
    return this.scala3.visitTypeDefinition(node, ctx);
  }

  visitAuxiliaryConstructor(node: any, ctx: PrintContext): string {
    return this.declarations.visitAuxiliaryConstructor(node, ctx);
  }

  visitClassParameters(node: any, ctx: PrintContext): string {
    return this.declarations.visitClassParameters(node, ctx);
  }

  visitClassParameter(node: any, ctx: PrintContext): string {
    return this.declarations.visitClassParameter(node, ctx);
  }

  visitParameterLists(node: any, ctx: PrintContext): string {
    return this.declarations.visitParameterLists(node, ctx);
  }

  visitParameterList(node: any, ctx: PrintContext): string {
    return this.declarations.visitParameterList(node, ctx);
  }

  visitParameter(node: any, ctx: PrintContext): string {
    return this.declarations.visitParameter(node, ctx);
  }

  visitTypeParameters(node: any, ctx: PrintContext): string {
    return this.declarations.visitTypeParameters(node, ctx);
  }

  visitTypeParameter(node: any, ctx: PrintContext): string {
    return this.declarations.visitTypeParameter(node, ctx);
  }

  visitExtendsClause(node: any, ctx: PrintContext): string {
    return this.declarations.visitExtendsClause(node, ctx);
  }

  visitClassBody(node: any, ctx: PrintContext): string {
    return this.declarations.visitClassBody(node, ctx);
  }

  visitClassMember(node: any, ctx: PrintContext): string {
    return this.declarations.visitClassMember(node, ctx);
  }

  // Type system
  visitType(node: any, ctx: PrintContext): string {
    return this.types.visitType(node, ctx);
  }

  visitMatchType(node: any, ctx: PrintContext): string {
    return this.types.visitMatchType(node, ctx);
  }

  visitMatchTypeCase(node: any, ctx: PrintContext): string {
    return this.types.visitMatchTypeCase(node, ctx);
  }

  visitUnionType(node: any, ctx: PrintContext): string {
    return this.types.visitUnionType(node, ctx);
  }

  visitIntersectionType(node: any, ctx: PrintContext): string {
    return this.types.visitIntersectionType(node, ctx);
  }

  visitBaseType(node: any, ctx: PrintContext): string {
    return this.types.visitBaseType(node, ctx);
  }

  visitTupleTypeOrParenthesized(node: any, ctx: PrintContext): string {
    return this.types.visitTupleTypeOrParenthesized(node, ctx);
  }

  visitSimpleType(node: any, ctx: PrintContext): string {
    return this.types.visitSimpleType(node, ctx);
  }

  visitTypeArgument(node: any, ctx: PrintContext): string {
    return this.types.visitTypeArgument(node, ctx);
  }

  visitTypeLambda(node: any, ctx: PrintContext): string {
    return this.types.visitTypeLambda(node, ctx);
  }

  visitTypeLambdaParameter(node: any, ctx: PrintContext): string {
    return this.types.visitTypeLambdaParameter(node, ctx);
  }

  visitDependentFunctionType(node: any, ctx: PrintContext): string {
    return this.types.visitDependentFunctionType(node, ctx);
  }

  visitDependentParameter(node: any, ctx: PrintContext): string {
    return this.types.visitDependentParameter(node, ctx);
  }

  // Expressions
  visitExpression(node: any, ctx: PrintContext): string {
    return this.expressions.visitExpression(node, ctx);
  }

  visitPostfixExpression(node: any, ctx: PrintContext): string {
    return this.expressions.visitPostfixExpression(node, ctx);
  }

  visitPrimaryExpression(node: any, ctx: PrintContext): string {
    return this.expressions.visitPrimaryExpression(node, ctx);
  }

  visitAssignmentStatement(node: any, ctx: PrintContext): string {
    return this.expressions.visitAssignmentStatement(node, ctx);
  }

  visitAssignmentOrInfixExpression(node: any, ctx: PrintContext): string {
    return this.expressions.visitAssignmentOrInfixExpression(node, ctx);
  }

  visitInfixOperator(node: any, ctx: PrintContext): string {
    return this.expressions.visitInfixOperator(node, ctx);
  }

  visitLiteral(node: any, ctx: PrintContext): string {
    return this.expressions.visitLiteral(node, ctx);
  }

  visitQualifiedIdentifier(node: any, ctx: PrintContext): string {
    return this.expressions.visitQualifiedIdentifier(node, ctx);
  }

  visitNewExpression(node: any, ctx: PrintContext): string {
    return this.expressions.visitNewExpression(node, ctx);
  }

  visitIfExpression(node: any, ctx: PrintContext): string {
    return this.expressions.visitIfExpression(node, ctx);
  }

  visitWhileExpression(node: any, ctx: PrintContext): string {
    return this.expressions.visitWhileExpression(node, ctx);
  }

  visitTryExpression(node: any, ctx: PrintContext): string {
    return this.expressions.visitTryExpression(node, ctx);
  }

  visitForExpression(node: any, ctx: PrintContext): string {
    return this.expressions.visitForExpression(node, ctx);
  }

  visitGenerator(node: any, ctx: PrintContext): string {
    return this.expressions.visitGenerator(node, ctx);
  }

  visitCaseClause(node: any, ctx: PrintContext): string {
    return this.expressions.visitCaseClause(node, ctx);
  }

  visitBlockExpression(node: any, ctx: PrintContext): string {
    return this.expressions.visitBlockExpression(node, ctx);
  }

  visitPartialFunctionLiteral(node: any, ctx: PrintContext): string {
    return this.expressions.visitPartialFunctionLiteral(node, ctx);
  }

  // Statements
  visitBlockStatement(node: any, ctx: PrintContext): string {
    return this.statements.visitBlockStatement(node, ctx);
  }

  visitPattern(node: any, ctx: PrintContext): string {
    return this.statements.visitPattern(node, ctx);
  }

  // Scala 3 specific features
  visitEnumDefinition(node: any, ctx: PrintContext): string {
    return this.scala3.visitEnumDefinition(node, ctx);
  }

  visitEnumCase(node: any, ctx: PrintContext): string {
    return this.scala3.visitEnumCase(node, ctx);
  }

  visitExtensionDefinition(node: any, ctx: PrintContext): string {
    return this.scala3.visitExtensionDefinition(node, ctx);
  }

  visitExtensionMember(node: any, ctx: PrintContext): string {
    return this.scala3.visitExtensionMember(node, ctx);
  }

  visitGivenDefinition(node: any, ctx: PrintContext): string {
    return this.scala3.visitGivenDefinition(node, ctx);
  }

  visitQuoteExpression(node: any, ctx: PrintContext): string {
    return this.scala3.visitQuoteExpression(node, ctx);
  }

  visitSpliceExpression(node: any, ctx: PrintContext): string {
    return this.scala3.visitSpliceExpression(node, ctx);
  }

  visitPolymorphicFunctionLiteral(node: any, ctx: PrintContext): string {
    return this.scala3.visitPolymorphicFunctionLiteral(node, ctx);
  }

  visitPolymorphicFunctionType(node: any, ctx: PrintContext): string {
    return this.types.visitPolymorphicFunctionType(node, ctx);
  }

  visitPolymorphicTypeParameter(node: any, ctx: PrintContext): string {
    return this.types.visitPolymorphicTypeParameter(node, ctx);
  }

  visitContextFunctionType(node: any, ctx: PrintContext): string {
    return this.scala3.visitContextFunctionType(node, ctx);
  }
}

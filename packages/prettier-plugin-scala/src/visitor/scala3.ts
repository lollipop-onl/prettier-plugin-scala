/**
 * Scala 3 specific visitor methods for modern language features
 */
import type { PrintContext, CSTNode } from "./utils.js";

export interface Scala3Visitor {
  visit(node: CSTNode, ctx: PrintContext): string;
  getIndentation(ctx: PrintContext): string;
  visitModifiers(modifiers: CSTNode[], ctx: PrintContext): string;
}

export class Scala3VisitorMethods {
  private visitor: Scala3Visitor;

  constructor(visitor: Scala3Visitor) {
    this.visitor = visitor;
  }

  // Quote and splice expressions for macros
  visitQuoteExpression(node: any, ctx: PrintContext): string {
    return "'{ " + this.visitor.visit(node.children.expression[0], ctx) + " }";
  }

  visitSpliceExpression(node: any, ctx: PrintContext): string {
    return "${ " + this.visitor.visit(node.children.expression[0], ctx) + " }";
  }

  // Polymorphic function literals
  visitPolymorphicFunctionLiteral(node: any, ctx: PrintContext): string {
    let result = "[";

    if (node.children.polymorphicTypeParameter) {
      const parameters = node.children.polymorphicTypeParameter.map(
        (param: any) => this.visitor.visit(param, ctx),
      );
      result += parameters.join(", ");
    }

    result += "] => ";
    result += this.visitor.visit(node.children.expression[0], ctx);

    return result;
  }

  // Polymorphic function types
  visitPolymorphicFunctionType(node: any, ctx: PrintContext): string {
    let result = "[";

    if (node.children.polymorphicTypeParameter) {
      const parameters = node.children.polymorphicTypeParameter.map(
        (param: any) => this.visitor.visit(param, ctx),
      );
      result += parameters.join(", ");
    }

    result += "] => ";
    result += this.visitor.visit(node.children.type[0], ctx);

    return result;
  }

  visitPolymorphicTypeParameter(node: any, ctx: PrintContext): string {
    let result = "";

    // Add variance annotation if present
    if (node.children.Plus) {
      result += "+";
    } else if (node.children.Minus) {
      result += "-";
    }

    result += node.children.Identifier[0].image;

    // Handle type bounds
    if (node.children.SubtypeOf) {
      result += " <: " + this.visitor.visit(node.children.type[0], ctx);
    }
    if (node.children.SupertypeOf) {
      result += " >: " + this.visitor.visit(node.children.type[0], ctx);
    }

    return result;
  }

  // Enum definitions
  visitEnumDefinition(node: any, ctx: PrintContext): string {
    let result = "enum " + node.children.Identifier[0].image;

    if (node.children.typeParameters) {
      result += this.visitor.visit(node.children.typeParameters[0], ctx);
    }

    if (node.children.classParameters) {
      result += this.visitor.visit(node.children.classParameters[0], ctx);
    }

    if (node.children.extendsClause) {
      result += " " + this.visitor.visit(node.children.extendsClause[0], ctx);
    }

    result += " {\n";

    if (node.children.enumCase) {
      const indent = this.visitor.getIndentation(ctx);
      const cases = node.children.enumCase.map(
        (c: any) => indent + this.visitor.visit(c, ctx),
      );
      result += cases.join("\n");
    }

    result += "\n}";

    return result;
  }

  visitEnumCase(node: any, ctx: PrintContext): string {
    let result = "case " + node.children.Identifier[0].image;

    if (node.children.classParameters) {
      result += this.visitor.visit(node.children.classParameters[0], ctx);
    }

    if (node.children.extendsClause) {
      result += " " + this.visitor.visit(node.children.extendsClause[0], ctx);
    }

    return result;
  }

  // Extension methods
  visitExtensionDefinition(node: any, ctx: PrintContext): string {
    let result = "extension";

    if (node.children.typeParameters) {
      result += this.visitor.visit(node.children.typeParameters[0], ctx);
    }

    result += " (" + node.children.Identifier[0].image + ": ";
    result += this.visitor.visit(node.children.type[0], ctx) + ") {\n";

    if (node.children.extensionMember) {
      const members = node.children.extensionMember.map(
        (m: any) => "  " + this.visitor.visit(m, ctx),
      );
      result += members.join("\n");
    }

    result += "\n}";

    return result;
  }

  visitExtensionMember(node: any, ctx: PrintContext): string {
    const modifiers = this.visitor.visitModifiers(
      node.children.modifier || [],
      ctx,
    );
    const definition = this.visitor.visit(node.children.defDefinition[0], ctx);

    return modifiers ? modifiers + " " + definition : definition;
  }

  // Given definitions
  visitGivenDefinition(node: any, ctx: PrintContext): string {
    let result = "given";

    if (node.children.Identifier) {
      // Named given with potential parameters: given name[T](using ord: Type): Type
      result += " " + node.children.Identifier[0].image;

      if (node.children.typeParameters) {
        result += this.visitor.visit(node.children.typeParameters[0], ctx);
      }

      if (node.children.parameterLists) {
        result += this.visitor.visit(node.children.parameterLists[0], ctx);
      }

      result += ": " + this.visitor.visit(node.children.type[0], ctx);
    } else {
      // Anonymous given: given Type = expression
      result += " " + this.visitor.visit(node.children.type[0], ctx);
    }

    if (node.children.Equals) {
      result += " = " + this.visitor.visit(node.children.expression[0], ctx);
    }

    return result;
  }

  // Type definitions including opaque types
  visitTypeDefinition(node: any, ctx: PrintContext): string {
    let result = "";

    // Handle opaque types
    if (node.children.Opaque) {
      result += "opaque ";
    }

    result += "type " + node.children.Identifier[0].image;

    if (node.children.typeParameters) {
      result += this.visitor.visit(node.children.typeParameters[0], ctx);
    }

    result += " = " + this.visitor.visit(node.children.type[0], ctx);

    return result;
  }

  // Export clauses and expressions
  visitExportClause(node: any, ctx: PrintContext): string {
    return (
      "export " + this.visitor.visit(node.children.exportExpression[0], ctx)
    );
  }

  visitExportExpression(node: any, ctx: PrintContext): string {
    let result = "";

    // Build the export path
    const identifiers = node.children.Identifier || [];
    const dots = node.children.Dot || [];

    // Add first identifier
    if (identifiers.length > 0) {
      result = identifiers[0].image;
    }

    // Process remaining parts
    let identifierIndex = 1;
    for (let i = 0; i < dots.length; i++) {
      result += ".";

      // Check what follows this dot
      if (node.children.Underscore && i === dots.length - 1) {
        // Wildcard export
        result += "_";
      } else if (node.children.Given && i === dots.length - 1) {
        // Given export
        result += "given";
      } else if (node.children.LeftBrace && i === dots.length - 1) {
        // Multiple export selectors
        result += "{";
        if (node.children.exportSelector) {
          const selectors = node.children.exportSelector.map((sel: any) =>
            this.visitor.visit(sel, ctx),
          );
          result += selectors.join(", ");
        }
        result += "}";
      } else if (identifierIndex < identifiers.length) {
        // Next identifier in path
        result += identifiers[identifierIndex].image;
        identifierIndex++;
      }
    }

    return result;
  }

  visitExportSelector(node: any, _ctx: PrintContext): string {
    // Handle wildcard export
    if (node.children.Underscore && !node.children.Identifier) {
      return "_";
    }

    // Handle given export
    if (node.children.Given && !node.children.Identifier) {
      return "given";
    }

    let result = "";

    // Handle regular identifiers
    if (node.children.Identifier) {
      result = node.children.Identifier[0].image;
    }

    // Handle given with specific identifiers: given SpecificType
    if (node.children.Given && node.children.Identifier) {
      result = "given " + node.children.Identifier[0].image;
    }

    if (node.children.Arrow) {
      result += " => ";
      if (node.children.Underscore) {
        result += "_";
      } else if (node.children.Identifier[1]) {
        result += node.children.Identifier[1].image;
      }
    }

    return result;
  }

  // Context function types
  visitContextFunctionType(node: any, ctx: PrintContext): string {
    let result = "";

    // Handle parenthesized types
    if (node.children.LeftParen) {
      result +=
        "(" +
        this.visitor.visit(node.children.tupleTypeOrParenthesized[0], ctx) +
        ")";
    } else {
      // Handle simple types
      result += this.visitor.visit(node.children.simpleType[0], ctx);
    }

    result += " ?=> " + this.visitor.visit(node.children.type[0], ctx);
    return result;
  }

  // Inline and transparent modifiers
  visitInlineModifier(node: any, _ctx: PrintContext): string {
    return "inline";
  }

  visitTransparentModifier(node: any, _ctx: PrintContext): string {
    return "transparent";
  }

  // Using clauses
  visitUsingClause(node: any, ctx: PrintContext): string {
    let result = "using ";

    if (node.children.Identifier) {
      result += node.children.Identifier[0].image;
    }

    if (node.children.Colon) {
      result += ": " + this.visitor.visit(node.children.type[0], ctx);
    }

    return result;
  }
}

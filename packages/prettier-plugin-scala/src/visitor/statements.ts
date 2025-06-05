/**
 * Statement visitor methods for import/export, package, and other statements
 */
import type { PrintContext, CSTNode } from "./utils.js";

export interface StatementVisitor {
  visit(node: CSTNode, ctx: PrintContext): string;
}

export class StatementVisitorMethods {
  private visitor: StatementVisitor;

  constructor(visitor: StatementVisitor) {
    this.visitor = visitor;
  }

  visitPackageClause(node: any, ctx: PrintContext): string {
    return (
      "package " + this.visitor.visit(node.children.qualifiedIdentifier[0], ctx)
    );
  }

  visitImportClause(node: any, ctx: PrintContext): string {
    return (
      "import " + this.visitor.visit(node.children.importExpression[0], ctx)
    );
  }

  visitImportExpression(node: any, ctx: PrintContext): string {
    let result = "";

    // Build the import path
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
        // Wildcard import
        result += "_";
      } else if (node.children.LeftBrace && i === dots.length - 1) {
        // Multiple import selectors
        result += "{";
        if (node.children.importSelector) {
          const selectors = node.children.importSelector.map((sel: any) =>
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

  visitImportSelector(node: any, _ctx: PrintContext): string {
    // Handle wildcard import
    if (node.children.Underscore && !node.children.Identifier) {
      return "_";
    }

    let result = node.children.Identifier[0].image;

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

  visitTopLevelDefinition(node: any, ctx: PrintContext): string {
    // Handle definitions at top level
    if (node.children.definition) {
      return this.visitor.visit(node.children.definition[0], ctx);
    }

    return "";
  }

  visitBlockStatement(node: any, ctx: PrintContext): string {
    if (node.children.valDefinition) {
      return this.visitor.visit(node.children.valDefinition[0], ctx);
    } else if (node.children.varDefinition) {
      return this.visitor.visit(node.children.varDefinition[0], ctx);
    } else if (node.children.defDefinition) {
      return this.visitor.visit(node.children.defDefinition[0], ctx);
    } else if (node.children.assignmentStatement) {
      return this.visitor.visit(node.children.assignmentStatement[0], ctx);
    } else if (node.children.expression) {
      return this.visitor.visit(node.children.expression[0], ctx);
    }
    return "";
  }

  visitCompilationUnit(node: any, ctx: PrintContext): string {
    const parts: string[] = [];

    // Add package clause if it exists
    if (node.children.packageClause) {
      parts.push(this.visitor.visit(node.children.packageClause[0], ctx));
    }

    // Add empty line after package
    if (parts.length > 0) {
      parts.push("");
    }

    // Add import clauses
    if (node.children.importClause) {
      node.children.importClause.forEach((importNode: any) => {
        parts.push(this.visitor.visit(importNode, ctx));
      });
    }

    // Add empty line after imports
    if (node.children.importClause && node.children.importClause.length > 0) {
      parts.push("");
    }

    // Add export clauses
    if (node.children.exportClause) {
      node.children.exportClause.forEach((exportNode: any) => {
        parts.push(this.visitor.visit(exportNode, ctx));
      });
    }

    // Add empty line after exports
    if (node.children.exportClause && node.children.exportClause.length > 0) {
      parts.push("");
    }

    // Add top-level definitions
    if (node.children.topLevelDefinition) {
      node.children.topLevelDefinition.forEach((def: any) => {
        parts.push(this.visitor.visit(def, ctx));
      });
    }

    // Add top-level statements
    if (node.children.topLevelStatement) {
      node.children.topLevelStatement.forEach((stmt: any) => {
        parts.push(this.visitor.visit(stmt, ctx));
      });
    }

    // Add top-level expressions
    if (node.children.expression) {
      node.children.expression.forEach((expr: any) => {
        parts.push(this.visitor.visit(expr, ctx));
      });
    }

    return parts.join("\n");
  }

  visitAnnotations(annotations: any[], ctx: PrintContext): string {
    return annotations.map((ann) => this.visitor.visit(ann, ctx)).join(" ");
  }

  visitAnnotation(node: any, ctx: PrintContext): string {
    let result = "@" + node.children.Identifier[0].image;

    if (node.children.LeftParen) {
      result += "(";
      if (node.children.annotationArgument) {
        const args = node.children.annotationArgument.map((arg: any) =>
          this.visitor.visit(arg, ctx),
        );
        result += args.join(", ");
      }
      result += ")";
    }

    return result;
  }

  visitAnnotationArgument(node: any, ctx: PrintContext): string {
    if (node.children.Identifier && node.children.Equals) {
      // Named argument: name = value
      return (
        node.children.Identifier[0].image +
        " = " +
        this.visitor.visit(node.children.expression[0], ctx)
      );
    } else if (node.children.expression) {
      // Positional argument
      return this.visitor.visit(node.children.expression[0], ctx);
    }

    return "";
  }

  visitModifiers(modifiers: any[], ctx: PrintContext): string {
    return modifiers.map((mod) => this.visitor.visit(mod, ctx)).join(" ");
  }

  visitDefinition(node: any, ctx: PrintContext): string {
    let result = "";

    // Handle annotations
    if (node.children.annotation) {
      const annotations = this.visitAnnotations(node.children.annotation, ctx);
      result += annotations + " ";
    }

    // Handle modifiers
    if (node.children.modifier) {
      const modifiers = this.visitModifiers(node.children.modifier, ctx);
      result += modifiers + " ";
    }

    // Handle specific definition types
    if (node.children.classDefinition) {
      result += this.visitor.visit(node.children.classDefinition[0], ctx);
    } else if (node.children.objectDefinition) {
      result += this.visitor.visit(node.children.objectDefinition[0], ctx);
    } else if (node.children.traitDefinition) {
      result += this.visitor.visit(node.children.traitDefinition[0], ctx);
    } else if (node.children.enumDefinition) {
      result += this.visitor.visit(node.children.enumDefinition[0], ctx);
    } else if (node.children.extensionDefinition) {
      result += this.visitor.visit(node.children.extensionDefinition[0], ctx);
    } else if (node.children.valDefinition) {
      result += this.visitor.visit(node.children.valDefinition[0], ctx);
    } else if (node.children.varDefinition) {
      result += this.visitor.visit(node.children.varDefinition[0], ctx);
    } else if (node.children.defDefinition) {
      result += this.visitor.visit(node.children.defDefinition[0], ctx);
    } else if (node.children.givenDefinition) {
      result += this.visitor.visit(node.children.givenDefinition[0], ctx);
    } else if (node.children.typeDefinition) {
      result += this.visitor.visit(node.children.typeDefinition[0], ctx);
    } else if (node.children.assignmentStatement) {
      result += this.visitor.visit(node.children.assignmentStatement[0], ctx);
    }

    return result;
  }

  visitPattern(node: any, ctx: PrintContext): string {
    if (node.children.Identifier) {
      return node.children.Identifier[0].image;
    } else if (node.children.Underscore) {
      return "_";
    } else if (node.children.literal) {
      return this.visitor.visit(node.children.literal[0], ctx);
    } else if (node.children.LeftParen) {
      // Tuple pattern or parenthesized pattern
      if (node.children.pattern && node.children.pattern.length > 1) {
        const patterns = node.children.pattern.map((p: any) =>
          this.visitor.visit(p, ctx),
        );
        return "(" + patterns.join(", ") + ")";
      } else if (node.children.pattern) {
        return "(" + this.visitor.visit(node.children.pattern[0], ctx) + ")";
      }
    } else if (node.children.pattern) {
      // Constructor pattern or other complex patterns
      return this.visitor.visit(node.children.pattern[0], ctx);
    }

    return "";
  }
}

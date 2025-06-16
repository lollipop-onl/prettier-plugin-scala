/**
 * Statement visitor methods for import/export, package, and other statements
 */
import { getChildNodes, getFirstChild, getChildren } from "./utils.js";
import type { PrintContext, CSTNode } from "./utils.js";

export interface StatementVisitor {
  visit(node: CSTNode, ctx: PrintContext): string;
}

export class StatementVisitorMethods {
  private visitor: StatementVisitor;

  constructor(visitor: StatementVisitor) {
    this.visitor = visitor;
  }

  visitPackageClause(node: CSTNode, ctx: PrintContext): string {
    const qualifiedIdentifier = getFirstChild(node, "qualifiedIdentifier");
    return (
      "package " +
      (qualifiedIdentifier ? this.visitor.visit(qualifiedIdentifier, ctx) : "")
    );
  }

  visitImportClause(node: CSTNode, ctx: PrintContext): string {
    const importExpression = getFirstChild(node, "importExpression");
    return (
      "import " +
      (importExpression ? this.visitor.visit(importExpression, ctx) : "")
    );
  }

  visitImportExpression(node: CSTNode, ctx: PrintContext): string {
    let result = "";

    // Build the import path
    const identifiers = getChildNodes(node, "Identifier");
    const dots = getChildNodes(node, "Dot");

    // Add first identifier
    if (identifiers.length > 0) {
      result = identifiers[0].image;
    }

    // Process remaining parts
    let identifierIndex = 1;
    for (let i = 0; i < dots.length; i++) {
      result += ".";

      // Check what follows this dot
      const underscores = getChildNodes(node, "Underscore");
      const leftBraces = getChildNodes(node, "LeftBrace");

      if (underscores.length > 0 && i === dots.length - 1) {
        // Wildcard import
        result += "_";
      } else if (leftBraces.length > 0 && i === dots.length - 1) {
        // Multiple import selectors
        result += "{";
        const importSelectors = getChildNodes(node, "importSelector");
        if (importSelectors.length > 0) {
          const selectors = importSelectors.map((sel: CSTNode) =>
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

  visitImportSelector(node: CSTNode, _ctx: PrintContext): string {
    // Handle wildcard import
    const underscores = getChildNodes(node, "Underscore");
    const identifiers = getChildNodes(node, "Identifier");

    if (underscores.length > 0 && identifiers.length === 0) {
      return "_";
    }

    let result = "";
    if (identifiers.length > 0) {
      result = identifiers[0].image;
    }

    const arrows = getChildNodes(node, "Arrow");
    if (arrows.length > 0) {
      result += " => ";
      const selectorUnderscores = getChildNodes(node, "Underscore");
      if (selectorUnderscores.length > 0) {
        result += "_";
      } else if (identifiers.length > 1) {
        result += identifiers[1].image;
      }
    }

    return result;
  }

  visitExportClause(node: CSTNode, ctx: PrintContext): string {
    const exportExpression = getFirstChild(node, "exportExpression");
    return (
      "export " +
      (exportExpression ? this.visitor.visit(exportExpression, ctx) : "")
    );
  }

  visitExportExpression(node: CSTNode, ctx: PrintContext): string {
    let result = "";

    // Build the export path
    const identifiers = getChildNodes(node, "Identifier");
    const dots = getChildNodes(node, "Dot");

    // Add first identifier
    if (identifiers.length > 0) {
      result = identifiers[0].image;
    }

    // Process remaining parts
    let identifierIndex = 1;
    for (let i = 0; i < dots.length; i++) {
      result += ".";

      // Check what follows this dot
      const underscores = getChildNodes(node, "Underscore");
      const givens = getChildNodes(node, "Given");

      if (underscores.length > 0 && i === dots.length - 1) {
        // Wildcard export
        result += "_";
      } else if (givens.length > 0 && i === dots.length - 1) {
        // Given export
        result += "given";
      } else if (
        getChildNodes(node, "LeftBrace").length > 0 &&
        i === dots.length - 1
      ) {
        // Multiple export selectors
        result += "{";
        const exportSelectors = getChildNodes(node, "exportSelector");
        if (exportSelectors.length > 0) {
          const selectors = exportSelectors.map((sel: CSTNode) =>
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

  visitExportSelector(node: CSTNode, _ctx: PrintContext): string {
    const underscores = getChildNodes(node, "Underscore");
    const identifiers = getChildNodes(node, "Identifier");
    const givens = getChildNodes(node, "Given");

    // Handle wildcard export
    if (underscores.length > 0 && identifiers.length === 0) {
      return "_";
    }

    // Handle given export
    if (givens.length > 0 && identifiers.length === 0) {
      return "given";
    }

    let result = "";

    // Handle regular identifiers
    if (identifiers.length > 0) {
      result = identifiers[0].image;
    }

    // Handle given with specific identifiers: given SpecificType
    if (givens.length > 0 && identifiers.length > 0) {
      result = "given " + identifiers[0].image;
    }

    const arrows = getChildNodes(node, "Arrow");
    if (arrows.length > 0) {
      result += " => ";
      const arrowUnderscores = getChildNodes(node, "Underscore");
      if (arrowUnderscores.length > 0) {
        result += "_";
      } else if (identifiers.length > 1) {
        result += identifiers[1].image;
      }
    }

    return result;
  }

  visitTopLevelDefinition(node: CSTNode, ctx: PrintContext): string {
    let result = "";

    // Handle modifiers (including 'case')
    const modifiers = getChildNodes(node, "modifier");
    if (modifiers.length > 0) {
      const modifierStr = this.visitModifiers(modifiers, ctx);
      result += modifierStr + " ";
    }

    // Handle definitions at top level
    const definition = getFirstChild(node, "definition");
    if (definition) {
      result += this.visitor.visit(definition, ctx);
      return result;
    }

    // Handle class definitions
    const classDefinition = getFirstChild(node, "classDefinition");
    if (classDefinition) {
      result += this.visitor.visit(classDefinition, ctx);
      return result;
    }

    // Handle object definitions
    const objectDefinition = getFirstChild(node, "objectDefinition");
    if (objectDefinition) {
      result += this.visitor.visit(objectDefinition, ctx);
      return result;
    }

    // Handle trait definitions
    const traitDefinition = getFirstChild(node, "traitDefinition");
    if (traitDefinition) {
      result += this.visitor.visit(traitDefinition, ctx);
      return result;
    }

    // Handle val definitions
    const valDefinition = getFirstChild(node, "valDefinition");
    if (valDefinition) {
      result += this.visitor.visit(valDefinition, ctx);
      return result;
    }

    // Handle var definitions
    const varDefinition = getFirstChild(node, "varDefinition");
    if (varDefinition) {
      result += this.visitor.visit(varDefinition, ctx);
      return result;
    }

    // Handle def definitions
    const defDefinition = getFirstChild(node, "defDefinition");
    if (defDefinition) {
      result += this.visitor.visit(defDefinition, ctx);
      return result;
    }

    // Handle enum definitions (Scala 3)
    const enumDefinition = getFirstChild(node, "enumDefinition");
    if (enumDefinition) {
      result += this.visitor.visit(enumDefinition, ctx);
      return result;
    }

    // Handle extension definitions (Scala 3)
    const extensionDefinition = getFirstChild(node, "extensionDefinition");
    if (extensionDefinition) {
      result += this.visitor.visit(extensionDefinition, ctx);
      return result;
    }

    // Handle given definitions (Scala 3)
    const givenDefinition = getFirstChild(node, "givenDefinition");
    if (givenDefinition) {
      result += this.visitor.visit(givenDefinition, ctx);
      return result;
    }

    // Handle type definitions (including opaque types)
    const typeDefinition = getFirstChild(node, "typeDefinition");
    if (typeDefinition) {
      result += this.visitor.visit(typeDefinition, ctx);
      return result;
    }

    // Handle assignment statements
    const assignmentStatement = getFirstChild(node, "assignmentStatement");
    if (assignmentStatement) {
      result += this.visitor.visit(assignmentStatement, ctx);
      return result;
    }

    // Handle expressions
    const expression = getFirstChild(node, "expression");
    if (expression) {
      result += this.visitor.visit(expression, ctx);
      return result;
    }

    return result;
  }

  visitBlockStatement(node: CSTNode, ctx: PrintContext): string {
    const valDefinition = getFirstChild(node, "valDefinition");
    if (valDefinition) {
      return this.visitor.visit(valDefinition, ctx);
    }

    const varDefinition = getFirstChild(node, "varDefinition");
    if (varDefinition) {
      return this.visitor.visit(varDefinition, ctx);
    }

    const defDefinition = getFirstChild(node, "defDefinition");
    if (defDefinition) {
      return this.visitor.visit(defDefinition, ctx);
    }

    const assignmentStatement = getFirstChild(node, "assignmentStatement");
    if (assignmentStatement) {
      return this.visitor.visit(assignmentStatement, ctx);
    }

    const expression = getFirstChild(node, "expression");
    if (expression) {
      return this.visitor.visit(expression, ctx);
    }

    return "";
  }

  visitCompilationUnit(node: CSTNode, ctx: PrintContext): string {
    const parts: string[] = [];

    // Add package clause if it exists
    const packageClause = getFirstChild(node, "packageClause");
    if (packageClause) {
      parts.push(this.visitor.visit(packageClause, ctx));
    }

    // Add empty line after package
    if (parts.length > 0) {
      parts.push("");
    }

    // Add import clauses
    const importClauses = getChildNodes(node, "importClause");
    if (importClauses.length > 0) {
      importClauses.forEach((importNode: CSTNode) => {
        parts.push(this.visitor.visit(importNode, ctx));
      });
    }

    // Add empty line after imports
    if (importClauses.length > 0) {
      parts.push("");
    }

    // Add export clauses
    const exportClauses = getChildNodes(node, "exportClause");
    if (exportClauses.length > 0) {
      exportClauses.forEach((exportNode: CSTNode) => {
        parts.push(this.visitor.visit(exportNode, ctx));
      });
    }

    // Don't add empty line after exports unless there are subsequent elements
    if (exportClauses.length > 0) {
      // Only add empty line if there are other elements after exports
      const topLevelDefinitions = getChildNodes(node, "topLevelDefinition");
      const topLevelStatements = getChildNodes(node, "topLevelStatement");
      const expressions = getChildNodes(node, "expression");
      const hasSubsequentElements =
        topLevelDefinitions.length > 0 ||
        topLevelStatements.length > 0 ||
        expressions.length > 0;
      if (hasSubsequentElements) {
        parts.push("");
      }
    }

    // Add top-level definitions
    const topLevelDefinitions = getChildNodes(node, "topLevelDefinition");
    if (topLevelDefinitions.length > 0) {
      topLevelDefinitions.forEach((def: CSTNode) => {
        parts.push(this.visitor.visit(def, ctx));
      });
    }

    // Add top-level statements
    const topLevelStatements = getChildNodes(node, "topLevelStatement");
    if (topLevelStatements.length > 0) {
      topLevelStatements.forEach((stmt: CSTNode) => {
        parts.push(this.visitor.visit(stmt, ctx));
      });
    }

    // Add top-level expressions
    const expressions = getChildNodes(node, "expression");
    if (expressions.length > 0) {
      expressions.forEach((expr: CSTNode) => {
        parts.push(this.visitor.visit(expr, ctx));
      });
    }

    // Join parts and ensure proper file formatting
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0] + "\n";

    // For multiple parts, join with newlines and add trailing newline
    return parts.join("\n") + "\n";
  }

  visitAnnotations(annotations: CSTNode[], ctx: PrintContext): string {
    return annotations.map((ann) => this.visitor.visit(ann, ctx)).join(" ");
  }

  visitAnnotation(node: CSTNode, ctx: PrintContext): string {
    const identifiers = getChildNodes(node, "Identifier");
    let result = "@" + (identifiers.length > 0 ? identifiers[0].image : "");

    const leftParens = getChildNodes(node, "LeftParen");
    if (leftParens.length > 0) {
      result += "(";
      const annotationArguments = getChildNodes(node, "annotationArgument");
      if (annotationArguments.length > 0) {
        const args = annotationArguments.map((arg: CSTNode) =>
          this.visitor.visit(arg, ctx),
        );
        result += args.join(", ");
      }
      result += ")";
    }

    return result;
  }

  visitAnnotationArgument(node: CSTNode, ctx: PrintContext): string {
    const identifiers = getChildNodes(node, "Identifier");
    const equals = getChildNodes(node, "Equals");
    const expressions = getChildNodes(node, "expression");

    if (identifiers.length > 0 && equals.length > 0 && expressions.length > 0) {
      // Named argument: name = value
      return (
        identifiers[0].image + " = " + this.visitor.visit(expressions[0], ctx)
      );
    } else if (expressions.length > 0) {
      // Positional argument
      return this.visitor.visit(expressions[0], ctx);
    }

    return "";
  }

  visitModifiers(modifiers: CSTNode[], ctx: PrintContext): string {
    return modifiers.map((mod) => this.visitor.visit(mod, ctx)).join(" ");
  }

  visitDefinition(node: CSTNode, ctx: PrintContext): string {
    let result = "";

    // Handle annotations
    const annotations = getChildNodes(node, "annotation");
    if (annotations.length > 0) {
      const annotationStr = this.visitAnnotations(annotations, ctx);
      result += annotationStr + " ";
    }

    // Handle modifiers
    const modifiers = getChildNodes(node, "modifier");
    if (modifiers.length > 0) {
      const modifierStr = this.visitModifiers(modifiers, ctx);
      result += modifierStr + " ";
    }

    // Handle specific definition types
    const classDefinition = getFirstChild(node, "classDefinition");
    if (classDefinition) {
      result += this.visitor.visit(classDefinition, ctx);
    } else {
      const objectDefinition = getFirstChild(node, "objectDefinition");
      if (objectDefinition) {
        result += this.visitor.visit(objectDefinition, ctx);
      } else {
        const traitDefinition = getFirstChild(node, "traitDefinition");
        if (traitDefinition) {
          result += this.visitor.visit(traitDefinition, ctx);
        } else {
          const enumDefinition = getFirstChild(node, "enumDefinition");
          if (enumDefinition) {
            result += this.visitor.visit(enumDefinition, ctx);
          } else {
            const extensionDefinition = getFirstChild(
              node,
              "extensionDefinition",
            );
            if (extensionDefinition) {
              result += this.visitor.visit(extensionDefinition, ctx);
            } else {
              const valDefinition = getFirstChild(node, "valDefinition");
              if (valDefinition) {
                result += this.visitor.visit(valDefinition, ctx);
              } else {
                const varDefinition = getFirstChild(node, "varDefinition");
                if (varDefinition) {
                  result += this.visitor.visit(varDefinition, ctx);
                } else {
                  const defDefinition = getFirstChild(node, "defDefinition");
                  if (defDefinition) {
                    result += this.visitor.visit(defDefinition, ctx);
                  } else {
                    const givenDefinition = getFirstChild(
                      node,
                      "givenDefinition",
                    );
                    if (givenDefinition) {
                      result += this.visitor.visit(givenDefinition, ctx);
                    } else {
                      const typeDefinition = getFirstChild(
                        node,
                        "typeDefinition",
                      );
                      if (typeDefinition) {
                        result += this.visitor.visit(typeDefinition, ctx);
                      } else {
                        const assignmentStatement = getFirstChild(
                          node,
                          "assignmentStatement",
                        );
                        if (assignmentStatement) {
                          result += this.visitor.visit(
                            assignmentStatement,
                            ctx,
                          );
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return result;
  }

  visitPattern(node: CSTNode, ctx: PrintContext): string {
    const identifiers = getChildNodes(node, "Identifier");
    if (identifiers.length > 0) {
      return identifiers[0].image;
    }

    const underscores = getChildNodes(node, "Underscore");
    if (underscores.length > 0) {
      return "_";
    }

    const literal = getFirstChild(node, "literal");
    if (literal) {
      return this.visitor.visit(literal, ctx);
    }

    const leftParens = getChildNodes(node, "LeftParen");
    if (leftParens.length > 0) {
      // Tuple pattern or parenthesized pattern
      const patterns = getChildNodes(node, "pattern");
      if (patterns.length > 1) {
        const patternResults = patterns.map((p: CSTNode) =>
          this.visitor.visit(p, ctx),
        );
        return "(" + patternResults.join(", ") + ")";
      } else if (patterns.length === 1) {
        return "(" + this.visitor.visit(patterns[0], ctx) + ")";
      }
    }

    const patterns = getChildNodes(node, "pattern");
    if (patterns.length > 0) {
      // Constructor pattern or other complex patterns
      return this.visitor.visit(patterns[0], ctx);
    }

    return "";
  }
}
